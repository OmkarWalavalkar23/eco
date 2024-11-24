// shared/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODBATLAS;
let client;
let db;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("MongoDB connected");
  }

  if (!db) {
    db = client.db("newdatabasecluster");
    console.log("Using database:", db.databaseName);

    // Ensure 'alias' index is unique in 'urls' collection
    const urlsCollection = db.collection("urls");
    await urlsCollection.createIndex(
      { alias: 1 },
      { unique: true, sparse: true }
    );
  }

  return db;
}

// shared/mongodb.js
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODBATLAS;

// // Global cache to prevent multiple connections in development
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectToDatabase() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(MONGODB_URI, {
//         useNewUrlParser: true, // Ensure proper parsing of the connection string
//         useUnifiedTopology: true, // Use the new MongoDB driver's unified topology
//       })
//       .then((mongooseInstance) => {
//         console.log("Connected to MongoDB with Mongoose");
//         return mongooseInstance;
//       })
//       .catch((error) => {
//         console.error("Error connecting to MongoDB:", error);
//         throw error; // Ensure connection errors are handled
//       });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectToDatabase;
