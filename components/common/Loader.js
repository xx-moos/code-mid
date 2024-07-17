import { useSelector } from "react-redux";

import App from "redux/models/App";
import LoadingSpinner from "./LoadingSpinner";

const Loader = () => {
  const app = useSelector(App.selectors.getApp);

  return (
    <>
      {app.isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[500] bg-white/90 grid place-items-center">
          <LoadingSpinner className="animate-spin h-36 w-36 text-blue-500" />
        </div>
      )}
    </>
  );
};

export default Loader;
