// models/Country.js
import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  countryName: { type: String, required: true },
  alpha2Code: { type: String, required: true },
  alpha3Code: { type: String, required: true },
  countryCode: { type: Number, required: true }, // Ensure it's a Number type
});

const Country = mongoose.models.country_list || mongoose.model('country_list', countrySchema);

export default Country;

