import classNames from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(classNames(inputs));
}

export function resetZoom() {
  const viewportmeta = document.querySelector("meta[name=viewport]");
  viewportmeta.setAttribute(
    "content",
    "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
  );
}

export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function _delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function sha256(inputString) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedString = hashArray
    .map((byte) => ("00" + byte.toString(16)).slice(-2))
    .join("");
  return hashedString;
}
