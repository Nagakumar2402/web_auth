import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { startAuthentication } from "@simplewebauthn/browser";
const Login = () => {
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    alert(email);
    const url = `http://localhost:9032/api/v1/users`;
    try {
      const response = await axios.post(`${url}/login-challenge`, { email });
      const { options } = response.data;

      const authenticationResult = await startAuthentication({ ...options });
      const verificationResponse = await axios.post(`${url}/login-verify`, {
        email,
        credential: authenticationResult,
      });
      console.log(verificationResponse);
      if (verificationResponse.data.data.verificationResult.verified) {
        alert("Login successful");
        window.location.href = "/";
      } else {
        alert("Login verification failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-700">
      <div className="w-full max-w-md p-8 bg-white border border-gray-800 rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-indigo-600">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              onChange={(e) => handleChange(e)}
              name="email"
              id="email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              required
            />
          </div>
          <button
            className="w-full px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            type="submit"
          >
            Login with passkey
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
