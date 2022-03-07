import { toast } from "react-toastify";

const toasterNotification = (msg) => {
  const notify = () =>
    toast.success(`😀 ${msg}`, {
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

export default toasterNotification;
