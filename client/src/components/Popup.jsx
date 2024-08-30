import axios from "axios";
import React from "react";
import { MdOutlineKey } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { startRegistration } from "@simplewebauthn/browser";
const Popup = ({ setPopup, id }) => {
  const navigate = useNavigate();

  const generatePasskey = async () => {
    const url = `http://localhost:9032/api/v1/users`;
    try {
      const response = await axios.post(`${url}/register-challenge`, {
        userId: id,
      });
      const { options } = response.data;
      const authenticationResult = await startRegistration({ ...options });
      console.log(authenticationResult);
      const verificationResponse = await axios.post(`${url}/register-verify`, {
        userId: id,
        credential: authenticationResult,
      });
      if (verificationResponse.data.verified) {
        alert("Registration successful");
        setPopup(false); // Close popup on successful registration
        navigate("/login"); // Redirect to login
      } else {
        alert("Registration verification failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };
  const closePopup = () => {
    navigate("/login");
    setPopup(false);
  };
  return (
    <>
      <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm"></div>
      <div className="absolute z-10 flex flex-col items-center p-8 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl top-1/2 left-1/2 min-w-96 ">
        <p className="text-5xl text-indigo-600">
          <MdOutlineKey />
        </p>

        <h2 className="text-lg font-bold text-center">
          Do you want to
          <br />
          create a passkey?
        </h2>

        <div className="flex gap-2 mt-4">
          <button
            onClick={generatePasskey}
            type="button"
            className="px-4 py-2 text-sm font-medium text-green-600 border border-green-700 rounded bg-green-50"
          >
            Yes, I'm sure
          </button>

          <button
            onClick={closePopup}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-500 rounded bg-gray-50"
          >
            No, go back
          </button>
        </div>
      </div>
    </>
  );
};

export default Popup;
