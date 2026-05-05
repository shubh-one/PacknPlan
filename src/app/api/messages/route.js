import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Trip from '@/models/Trip';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Verify the user owns this trip
    const trip = await Trip.findOne({ _id: tripId, userId: session.user.id });
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
    }

    const messages = await Message.find({ tripId }).sort({ createdAt: 1 }).lean();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tripId, text } = body;

    if (!tripId || !text?.trim()) {
      return NextResponse.json({ error: 'Trip ID and text are required' }, { status: 400 });
    }

    await dbConnect();

    // Verify the user owns this trip
    const trip = await Trip.findOne({ _id: tripId, userId: session.user.id });
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
    }

    const newMessage = await Message.create({
      tripId,
      senderName: session.user.name || 'Traveler',
      senderEmail: session.user.email,
      avatar: session.user.image ? '👤' : '🧑‍✈️',
      text: text.trim(),
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
