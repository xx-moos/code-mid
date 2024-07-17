import { toast } from "react-toastify";

export function handleNotAllowedError(error, router, isLogged) {
  if ([401, 403].includes(error?.response?.status)) {
    if (!isLogged) {
      toast.error("You must be logged to perform this action.");
      router.push(
        `/auth/signin?${new URLSearchParams({
          redirectUrl: router.asPath,
        })}`
      );
    } else {
      toast.error("You do not have permission to perform this action.");
      router.push("/");
    }
  } else {
    toast.error("Something went wrong!");
  }
}
