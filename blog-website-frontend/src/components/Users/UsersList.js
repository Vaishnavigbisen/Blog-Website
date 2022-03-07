import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersAction } from "../../redux/slices/users/usersSlices";
import ServerErrors from "../ErrorMessage/SeverErrors/ServerErrors";
import UsersListHeader from "./UsersListHeader";
import UsersListItem from "./UsersListItem";

const UsersList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsersAction());
  }, [dispatch]);
  const user = useSelector((state) => state?.user);
  const { appErr, serverErr, loading, users } = user;
  console.log({ appErr, serverErr, loading, users });
  return (
    <>
      {loading ? (
        "loa"
      ) : appErr || serverErr ? (
        <ServerErrors appErr={appErr} serverErr={serverErr} />
      ) : users?.length <= 0 ? (
        <div className="text-lg text-center min-h-screen flex justify-center items-center">
          No users found
        </div>
      ) : (
        <section class="py-8 bg-gray-900 min-h-screen">
          <UsersListHeader users={users} />
          <div class="container px-4 mx-auto">
            {users?.map((user) => (
              <UsersListItem user={user} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default UsersList;
