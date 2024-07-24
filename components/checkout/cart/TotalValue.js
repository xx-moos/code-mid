import useCheckout from "hooks/useCheckout";
import useOrder from "hooks/useOrder";
import { useSelector } from "react-redux";
import Customer from "redux/models/Customer";

export default function TotalValue() {
  const { order } = useOrder();
  const selectedLocation = useSelector(
    Customer.selectors.getCustomerSelectedLocation
  );

  const { previewShipping } = useCheckout();
  const orderTotal = order?.pricing?.total;
  const previewShipPrice = previewShipping?.option?.amount || 0;
  const totalValue = selectedLocation?.is_preview
    ? orderTotal + previewShipPrice
    : orderTotal;

  return <>${totalValue.toFixed(2)}</>;
}
