import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import toasterNotification from "../../../utils/toasterNotification";

//----------------------------------------------------------------
//Custom action to reset the data for redirect
const resetEmailSentAction = createAction("emailSent/reset");

//-------------------------------
//Create
//-------------------------------
export const sendEmailAction = createAsyncThunk(
  "email/sent",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;

    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/api/email`,
        {
          email: email?.email,
          subject: email?.subject,
          message: email?.message,
        },
        config
      );
      toasterNotification("Email Sent")(); //This function returns another function so we will call the first on and the second one
      //OR
      // const fn = toasterNotification();
      // fn()

      //dispatch
      dispatch(resetEmailSentAction());
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

//fetch single Comment
export const fetchCommentAction = createAsyncThunk(
  "fetch-emails",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(`${baseURL}/api/email`, config);
      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err?.response?.data);
    }
  }
);

const commentSlices = createSlice({
  name: "email",
  initialState: {},
  extraReducers: {
    // create
    [sendEmailAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetEmailSentAction]: (state, action) => {
      state.isEmailSent = true;
    },
    [sendEmailAction.fulfilled]: (state, action) => {
      state.emailSent = action.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isEmailSent = true;
    },
    [sendEmailAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
  },
});

export default commentSlices.reducer;
