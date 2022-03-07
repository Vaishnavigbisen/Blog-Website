import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import toasterNotification from "../../../utils/toasterNotification";
//-------------------------------
//Custom action to reset the data for redirect
//-------------------------------
const resetCategoryCreateAction = createAction("category-created/reset");
const resetEditAction = createAction("category-updated/reset");
//-------------------------------
//Create
//-------------------------------
export const createCategoryAction = createAsyncThunk(
  "category/created",
  async (category, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;

    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/api/categories`,
        { title: category?.title },
        config
      );

      //Dispatch
      dispatch(resetCategoryCreateAction());
      //Notification
      toasterNotification("Category created successfully")();
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

//fetch all
export const fetchCategoriestAction = createAsyncThunk(
  "fetch-categories",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(`${baseURL}/api/categories/`, config);
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
//fetch single
//-------------------------------
export const fetchCategorytAction = createAsyncThunk(
  "fetch-category-details",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${baseURL}/api/categories/${id}`,
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
//EDIT
//-------------------------------
export const editCategorytAction = createAsyncThunk(
  "category/edited",
  async (category, { rejectWithValue, getState, dispatch }) => {
    console.log({ category });
    const user = getState()?.user;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/categories/update/${category?.id}`,
        { title: category?.title },
        config
      );
      //dispatch reset action
      dispatch(resetEditAction());
      //notification
      toasterNotification("Category Edited Successfully");
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
export const deleteCategoryAction = createAsyncThunk(
  "category/delete",
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
        `${baseURL}/api/categories/delete/${id}`,
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
  name: "categories",
  initialState: {},
  extraReducers: {
    // create
    [createCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    // Reset action
    [resetCategoryCreateAction]: (state, action) => {
      state.isCreated = true;
    },
    [createCategoryAction.fulfilled]: (state, action) => {
      state.categoryCreated = action.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isCreated = false;
    },
    [createCategoryAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    // Fetch all
    [fetchCategoriestAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchCategoriestAction.fulfilled]: (state, action) => {
      state.categoriesList = action.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchCategoriestAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    //--------------
    // Fetch Details
    //--------------
    [fetchCategorytAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchCategorytAction.fulfilled]: (state, action) => {
      state.categoryDetails = action.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchCategorytAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    //--------------
    // Delete
    //--------------
    [deleteCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCategoryAction.fulfilled]: (state, action) => {
      state.categoryDelete = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [deleteCategoryAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
    //--------------
    // Update
    //--------------
    [editCategorytAction.pending]: (state, action) => {
      state.loading = true;
    },
    // Redirect action
    [resetEditAction]: (state, action) => {
      state.isEdited = true;
    },
    [editCategorytAction.fulfilled]: (state, action) => {
      state.categoryUpdated = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isEdited = false;
    },
    [editCategorytAction.rejected]: (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
    },
  },
});

export default commentSlices.reducer;
