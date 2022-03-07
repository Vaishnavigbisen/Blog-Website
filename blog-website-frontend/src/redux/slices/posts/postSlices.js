import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import errorNotication from "../../../utils/errorNotication";
import toasterNotification from "../../../utils/toasterNotification";

//----------------------------------------------------------------
//Custom action to reset the data for redirect
const resetPostDeleteAction = createAction("post-delete/reset");
const resetPostEditAction = createAction("post-edit/reset");
const resetPostCreateRequest = createAction("post-create/reset");
//Create
export const createPostAction = createAsyncThunk(
  "api/post/created",
  async (posts, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const formPostData = new FormData();
      formPostData.append("title", posts?.title);
      formPostData.append("description", posts?.description);
      formPostData.append("category", posts?.categoryId);
      formPostData.append("image", posts?.image);
      const { data } = await axios.post(
        `${baseURL}/api/posts`,
        formPostData,
        config
      );

      dispatch(resetPostCreateRequest());

      toasterNotification("Post Created")(); //This function returns another function so we will call the first on and the second one
      //OR
      // const fn = toasterNotification();
      // fn()
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
//fetch all
//-------------------------------
export const fetchPostsAction = createAsyncThunk(
  "fetch/posts",
  async (category, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${baseURL}/api/posts?category=${category}`,
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

//-------------------------------
//fetch by category
//-------------------------------
export const fetchPostsByCategoryAction = createAsyncThunk(
  "fetch/posts",
  async (postData, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(`${baseURL}/api/category`, config);
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
//fetch single Post
//-------------------------------
export const fetchPostAction = createAsyncThunk(
  "post/details",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(`${baseURL}/api/posts/${id}`, config);
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
export const editPostAction = createAsyncThunk(
  "api/post/edited",
  async (post, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/posts/${post?.id}`,
        {
          title: post?.title,
          description: post?.description,
          category: post?.category,
        },
        config
      );
      //dispatch reset action
      dispatch(resetPostEditAction());
      toasterNotification("Post Edited successfully")(); //This function returns another function so we will call the first on and the second one
      //OR
      // const fn = toasterNotification();
      // fn()
      return data;
    } catch (err) {
      if (!err.response) {
        errorNotication("Editing Failed")();
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//DELETE
export const deletePostAction = createAsyncThunk(
  "api/post/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.delete(`${baseURL}/api/posts/${id}`, config);
      //dispatch
      dispatch(resetPostDeleteAction());
      toasterNotification("Post Deleted successfully")(); //This function returns another function so we will call the first on and the second one
      //OR
      // const fn = toasterNotification();
      // fn()
      return data;
    } catch (err) {
      errorNotication("Deleting Failed")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err?.response?.data);
    }
  }
);

//Create Post Comment
export const createPostCommentAction = createAsyncThunk(
  "api/post/comment-created",
  async (comment, { rejectWithValue, getState, dispatch }) => {
    console.log(comment);
    const user = getState()?.user;
    const { userLogin } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userLogin?.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/api/post-comment`,
        comment,
        config
      );
      toasterNotification("Comment Created successfully")(); //This function returns another function so we will call the first on and the second one
      //OR
      // const fn = toasterNotification();
      // fn()
      return data;
    } catch (err) {
      errorNotication("Commenting Failed")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err?.response?.data);
    }
  }
);

//-------------------------------------------------
// Add like to post action
//------------------------------------------------
export const toggleAddLikeToPostAction = createAsyncThunk(
  "add-like-post-toggle",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    console.log(postId);
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/posts/toggle-add-like`,
        { postId: postId },
        config
      );
      // toasterNotification("Added successfully")(); //This function returns another function so we will call the first on and the second one
      //OR
      // const fn = toasterNotification();
      // fn()
      return data;
    } catch (err) {
      errorNotication("Your account is been block")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

//-------------------------------------------------
// Add Dislike like to post action
//------------------------------------------------
export const toggleAddDislikeToPostAction = createAsyncThunk(
  "add-dislike-post-toggle",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/posts/toggle-add-dislike`,
        { postId: postId },
        config
      );
      return data;
    } catch (err) {
      errorNotication("Your account is been block")();
      if (!err.response) {
        throw err;
      }
      //Customise the default error handler
      return rejectWithValue(err.response.data);
    }
  }
);

const postSlices = createSlice({
  name: "post",
  initialState: {},
  extraReducers: {
    // create
    [createPostAction.pending]: (state, action) => {
      state.postLoading = true;
    },
    [resetPostCreateRequest]: (state, action) => {
      state.isCreated = true;
    },
    [createPostAction.fulfilled]: (state, action) => {
      state.postCreated = action.payload;
      state.postLoading = false;
      state.postAppErr = undefined;
      state.postServerErr = undefined;
      state.isCreated = false;
    },
    [createPostAction.rejected]: (state, action) => {
      state.postAppErr = action.payload?.message;
      state.postServerErr = action.error?.message;
      state.postLoading = false;
    },
    //fetch all
    [fetchPostsAction.pending]: (state, action) => {
      state.postLoading = true;
    },
    [fetchPostsAction.fulfilled]: (state, action) => {
      state.postLists = action.payload;
      state.postLoading = false;
      state.postAppErr = undefined;
      state.postServerErr = undefined;
    },
    [fetchPostsAction.rejected]: (state, action) => {
      state.postAppErr = action.payload?.message;
      state.postServerErr = action.error?.message;
      state.postLoading = false;
    },

    //fetch post details
    [fetchPostAction.pending]: (state, action) => {
      state.postLoading = true;
    },
    [fetchPostAction.fulfilled]: (state, action) => {
      state.post = action.payload;
      state.postLoading = false;
      state.postAppErr = undefined;
      state.postServerErr = undefined;
    },
    [fetchPostAction.rejected]: (state, action) => {
      state.postAppErr = action.payload?.message;
      state.postServerErr = action.error?.message;
      state.postLoading = false;
    },

    //Delete post
    [deletePostAction.pending]: (state, action) => {
      state.postLoading = true;
    },
    [resetPostDeleteAction]: (state, action) => {
      state.isDeleted = true;
    },

    [deletePostAction.fulfilled]: (state, action) => {
      state.postDeleted = action.payload;
      state.postLoading = false;
      state.error = undefined;
      state.isDeleted = false;
    },
    [deletePostAction.rejected]: (state, action) => {
      state.postAppErr = action.payload?.message;
      state.postServerErr = action.error?.message;
      state.postLoading = false;
    },

    //Update post
    [editPostAction.pending]: (state, action) => {
      state.postLoading = true;
    },
    [resetPostEditAction]: (state, action) => {
      state.isUpdated = true;
    },

    [editPostAction.fulfilled]: (state, action) => {
      state.postEdited = action.payload;
      state.postLoading = false;
      state.postAppErr = undefined;
      state.postServerErr = undefined;
      state.isUpdated = false;
    },
    [editPostAction.rejected]: (state, action) => {
      state.postAppErr = action.payload?.message;
      state.postServerErr = action.error?.message;
      state.postLoading = false;
    },
    //Add like to post
    [toggleAddLikeToPostAction.pending]: (state, action) => {
      state.postLoading = true;
    },
    [toggleAddLikeToPostAction.fulfilled]: (state, action) => {
      state.likes = action.payload;
      state.postLoading = false;
      state.postAppErr = undefined;
      state.postServerErr = undefined;
    },
    [toggleAddLikeToPostAction.rejected]: (state, action) => {
      state.postLoading = false;
      state.postAppErr = action.payload?.message;
      state.postServerErr = action.error?.message;
    },

    //Add Dislike to post toggle
    [toggleAddDislikeToPostAction.pending]: (state, action) => {
      state.postLoading = true;
    },
    [toggleAddDislikeToPostAction.fulfilled]: (state, action) => {
      state.dislikes = action?.payload;
      state.postLoading = false;
      state.postAppErr = undefined;
      state.postServerErr = undefined;
    },
    [toggleAddDislikeToPostAction.rejected]: (state, action) => {
      state.postLoading = false;
      state.postAppErr = action.payload?.message;
      state.postServerErr = action.error?.message;
    },
  },
});

export default postSlices.reducer;
