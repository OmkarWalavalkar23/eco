// app/api/shorten/route.js

import { nanoid } from 'nanoid';
import { connectToDatabase } from '../../../shared/mongodb';

export async function POST(req) {
  try {
    const { originalUrl, alias } = await req.json();

    if (!originalUrl) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    const db = await connectToDatabase();
    const urlsCollection = db.collection('urls');

    // Ensure unique index on alias to prevent duplicates
    await urlsCollection.createIndex({ alias: 1 }, { unique: true }).catch(error => {
      console.error('Index creation failed:', error);
    });

    // Check if alias is taken
    if (alias) {
      const existingAlias = await urlsCollection.findOne({ alias });
      if (existingAlias) {
        return new Response(JSON.stringify({ error: 'Alias already taken' }), { status: 400 });
      }
    }

    // Use provided alias or generate a new ID if no alias is provided
    const id = alias || nanoid(7);

    // Insert the URL and alias into the database
    await urlsCollection.insertOne({
      originalUrl,
      alias: id,
      createdAt: new Date(),
    });

    console.log('Shortened URL created:', { id, originalUrl });

    return new Response(JSON.stringify({ id }), { status: 200 });
  } catch (error) {
    console.error('Error while shortening URL:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
