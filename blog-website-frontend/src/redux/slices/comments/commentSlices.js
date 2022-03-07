import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import errorNotication from "../../../utils/errorNotication";
import toasterNotification from "../../../utils/toasterNotification";

//----------------------------------------------------------------
//Custom action to reset the data for redirect
const resetEditCommentAction = createAction("comment-edited/reset");

//-------------------------------
//Create
//-------------------------------
export const createCommentAction = createAsyncThunk(
  "comment/created",
  async (post, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    console.log(user);
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/api/comments`,
        { postId: post?.postId, description: post?.description },
        config
      );

      toasterNotification("Comment Added Successfully")(); //This function returns another function so we will call the first on and the second one
      //OR
      // const fn = toasterNotification();
      // fn()
      return data;
    } catch (err) {
      //Error notification
      errorNotication("Comment added failed")();
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
  "comment-details",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(`${baseURL}/api/comments/${id}`, config);
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
//-------------------------------
//EDIT
//-------------------------------
export const editCommentAction = createAsyncThunk(
  "comment/edited",
  async (post, { rejectWithValue, getState, dispatch }) => {
    console.log(post);
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/comments/update/${post?.id}`,
        { description: post?.description },
        config
      );
      //Dispatch
      dispatch(resetEditCommentAction());
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
//DELETE
//-------------------------------
export const deleteCommentAction = createAsyncThunk(
  "comment/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.delete(
        `${baseURL}/api/comments/delete/${id}`,
        config
      );
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
  name: "comment",
  initialState: {},
  extraReducers: {
    // create
    [createCommentAction.pending]: (state, action) => {
      state.commentLoading = true;
    },

    [createCommentAction.fulfilled]: (state, action) => {
      state.commentCreated = action.payload;
      state.commentLoading = false;
      state.commentAppErr = undefined;
      state.commentServerErr = undefined;
    },
    [createCommentAction.rejected]: (state, action) => {
      state.commentAppErr = action.payload?.message;
      state.commentServerErr = action.error?.message;
      state.commentLoading = false;
    },
    //--------------
    // Fetch Details
    //--------------
    [fetchCommentAction.pending]: (state, action) => {
      state.commentLoading = true;
    },
    [fetchCommentAction.fulfilled]: (state, action) => {
      state.commentDetails = action.payload;
      state.commentLoading = false;
      state.commentAppErr = undefined;
      state.commentServerErr = undefined;
    },
    [fetchCommentAction.rejected]: (state, action) => {
      state.commentAppErr = action.payload?.message;
      state.commentServerErr = action.error?.message;
      state.commentLoading = false;
    },
    //--------------
    // Delete
    //--------------
    [deleteCommentAction.pending]: (state, action) => {
      state.commentLoading = true;
    },
    [deleteCommentAction.fulfilled]: (state, action) => {
      state.commentDelete = action?.payload;
      state.commentLoading = false;
      state.commentAppErr = undefined;
      state.commentServerErr = undefined;
    },
    [deleteCommentAction.rejected]: (state, action) => {
      state.commentAppErr = action.payload?.message;
      state.commentServerErr = action.error?.message;
      state.commentLoading = false;
    },
    //--------------
    // Update
    //--------------
    [editCommentAction.pending]: (state, action) => {
      state.commentLoading = true;
    },
    [resetEditCommentAction]: (state, action) => {
      state.isEdited = true;
    },
    [editCommentAction.fulfilled]: (state, action) => {
      state.commentDelete = action?.payload;
      state.commentLoading = false;
      state.commentAppErr = undefined;
      state.commentServerErr = undefined;
      state.isEdited = false;
    },
    [editCommentAction.rejected]: (state, action) => {
      state.commentAppErr = action.payload?.message;
      state.commentServerErr = action.error?.message;
      state.commentLoading = false;
    },
  },
});

export default commentSlices.reducer;
