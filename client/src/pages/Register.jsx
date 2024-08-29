import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { LuEye } from "react-icons/lu";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationSchemaRegister } from "../utils/validationSchema";
import axios from "axios";
const Register = () => {
  const initialValues = {
    username: "",
    email: "",
    fullName: "",
    password: "",
  };
  const navigate = useNavigate();
  const onSubmit = async (values, action) => {
    const url = "http://localhost:9032/api/v1/users";
    try {
      const response = await axios.post(`${url}/register`, values);
      if (response.status === 201) {
        alert(response.data.message);
        setTimeout(() => {
          navigate("/login");
          action.resetForm();
        }, 2000);
      } else {
        alert(response.data.message || "An error occurred.");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 409) {
          alert("User with email or username already exists.");
        } else {
          alert(data.message || "An error occurred. Please try again.");
        }
      } else {
        alert("An error occurred. Please check your network and try again.");
      }
    } finally {
      action.setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
            Get started today
          </h1>

          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchemaRegister}
          >
            <Form
              action="#"
              className="p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg bg-slate-900 sm:p-6 lg:p-8"
            >
              <p className="text-lg font-medium text-center text-white">
                Sign up to your account
              </p>

              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>

                <div className="relative">
                  <Field
                    type="username"
                    name="username"
                    className="w-full p-4 text-sm text-white bg-transparent border border-gray-200 rounded-lg shadow-sm pe-12"
                    placeholder="Enter user name"
                  />

                  <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                    <FaRegUserCircle className="text-white" />
                  </span>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="absolute z-30 text-red-600 bg-white top-14 b left-3"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>

                <div className="relative">
                  <Field
                    type="email"
                    name="email"
                    className="w-full p-4 text-white bg-transparent border border-gray-200 rounded-lg shadow-sm text-smtext-white pe-12"
                    placeholder="Enter email"
                  />

                  <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                    <MdOutlineAlternateEmail className="text-white" />
                  </span>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="absolute z-30 text-red-600 bg-white top-14 b left-3"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="fullName" className="sr-only">
                  FullName
                </label>

                <div className="relative">
                  <Field
                    type="fullName"
                    name="fullName"
                    className="w-full p-4 text-white bg-transparent border border-gray-200 rounded-lg shadow-sm text-smtext-white pe-12"
                    placeholder="Enter full name"
                  />

                  <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                    <MdOutlineDriveFileRenameOutline className="text-white" />
                  </span>
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="absolute z-30 text-red-600 bg-white top-14 b left-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>

                <div className="relative">
                  <Field
                    type="password"
                    name="password"
                    className="w-full p-4 text-white bg-transparent border border-gray-200 rounded-lg shadow-sm text-smtext-white pe-12"
                    placeholder="Enter password"
                  />

                  <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                    <LuEye className="text-white" />
                  </span>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="absolute z-30 p-2 text-red-600 bg-slate-900 top-11 b left-3"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              >
                Sign up
              </button>

              <p className="text-sm text-center text-gray-500">
                Already account?{" "}
                <Link to="/login" className="underline" href="#">
                  Sign in
                </Link>
              </p>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
