import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

const Settings = () => {
  const [recaptchaValue, setRecaptchaValue] = useState('');

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recaptchaResponse: recaptchaValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('reCAPTCHA verification successful');
        } else {
          console.log('reCAPTCHA verification failed');
        }
      })
      .catch((error) => {
        console.error('Error verifying reCAPTCHA:', error);
      });
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
    
        <ReCAPTCHA
          sitekey="6Leh4S0mAAAAAPNFQvFDEFJyaxcwqEh9xpEL-XBA"
          onChange={handleRecaptchaChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Settings;
