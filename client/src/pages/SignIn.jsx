import React from "react";
import { Link } from "react-router-dom";
import { LuEye } from "react-icons/lu";
import { MdOutlineAlternateEmail } from "react-icons/md";
const SignIn = () => {
  return (
    <>
      <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
            Get started today
          </h1>

          <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
            sunt dolores deleniti inventore quaerat mollitia?
          </p>

          <form
            action="#"
            className="p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg bg-slate-900 sm:p-6 lg:p-8"
          >
            <p className="text-lg font-medium text-center text-white">
              Sign in to your account
            </p>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  className="w-full p-4 text-sm bg-transparent border border-gray-200 rounded-lg shadow-sm pe-12"
                  placeholder="Enter email"
                />

                <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                  <MdOutlineAlternateEmail className="text-white" />
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  className="w-full p-4 text-sm bg-transparent border border-gray-200 rounded-lg shadow-sm pe-12"
                  placeholder="Enter password"
                />

                <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                  <LuEye className="text-white" />
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
            >
              Sign in
            </button>

            <p className="text-sm text-center text-gray-500">
              No account?{" "}
              <Link to="/register" className="underline" href="Register">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
