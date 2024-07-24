import useOrder from "hooks/useOrder";
import { useSelector } from "react-redux";
import Customer from "redux/models/Customer";

export default function TaxValue() {
  const { order } = useOrder();
  const selectedLocation = useSelector(
    Customer.selectors.getCustomerSelectedLocation
  );

  if (selectedLocation?.is_preview) return `$${order.pricing.tax.toFixed(2)}` || "$0.00";

  return `$${order?.pricing?.tax?.toFixed(2)}`;
}
