import useOrder from "hooks/useOrder";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";

export default function ShippingPrice() {
  const { order } = useOrder();
  const selectedPreview = useSelector(
    Checkout.selectors.getSelectedPreviewShipping
  );
  const shippingPrice = selectedPreview?.option
    ? selectedPreview?.option?.shipAmount.toFixed(2)
    : order?.pricing?.shipping?.toFixed(2);

  return <>${shippingPrice}</>;
}
