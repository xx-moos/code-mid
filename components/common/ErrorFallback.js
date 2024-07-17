import { ExclamationIcon } from "@heroicons/react/outline";
import { logError } from "lib/lazySentry";
import { useEffect } from "react";

export const ErrorFallback = ({ error, componentStack, resetError }) => {
  useEffect(() => {
    logError(error);
  }, []);
  return (
    <div className="p-4 h-[300px] mt-10 flex flex-col justify-center items-center">
      <div className="text-red-500 mb-4 flex flex-col justify-center items-center">
        <ExclamationIcon className="h-20 w-20" />
        <span className="text-center">
          An error occurred.
          <br />
          Our team has been notified and is working to resolve the issue. Thank
          you for your patience.
        </span>
      </div>
      <div className="flex gap-3">
        <button
          className="secondary-button"
          onClick={() => {
            resetError();
            window.history.back();
          }}
        >
          Go Back
        </button>
        <button
          className="primary-button"
          onClick={() => {
            resetError();
            window.location.reload();
          }}
        >
          Refresh the page
        </button>
      </div>
    </div>
  );
};
