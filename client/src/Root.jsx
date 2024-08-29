import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "./pages";

const Root = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Root;
