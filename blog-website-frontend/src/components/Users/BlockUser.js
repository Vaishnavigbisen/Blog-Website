import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  fetchUserDetailsAction,
  blockUserAction,
} from "../../redux/slices/users/usersSlices";

const formSchema = Yup.object({
  isBlocked: Yup.string().required("select an option"),
});
const BlockUser = (props) => {
  //destructure props
  const {
    computedMatch: {
      params: { id },
    },
  } = props;
  const dispatch = useDispatch();
  //store
  const user = useSelector((state) => state?.user);
  const { isBlocked } = user;
  useEffect(() => {
    dispatch(fetchUserDetailsAction(id));
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      isBlocked: false,
    },
    onSubmit: (values) => {
      console.log(Boolean(values));
      const data = {
        id,
        ...Boolean(values),
      };
      dispatch(blockUserAction(data));
    },
    validationSchema: formSchema,
  });
  //Redirect
  // if (isBlocked) {
  //   return <Redirect to={`/users`} />;
  // }
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h1>
        Lorem ipsum dolor sit loremLorem ipsum dolor sit loremLorem ipsum dolor
        sit loremLorem ipsum dolor sit lorem
      </h1>
      <form onSubmit={formik.handleSubmit}>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <select
          onBlur={formik.handleBlur("isBlocked")}
          onChange={formik.handleChange("isBlocked")}
          id="location"
          name="location"
          className="mt-1 p-2 border-2  block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue="Canada"
        >
          <option value="true">True</option>
          <option default value="false">
            False
          </option>
        </select>
        <div className="text-red-400 mb-2">
          {formik.touched.isBlocked && formik.errors.isBlocked}
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default BlockUser;
