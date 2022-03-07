import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import errorNotication from "../../../utils/errorNotication";
import toasterNotification from "../../../utils/toasterNotification";
//----------------------------------------------------------------
//Custom action to reset the data for redirect
const resetRequestAction = createAction("request/reset");
const resetLoginAction = createAction("login/reset");
const resetRegisterAction = createAction("register/reset");
const resetBlockUserAction = createAction("block-user/reset");

//----------------------------------------------------------------
//Register User
//----------------------------------------------------------------
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/api/users/register`,
        userData,
        config
      );
      //Reset the state for redirect logic
      dispatch(resetRegisterAction());
      return await data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Login User
//-------------------------------
export const loginUserAction = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/api/users/login`,
        userData,
        config
      );
      //save user into storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      //Reset the state for redirect logic
      dispatch(resetLoginAction());
      //Notification
      toasterNotification("Successfully Login")();
      return await data;
    } catch (err) {
      //Notification
      errorNotication("Login failed")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Logout
//-------------------------------
export const logoutAction = createAsyncThunk(
  "user/logout",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem("userInfo");
      //notification
      toasterNotification("Successfully Logout")();
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Block user
//-------------------------------
export const blockUserAction = createAsyncThunk(
  "block-user",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/block-user/${id}`,
        {},
        config
      );
      //notification
      toasterNotification("Successfully Blocked this user")();
      return await data;
    } catch (err) {
      //Notification
      errorNotication("Block user failed")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Block user
//-------------------------------
export const unBlockUserAction = createAsyncThunk(
  "unblock-user",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/unblock-user/${id}`,
        {},
        config
      );
      //dispath
      dispatch(resetBlockUserAction());
      //notification
      toasterNotification("Successfully unblocked this user")();
      return await data;
    } catch (err) {
      //Notification
      errorNotication("unblock user failed")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Fetch all Users
//-------------------------------
export const fetchUsersAction = createAsyncThunk(
  "users-list",
  async (userQuery, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}/api/users?name=${userQuery ? userQuery : ""}`,
        config
      );
      return await response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);
//-------------------------------
// User Profile
//-------------------------------
export const userProfileAction = createAsyncThunk(
  "profile/fetch",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    try {
      const { data } = await axios.get(
        `${baseURL}/api/users/profile/${userId}`,
        config
      );
      //save user into storage
      return await data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Fetch  User Details
//-------------------------------
export const fetchUserDetailsAction = createAsyncThunk(
  "api/users-details/fetch",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;

    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}/api/users/${userAuth?._id}`,
        config
      );
      return await response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Upload profile Photo
//-------------------------------
export const uploadProfilePhotoAction = createAsyncThunk(
  "upload-profile-photo",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const formPostData = new FormData();
      formPostData.append("image", userData?.image);
      formPostData.append("userId", userData?.userId);

      const { data } = await axios.put(
        `${baseURL}/api/users/profile-photo/${userData.userId}`,
        formPostData,
        config
      );
      toasterNotification("Profile photo uploaded successfully")();
      //Dispatch reset action
      dispatch(resetRequestAction());
      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//following User
//-------------------------------
export const followUserAction = createAsyncThunk(
  "users/follow",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/follow`,
        { followId: userId },
        config
      );
      toasterNotification("Followed successfully")();
      return await data;
    } catch (err) {
      errorNotication("You are already following this user")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Unfollow User
//-------------------------------
export const unFollowUserAction = createAsyncThunk(
  "users/unfollow",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/unfollow`,
        { unfollowId: userId },
        config
      );
      toasterNotification("Unfollowed successfully")();
      return await data;
    } catch (err) {
      errorNotication("Unfollow User Error")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
// Update user Profile
//-------------------------------
export const updateUserProfileAction = createAsyncThunk(
  "update-user-profile",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/update-profile/${userData?.id}`,
        userData,
        config
      );
      //Dispatch reset action
      dispatch(resetRequestAction());
      toasterNotification("Profile updated successfully")();
      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);
//-------------------------------
// Update password
//-------------------------------
export const updatePasswordAction = createAsyncThunk(
  "update-password",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/update-password`,
        { password: userData?.password },
        config
      );
      toasterNotification("Password Updated successfully")();
      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);
//-------------------------------
//Forget Password
//-------------------------------
export const forgetPasswordAction = createAsyncThunk(
  "api/user/forget-password",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/api/users/forgetpassword`,
        email,
        config
      );

      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);
//-------------------------------
//Reset Password
//-------------------------------
export const resetPasswordAction = createAsyncThunk(
  "api/user/reset-password",
  async (passwordDetails, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/resetpassword/${passwordDetails?.tokenFromParams}`,
        { password: passwordDetails?.password },
        config
      );

      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------
//Generate account Verification Token
//-------------------------------
export const generateAccVerificationTokenAction = createAsyncThunk(
  "account-verification-token",
  async (password, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${baseURL}/api/users/generate-verify-email-token`,
        config
      );

      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);
const a = 45;
//-------------------------------
//Update user verification account
//-------------------------------
export const verifyUserAccountAction = createAsyncThunk(
  "account-verify",
  async (token, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/verify-account`,
        { token: token },
        config
      );
      //notification
      toasterNotification("Account Verified Successfully")();
      return data;
    } catch (err) {
      errorNotication("Account verification failed")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

// //-------------------------------
// //Forget Reset Password Token
// //-------------------------------
// export const forgetPasswordAction = createAsyncThunk(
//   "block-user",
//   async (password, { rejectWithValue, getState, dispatch }) => {
//     const user = getState()?.user;
//     const { userAuth } = user;
//     const config = {
//       headers: {
//         Authorization: `Bearer ${userAuth?.token}`,
//       },
//     };
//     try {
//       const { data } = await axios.put(
//         `${baseURL}/api/users/forget-password-reset-token`,
//         { password },
//         config
//       );
//       //notification
//       toasterNotification("Successfully Blocked this user")();
//       return await data;
//     } catch (err) {
//       //Notification
//       errorNotication("Block user failed")();
//       if (!err.response) {
//         throw err;
//       }
//       //Customise the default error handler
//       return rejectWithValue(err.response.data);
//     }
//   }
// );
//-------------------------------
//Get user from store
//-------------------------------
const userLoginFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
//-------------------------------
//Users slice
//-------------------------------
const usersSlice = createSlice({
  name: "users",
  initialState: {
    userAuth: userLoginFromStorage,
  },
  extraReducers: {
    // Register User
    [registerUserAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetRegisterAction]: (state, action) => {
      state.isRegistered = true;
    },
    [registerUserAction.fulfilled]: (state, action) => {
      state.registered = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isRegistered = false;
    },

    [registerUserAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Login
    [loginUserAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetLoginAction]: (state, action) => {
      state.isLogin = true;
    },
    [loginUserAction.fulfilled]: (state, action) => {
      state.userAuth = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isLogin = true;
    },
    [loginUserAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Logout
    [logoutAction.pending]: (state, action) => {
      state.loading = true;
    },
    [logoutAction.pending]: (state, action) => {
      state.loading = true;
    },
    [logoutAction.fulfilled]: (state, action) => {
      state.userAuth = undefined;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [logoutAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Fetch users
    [fetchUsersAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUsersAction.fulfilled]: (state, action) => {
      state.users = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchUsersAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },

    // Fetch user details
    [fetchUserDetailsAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUserDetailsAction.fulfilled]: (state, action) => {
      state.userDetails = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchUserDetailsAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Profile
    [userProfileAction.pending]: (state, action) => {
      state.loading = true;
    },
    [userProfileAction.fulfilled]: (state, action) => {
      state.profile = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [userProfileAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Follow
    [followUserAction.pending]: (state, action) => {
      state.followLoading = true;
    },
    [followUserAction.fulfilled]: (state, action) => {
      state.follow = action?.payload;
      state.followLoading = false;
      state.followAppErr = undefined;
      state.followServerErr = undefined;
    },
    [followUserAction.rejected]: (state, action) => {
      state.followAppErr = action.payload?.message;
      state.followServerErr = action.error?.message;
      state.followLoading = false;
    },
    // unFollow
    [unFollowUserAction.pending]: (state, action) => {
      state.unfollowLoading = true;
    },
    [unFollowUserAction.fulfilled]: (state, action) => {
      state.unfollow = action?.payload;
      state.unfollowLoading = false;
      state.unfollowAppErr = undefined;
      state.unfollowServerErr = undefined;
    },
    [unFollowUserAction.rejected]: (state, action) => {
      state.unfollowAppErr = action.payload?.message;
      state.unfollowServerErr = action.error?.message;
      state.unfollowLoading = false;
    },
    // Generate Verification token
    [generateAccVerificationTokenAction.pending]: (state, action) => {
      state.loading = true;
    },
    [generateAccVerificationTokenAction.fulfilled]: (state, action) => {
      state.verificationToken = action?.payload;
      state.loading = false;
      state.unfollowAppErr = undefined;
      state.unfollowServerErr = undefined;
    },
    [generateAccVerificationTokenAction.rejected]: (state, action) => {
      state.unfollowAppErr = action.payload?.message;
      state.unfollowServerErr = action.error?.message;
      state.loading = false;
    },
    // Account verification
    [verifyUserAccountAction.pending]: (state, action) => {
      state.loading = true;
    },
    [verifyUserAccountAction.fulfilled]: (state, action) => {
      state.accountVerified = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [verifyUserAccountAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Block User
    [blockUserAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetBlockUserAction]: (state, action) => {
      state.isBlocked = true;
    },
    [resetRequestAction]: (state, action) => {
      state.isBlocked = true;
    },
    [blockUserAction.fulfilled]: (state, action) => {
      state.userBlocked = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isBlocked = false;
    },
    [blockUserAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
      state.isBlocked = false;
    },
    // Upload Profile photo
    [uploadProfilePhotoAction.pending]: (state, action) => {
      state.loading = true;
    },
    //Reset
    [resetRequestAction]: (state, action) => {
      state.isUploaded = true;
    },
    [uploadProfilePhotoAction.fulfilled]: (state, action) => {
      state.profileUploaded = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUploaded = false;
    },
    [uploadProfilePhotoAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Update Profile
    [updateUserProfileAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetRequestAction]: (state, action) => {
      state.isUpdated = true;
    },
    [updateUserProfileAction.fulfilled]: (state, action) => {
      state.profileUpdated = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },

    [updateUserProfileAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },

    // Forget Password token
    [forgetPasswordAction.pending]: (state, action) => {
      state.loading = true;
    },

    [forgetPasswordAction.fulfilled]: (state, action) => {
      state.tokenSentToMail = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },

    [forgetPasswordAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
  },
});

export default usersSlice.reducer;
