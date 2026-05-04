import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Trip from '@/models/Trip';

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Make sure the user is actually part of this trip (for security)
    const trip = await Trip.findOne({ _id: tripId, userId: session.user.id });
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
    }

    const messages = await Message.find({ tripId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
