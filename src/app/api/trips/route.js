import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Expense from '@/models/Expense';

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 }).lean();

    // Calculate spent for each trip
    const tripsWithSpent = await Promise.all(
      trips.map(async (trip) => {
        const expenses = await Expense.find({ tripId: trip._id }).lean();
        const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const progress = trip.budget > 0 ? Math.round((spent / trip.budget) * 100) : 0;
        return {
          ...trip,
          _id: trip._id.toString(),
          userId: trip.userId.toString(),
          spent,
          progress,
          dates: `${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        };
      })
    );

    return NextResponse.json(tripsWithSpent);
  } catch (error) {
    console.error('Trips GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { destination, emoji, startDate, endDate, budget, travelers, status, itinerary } = body;

    if (!destination || !startDate || !endDate || !budget) {
      return NextResponse.json(
        { error: 'Destination, dates, and budget are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Sanitize itinerary — handle cases where AI returns items as strings
    let cleanItinerary = [];
    if (Array.isArray(itinerary)) {
      cleanItinerary = itinerary.map(day => {
        // Handle items that might be a string instead of array
        let parsedItems = day.items;
        if (typeof parsedItems === 'string') {
          try {
            // Try to parse as JSON (replace single quotes with double quotes for valid JSON)
            parsedItems = JSON.parse(parsedItems.replace(/'/g, '"'));
          } catch {
            parsedItems = [];
          }
        }

        return {
          day: day.day,
          title: day.title || '',
          tips: Array.isArray(day.tips) ? day.tips : (typeof day.tips === 'string' ? [day.tips] : []),
          items: Array.isArray(parsedItems) ? parsedItems.map(item => ({
            time: String(item.time || ''),
            activity: String(item.activity || ''),
            type: String(item.type || ''),
            emoji: String(item.emoji || ''),
            estimatedCost: String(item.estimatedCost || ''),
          })) : [],
        };
      });
    }
    console.log('Sanitized itinerary days:', cleanItinerary.length, 'items per day:', cleanItinerary.map(d => d.items?.length));

    const trip = await Trip.create({
      userId,
      destination,
      emoji: emoji || '✈️',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: Number(budget),
      travelers: Number(travelers) || 1,
      status: status || 'Planning',
      itinerary: cleanItinerary,
    });

    return NextResponse.json(
      { message: 'Trip created', trip: { ...trip.toObject(), _id: trip._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Trips POST error:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
