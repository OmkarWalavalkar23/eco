import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const PhoneField = ({ phoneNumber, setPhoneNumber, changeRecaptchaState, errors }) => {
  return (
    <div className="each-input-field">
      <label htmlFor="phoneNumber">
        Phone Number<span>*</span>
      </label>
      <div className="phone-container">
        <PhoneInput
          defaultCountry="in"
          value={phoneNumber}
          onChange={(phoneNumber) => {
            setPhoneNumber(phoneNumber);
            changeRecaptchaState(phoneNumber);
          }}
        />
      </div>
      {errors.phoneNumber && (
        <span className="error">{errors.phoneNumber}</span>
      )}
    </div>
  );
};

export default PhoneField;
