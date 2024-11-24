// app/api/check-alias/route.js
import { connectToDatabase } from '../../../shared/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const alias = searchParams.get('alias');

    if (!alias || !/^[a-zA-Z0-9_-]+$/.test(alias)) {
      return NextResponse.json({ available: false, message: 'Invalid or missing alias' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const urlsCollection = db.collection('urls');
    const aliasExists = await urlsCollection.findOne({ alias });

    return NextResponse.json({ available: !aliasExists });
  } catch (error) {
    console.error('Error checking alias:', error);
    return NextResponse.json(
      { available: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
