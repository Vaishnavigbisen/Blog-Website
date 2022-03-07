import { configureStore } from "@reduxjs/toolkit";
import usersReducers from "../slices/users/usersSlices";
import postsReducers from "../slices/posts/postSlices";
import commentReducers from "../slices/comments/commentSlices";
import categoriesReducer from "../slices/categories/categoriesSlices";
import emailReducer from "../slices/sendEmail/sendEmailSlices";

export default configureStore({
  reducer: {
    // user
    user: usersReducers,
    posts: postsReducers,
    comments: commentReducers,
    categories: categoriesReducer,
    email: emailReducer,
  },
});
