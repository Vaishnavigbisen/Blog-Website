import React from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AccountVerificationAlertWarning from "./components/Alerts/AccountVerificationAlert/AccountVerificationAlertWarning";
import AccountVerificationSuccessAlert from "./components/Alerts/AccountVerificationSuccessAlert";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import UpdateComment from "./components/Comments/UpdateComment";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import CreatePost from "./components/Posts/Forms/CreatePost";
import UpdatePost from "./components/Posts/Forms/UpdatePost";
import PostDetails from "./components/Posts/PostDetails";
import PostsList from "./components/Posts/PostsList";
import SendEmail from "./components/SendEmail/SendEmail";
import BlockUser from "./components/Users/BlockUser";
import AccountVerified from "./components/Users/Forms/AccountVerified";
import Login from "./components/Users/Forms/Login";
import Register from "./components/Users/Forms/Register";
import UpdatePassword from "./components/Users/Forms/UpdatePassword";
import UpdateProfileForm from "./components/Users/Forms/UpdateProfileForm";
import UploadProfilePhoto from "./components/Users/Forms/UploadProfilePhoto";
import Profile from "./components/Users/Profile";
import UsersList from "./components/Users/UsersList";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminPrivateRoute from "./components/PrivateRoute/AdminPrivateRoute";

const App = () => {
  const user = useSelector((state) => state?.user);
  const { userAuth, verificationToken } = user;
  return (
    <BrowserRouter>
      <Navbar />
      {userAuth && !userAuth.isAccountVerified && (
        <AccountVerificationAlertWarning />
      )}
      {verificationToken && <AccountVerificationSuccessAlert />}
      <Switch>
        <PrivateRoute exact path="/send-mail/" component={SendEmail} />
        <PrivateRoute
          exact
          path="/update-comment/:id"
          component={UpdateComment}
        />
        <PrivateRoute
          exact
          path="/verify-account/:token"
          component={AccountVerified}
        />
        <AdminPrivateRoute exact path="/block-user/:id" component={BlockUser} />
        <PrivateRoute
          exact
          path="/update-password"
          component={UpdatePassword}
        />
        <AdminPrivateRoute
          exact
          path="/add-category"
          component={AddNewCategory}
        />
        <AdminPrivateRoute
          exact
          path="/category-list"
          component={CategoryList}
        />
        <PrivateRoute
          exact
          path="/update-profile"
          component={UpdateProfileForm}
        />
        <PrivateRoute
          exact
          path="/update-category/:id"
          component={UpdateCategory}
        />
        <PrivateRoute exact path="/profile/:id" component={Profile} />
        <Route exact path="/" component={HomePage} />
        <PrivateRoute
          exact
          path="/upload-profile-photo/:id"
          component={UploadProfilePhoto}
        />
        <Route exact path="/posts" component={PostsList} />
        <AdminPrivateRoute exact path="/users" component={UsersList} />
        <Route exact path="/post/:id" component={PostDetails} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/create-post" component={CreatePost} />
        <PrivateRoute exact path="/update-post/:id" component={UpdatePost} />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
