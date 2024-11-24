"use client";
import React, { useState, useEffect } from "react";
import "../styles/contact.css";
import Link from "next/link";
import PhoneField from "../components/PhoneField";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { z } from "zod";
import axios from "axios";
import parsePhoneNumberFromString from "libphonenumber-js";

const ContactPage = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_ID;
  const router = useRouter();
  const trustedEmailDomains = [".co", ".co.in", ".org", "com", "gov", "gov.in"];
  const emailSchema = z
    .string()
    .email({ message: "Invalid email address" })
    .refine(
      (email) => trustedEmailDomains.some((domain) => email.endsWith(domain)),
      {
        message: `Email must end with one of the following: ${trustedEmailDomains.join(
          ", "
        )}`,
      }
    );

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState({});
  const [formSubmissionMsg, setFormSubmissionMsg] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isRecaptchaVisible, setIsRecaptchaVisible] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isCountryListVisible, setIsCountryListVisible] = useState(false);

  const phoneNumberWithoutCountryCode = parsePhoneNumberFromString(phoneNumber);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  function validateEmail(email) {
    try {
      emailSchema.parse(email);
      return true;
    } catch (err) {
      console.log(err.errors[0].message);
      return false;
    }
  }

  const validate = () => {
    let tempErrors = {};

    if (!name) tempErrors.name = "Name is required";
    if (!mail) {
      tempErrors.mail = "Email is required";
    } else {
      if (!validateEmail(mail)) {
        tempErrors.mail = "Email format is invalid";
      }
    }
    if (!phoneNumber) tempErrors.phoneNumber = "Phone number is required";
    if (!country) tempErrors.country = "Country is required";
    if (!city) tempErrors.city = "City is required";
    if (!query) tempErrors.query = "Query is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (updatedFields) => {
    const { name, mail, phoneNumber, country, city, query } = updatedFields;

    // Validate email and TLD
    const isEmailValid = mail && validateEmail(mail);

    // Check all fields and email validity
    if (name && isEmailValid && phoneNumber && country && city && query) {
      setIsRecaptchaVisible(true);
    } else {
      setIsRecaptchaVisible(false);
      setCaptchaToken(""); // Reset CAPTCHA if validation fails
    }
  };

  function changeRecaptchaState(mobileNumber) {
    const isEmailValid = mail && validateEmail(mail);
    if (name && isEmailValid && mobileNumber && country && city && query) {
      setIsRecaptchaVisible(true);
    } else {
      setIsRecaptchaVisible(false);
      setCaptchaToken(""); // Reset CAPTCHA if validation fails
    }
  }

  const reset = () => {
    setTimeout(reload, 3000);
  };

  const reload = () => {
    router.push("/");
    setFormSubmissionMsg("");
    setCaptchaToken("");
    setShowSuccessMessage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate() && captchaToken) {
      try {
        const response = await fetch("/api/URL_0402_ContactUs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            mail,
            phoneNumber,
            country,
            city,
            query,
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setFormSubmissionMsg(data.message || "Form submitted successfully.");
          setShowSuccessMessage(true);
          reset();
        } else {
          setFormSubmissionMsg(data.message || "Failed to submit form.");
        }
      } catch (error) {
        setFormSubmissionMsg("An error occurred. Please try again.");
      }
    }
  };

  const getAllCountries = async () => {
    await axios
      .get("/api/countries")
      .then((res) => {
        let result = res?.data;
        // console.log(result, "countries list");
        setCountryList(result);
        setFilteredCountries(result);
      })
      .catch((err) => {
        console.log(err, "Error in fetching countries");
      });
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <div className="contact-page">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h1 className="contact-heading">Talk to Us</h1>

        <div className="each-input-field">
          <label htmlFor="name">
            Name<span>*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onInput={(e) =>
              handleInputChange({
                ...{
                  name: e.target.value,
                  mail,
                  phoneNumber,
                  country,
                  city,
                  query,
                },
              })
            }
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="each-input-field">
          <label htmlFor="email">
            Email<span>*</span>
          </label>
          <input
            type="email"
            id="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            onInput={(e) =>
              handleInputChange({
                ...{
                  name,
                  mail: e.target.value,
                  phoneNumber,
                  country,
                  city,
                  query,
                },
              })
            }
          />
          {errors.mail && <span className="error">{errors.mail}</span>}
        </div>

        <PhoneField
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          changeRecaptchaState={changeRecaptchaState}
          errors={errors}
        />

        <div className="each-input-field" style={{ position: "relative" }}>
          <label htmlFor="country">
            Country<span>*</span>
          </label>
          <input
            type="text"
            id="country"
            value={country}
            onFocus={() => {
              setIsCountryListVisible(true);
              setFilteredCountries(countryList);
            }}
            onBlur={() => {
              setTimeout(() => setIsCountryListVisible(false), 150);
            }}
            onChange={(e) => {
              const inputValue = e.target.value;
              setCountry(inputValue);

              const filtered = countryList?.filter((item) =>
                item?.countryName
                  ?.toLowerCase()
                  .includes(inputValue?.toLowerCase())
              );
              setFilteredCountries(filtered);

              handleInputChange({
                ...{
                  name,
                  mail,
                  phoneNumber,
                  country: inputValue,
                  city,
                  query,
                },
              });
            }}
          />
          {isCountryListVisible && (
            <div className="countries-list-dropdown">
              {filteredCountries.map((e, i) => (
                <div
                  className="each-country"
                  key={i}
                  onClick={() => {
                    setCountry(e?.countryName);
                    setIsCountryListVisible(false);
                    handleInputChange({
                      ...{
                        name,
                        mail,
                        phoneNumber,
                        country: e?.countryName,
                        city,
                        query,
                      },
                    });
                  }}
                >
                  {e?.countryName}
                </div>
              ))}
            </div>
          )}
          {errors.country && <span className="error">{errors.country}</span>}
        </div>

        <div className="each-input-field">
          <label htmlFor="city">
            City<span>*</span>
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onInput={(e) =>
              handleInputChange({
                ...{
                  name,
                  mail,
                  phoneNumber,
                  country,
                  city: e.target.value,
                  query,
                },
              })
            }
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        <div className="each-input-field">
          <label htmlFor="query">
            Query<span>*</span>
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onInput={(e) =>
              handleInputChange({
                ...{
                  name,
                  mail,
                  phoneNumber,
                  country,
                  city,
                  query: e.target.value,
                },
              })
            }
          ></textarea>
          {errors.query && <span className="error">{errors.query}</span>}
        </div>

        {isRecaptchaVisible && phoneNumberWithoutCountryCode && phoneNumberWithoutCountryCode.nationalNumber.length > 5 && phoneNumberWithoutCountryCode.nationalNumber.length < 13 ? (
          <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />
        ) : (
          <div className="empty-container"></div>
        )}

        {showSuccessMessage ? (
          <div className="submission-msg">{formSubmissionMsg}</div>
        ) : (
          <div className="contact-buttons">
            <button
              type="submit"
              className="send-button"
              disabled={!captchaToken}
            >
              Send
            </button>
            <button className="home-button">
              <Link href="/">Home Page</Link>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
