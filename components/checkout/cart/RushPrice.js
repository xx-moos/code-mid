import useOrder from "hooks/useOrder";
import { useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";

export default function RushPrice() {
  const { order } = useOrder();
  const selectedPreview = useSelector(
    Checkout.selectors.getSelectedPreviewShipping
  );
  const rushPrice = selectedPreview?.option
    ? selectedPreview?.option?.rushAmount?.toFixed(2)
    : order?.pricing?.rush?.toFixed(2);

  return <>${rushPrice}</>;
}
