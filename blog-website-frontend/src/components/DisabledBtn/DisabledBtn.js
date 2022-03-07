import React from "react";

const DisabledBtn = () => {
  return (
    <button
      disabled
      type="button"
      className="py-4 w-full bg-gray-500  text-white font-bold rounded-full "
    >
      Loading please wait...
    </button>
  );
};

export default DisabledBtn;
