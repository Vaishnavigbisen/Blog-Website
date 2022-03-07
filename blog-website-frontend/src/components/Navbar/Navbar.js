import React from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import PrivateNavbar from "./PrivateNavbar/PrivateNavbar";
import PublicNavbar from "./PubicNavbar/PublicNavbar";

const Navbar = () => {
  const user = useSelector((state) => state?.user);
  const { userAuth } = user;
  const isAdmin = userAuth?.isAdmin;
  return (
    <>
      {isAdmin ? (
        <AdminNavbar isLogin={userAuth} />
      ) : userAuth ? (
        <PrivateNavbar isLogin={userAuth} />
      ) : (
        <PublicNavbar />
      )}
    </>
  );
};

export default Navbar;
