// app/api/[slug]/route.js

import { connectToDatabase } from '../../shared/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    // Debug logs to ensure the server processes the request
    console.log('Incoming request for slug:', slug);

    // Connect to the MongoDB database
    const db = await connectToDatabase();
    const urlsCollection = db.collection('urls');

    // Fetch the original URL from the database using the slug (alias)
    const urlData = await urlsCollection.findOne({ alias: slug });

    if (urlData && urlData.originalUrl) {
      console.log('Slug found in database, redirecting to:', urlData.originalUrl);
      return NextResponse.redirect(urlData.originalUrl);
    } else {
      console.log('Slug not found in database');
      return new Response('URL not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error processing redirection:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
