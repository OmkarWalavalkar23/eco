// app/api/countries/route.js
import { NextResponse } from "next/server";
import connectToDatabaseMongoose from "../../../shared/mongodbnew";
import Country from "../../../models/Country";
// import fs from "fs";
// import path from "path";

// Function to load and format country data
// const loadCountryData = () => {
//   const filePath = path.resolve("data", "countries.json");
//   const fileContent = fs.readFileSync(filePath, "utf8");
//   const data = JSON.parse(fileContent);

//   return data.map((country) => ({
//     countryName: country["Country full name"],
//     alpha2Code: country["Alpha-2 code"],
//     alpha3Code: country["Alpha-3 code"],
//     countryCode: Number(country["Country code (numeric)"]), // Convert to number
//   }));
// };

// POST method handler
// export async function POST(req) {
//   await connectToDatabaseMongoose();

//   try {
//     const countries = loadCountryData();

//     // Insert all countries into the database with increased timeout
//     await Country.insertMany(countries, { ordered: false });

//     // Returning a NextResponse object
//     return NextResponse.json(
//       { message: "Countries saved to database successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     // Returning a NextResponse object with error message
//     console.error("Error inserting country data:", error);
//     return NextResponse.json(
//       { error: "Failed to save country data", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// GET method handler
export async function GET(req) {
  await connectToDatabaseMongoose();

  try {
    // Retrieve all countries from the DB
    const countries = await Country.find({});
    return NextResponse.json(countries, { status: 200 });
  } catch (error) {
    console.error("Error retrieving country data:", error);
    return NextResponse.json(
      { error: "Failed to load country data", details: error.message },
      { status: 500 }
    );
  }
}
