import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';

async function getUserId() {
  const session = await getServerSession();
  return session?.user?.id || null;
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const expense = await Expense.findOneAndDelete({ _id: id, userId });
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Expense DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
