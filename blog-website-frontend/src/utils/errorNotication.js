import { toast } from "react-toastify";

const errorNotication = (msg) => {
  const notify = () =>
    toast.error(`😭 ${msg}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  return notify;
};

export default errorNotication;
