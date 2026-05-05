import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Trip from '@/models/Trip';

// GET — fetch reviews (all or filtered)
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');
    const sort = searchParams.get('sort') || 'recent';

    const filter = {};
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (category && category !== 'all') filter.category = category;
    if (userId) filter.userId = userId;

    let sortOption = { createdAt: -1 };
    if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };
    if (sort === 'helpful') sortOption = { helpful: -1, createdAt: -1 };

    const reviews = await Review.find(filter).sort(sortOption).limit(100).lean();

    // Calculate aggregate stats
    const allForStats = city ? await Review.find({ city: { $regex: city, $options: 'i' } }).lean() : reviews;
    const totalReviews = allForStats.length;
    const avgRating = totalReviews > 0
      ? (allForStats.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: allForStats.filter(r => r.rating === star).length,
      percent: totalReviews > 0 ? Math.round((allForStats.filter(r => r.rating === star).length / totalReviews) * 100) : 0,
    }));

    return NextResponse.json({
      reviews: reviews.map(r => ({ ...r, _id: r._id.toString(), userId: r.userId.toString() })),
      stats: { totalReviews, avgRating: Number(avgRating), distribution },
    });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST — create a new review
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { category, title, city, rating, subRatings, text, visitDate, tripId } = body;

    if (!category || !title || !city || !rating || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check if user has a trip to this city (for "Verified" badge)
    let verified = false;
    if (tripId) {
      const trip = await Trip.findOne({ _id: tripId, userId: session.user.id });
      if (trip) verified = true;
    } else {
      const tripToCity = await Trip.findOne({
        userId: session.user.id,
        destination: { $regex: city, $options: 'i' },
      });
      if (tripToCity) verified = true;
    }

      // Only include sub-ratings with actual values (> 0) to avoid min:1 validation errors
      const cleanedSubRatings = category === 'hotel' && subRatings
        ? Object.fromEntries(Object.entries(subRatings).filter(([, v]) => v > 0))
        : undefined;

    const review = await Review.create({
      userId: session.user.id,
      userName: session.user.name || 'Traveler',
      userImage: session.user.image || '',
      category,
      title: title.trim(),
      city: city.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      subRatings: Object.keys(cleanedSubRatings || {}).length > 0 ? cleanedSubRatings : undefined,
      text: text.trim(),
      visitDate: visitDate || '',
      tripId: tripId || undefined,
      verified,
    });

    return NextResponse.json(
      { message: 'Review created', review: { ...review.toObject(), _id: review._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

// PUT — vote helpful or edit own review
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { reviewId, action, ...updateData } = body;

    await dbConnect();

    if (action === 'helpful') {
      const review = await Review.findById(reviewId);
      if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

      const alreadyVoted = review.helpfulBy.includes(session.user.id);
      if (alreadyVoted) {
        // Undo vote
        review.helpful = Math.max(0, review.helpful - 1);
        review.helpfulBy = review.helpfulBy.filter(id => id.toString() !== session.user.id);
      } else {
        review.helpful += 1;
        review.helpfulBy.push(session.user.id);
      }
      await review.save();
      return NextResponse.json({ message: alreadyVoted ? 'Vote removed' : 'Marked helpful', helpful: review.helpful, voted: !alreadyVoted });
    }

    // Edit own review
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId: session.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!review) return NextResponse.json({ error: 'Review not found or not yours' }, { status: 404 });

    return NextResponse.json({ message: 'Review updated', review });
  } catch (error) {
    console.error('Reviews PUT error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE — delete own review
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');

    await dbConnect();
    const review = await Review.findOneAndDelete({ _id: reviewId, userId: session.user.id });

    if (!review) return NextResponse.json({ error: 'Review not found or not yours' }, { status: 404 });

    return NextResponse.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Reviews DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
