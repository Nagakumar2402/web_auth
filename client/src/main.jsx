import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { SignIn, Register } from "./pages";
import Root from "./Root.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route
        index
        element={
          <h1 className="flex items-center justify-center h-[75vh] text-3xl font-bold text-center text-indigo-600">
            WelCome to Web Auth
          </h1>
        }
      />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<SignIn />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
