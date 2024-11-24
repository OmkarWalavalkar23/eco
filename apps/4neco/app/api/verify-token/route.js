// app/api/verify-token/route.js
import jwt from 'jsonwebtoken';

const { JWT_SECRET_KEY } = process.env;

export async function POST(req) {
  const { token } = await req.json();
  if (!token) {
    return new Response(JSON.stringify({ message: 'Token is required' }), { status: 400 });
  }

  try {
    jwt.verify(token, JWT_SECRET_KEY); // Just verifies without decoding
    return new Response(JSON.stringify({ message: 'Token is valid' }), { status: 200 });
  } catch (error) {
    console.error('Token verification failed:', error);
    const message = error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
    return new Response(JSON.stringify({ message }), { status: 400 });
  }
}
