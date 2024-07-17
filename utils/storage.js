export const STORAGE_CART_ORDER_KEY = "freshener__cart-order";
export const STORAGE_HOW_TO_CROP_KEY = "freshener__how-to-crop-appeared";
const STORAGE_UTM_PARAMS = "freshener__utm_params";
const UTM_PARAMETERS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export function saveCartOrder(id) {
  if (!!id) localStorage.setItem(STORAGE_CART_ORDER_KEY, id);
}

export function getCartOrder() {
  return localStorage.getItem(STORAGE_CART_ORDER_KEY);
}

export function removeCartOrder() {
  localStorage.removeItem(STORAGE_CART_ORDER_KEY);
}

export function clearReduxStore() {
  localStorage.removeItem("persist:root");
}

export function getHowToCropAppeared() {
  return Boolean(localStorage.getItem(STORAGE_HOW_TO_CROP_KEY));
}

export function setHowToCropAppeared(newState) {
  localStorage.setItem(STORAGE_HOW_TO_CROP_KEY, newState);
}

export function saveUTMParams() {
  const value = localStorage.getItem(STORAGE_UTM_PARAMS);
  if (value) return;
  const searchParams = new URLSearchParams(location.search);
  const utmData = {};
  UTM_PARAMETERS.forEach((param) => {
    if (searchParams.get(param)) utmData[param] = searchParams.get(param);
  });
  if (Object.keys(utmData)?.length)
    localStorage.setItem(STORAGE_UTM_PARAMS, JSON.stringify(utmData));
}

export function getUTMParams() {
  const value = localStorage.getItem(STORAGE_UTM_PARAMS);
  return value ? JSON.parse(value) : null;
}

export function clearUTMParams() {
  localStorage.removeItem(STORAGE_UTM_PARAMS);
}
