const getApiErrorMessage = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return err.response?.data;
  } else if (err.request) {
    // The request was made but no response was received
    // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return "No response was received.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return err.message || "Something went wrong!";
  }
};

export const getApiFirstErrorMessage = (err) => {
  let errorMessage = err.message || "Something went wrong!";

  if (errorMessage === "Request failed with status code 400") {
    errorMessage = "Something went wrong!";
  }

  if (err.response?.data) {
    const errorValues = Object.values(err.response?.data);
    if (Array.isArray(errorValues?.[0])) {
      errorMessage = errorValues?.[0]?.[0] || errorMessage;
    } else {
      if (typeof errorValues?.[0] === "string") {
        return errorValues?.[0];
      } else {
        return Object.values(errorValues?.[0])[0];
      }
    }
  }

  return errorMessage;
};

export default getApiErrorMessage;
