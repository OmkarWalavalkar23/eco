import React, { useState } from "react";
import Select from "react-select";
import CountryList from "react-select-country-list";

const CountryDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const options = CountryList().getData();

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  return (
    <div className="each-input-field">
        <label htmlFor="country">
            Country<span>*</span>
          </label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => {
              const updatedFields = {
                name,
                mail,
                phoneNumber,
                country: e.target.value,
                city,
                query,
              };
              setCountry(e.target.value);
              handleInputChange(updatedFields);
            }}
          />
          {errors.country && <span className="error">{errors.country}</span>}
      <Select
        value={selectedCountry}
        onChange={handleChange}
        options={options}
        placeholder="Select a country..."
      />
      {selectedCountry && (
        <div>
          <p>Selected Country: {selectedCountry.label}</p>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;

{/* <div className="each-input-field">
          <label htmlFor="country">
            Country<span>*</span>
          </label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => {
              const updatedFields = {
                name,
                mail,
                phoneNumber,
                country: e.target.value,
                city,
                query,
              };
              setCountry(e.target.value);
              handleInputChange(updatedFields);
            }}
          />
          {errors.country && <span className="error">{errors.country}</span>}
        </div> */}