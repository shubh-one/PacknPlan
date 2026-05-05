import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function GET(request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json({ error: 'tripId is required' }, { status: 400 });
    }

    await dbConnect();

    const expenses = await Expense.find({ tripId, userId })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = expenses.map((e) => ({
      ...e,
      _id: e._id.toString(),
      tripId: e.tripId.toString(),
      userId: e.userId.toString(),
      id: e._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Expenses GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tripId, category, name, amount, date } = body;

    if (!tripId || !category || !name || !amount) {
      return NextResponse.json(
        { error: 'tripId, category, name, and amount are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const expense = await Expense.create({
      tripId,
      userId,
      category,
      name,
      amount: Number(amount),
      date: date || 'Today',
    });

    return NextResponse.json(
      {
        message: 'Expense added',
        expense: { ...expense.toObject(), _id: expense._id.toString(), id: expense._id.toString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Expenses POST error:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}
