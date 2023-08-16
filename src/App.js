import { Fragment } from "react";

import { Route, Routes } from "react-router-dom";
import "./App.css";

import SignIn from "./layout/SignIn";
import SignUp from "./layout/SignUp";
import NavBar from "./components/NavBar";
import PrivateRoute from "./routes/privateRoute";
import Home from "./layout/Home";
import Dashboard from "./layout/Dashboard";

const App = () => {
  return (
    <Fragment>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </Fragment>
  );
};

export default App;
