import PropTypes from "prop-types";
import { TrashIcon } from "@heroicons/react/solid";
import { ConfirmationModal } from "components/profile/ConfirmationModal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Items from "redux/models/Items";
import { cn } from "utils";
import Checkout from "redux/models/Checkout";
import { useRouter } from "next/router";
import { trackRemoveFromCart } from "utils/googleTag";
import Customer from "redux/models/Customer";
function DetailsItemDeleteButton({ item, className, icon }) {
  const selectedLocation = useSelector(
    Customer.selectors.getCustomerSelectedLocation
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dispatch = useDispatch();
  const customer = useSelector(Customer.selectors.getCustomer);
  const router = useRouter();

  const handleDelete = () => {
    dispatch(
      Items.types.deleteItems({
        id: item.id,
        callback: (newOrder) => {
          const pathName = window.location.pathname;

          const isDetailsPage = pathName.includes("details");
          const isCheckoutPage = pathName.includes("checkout");
          if (!isDetailsPage) trackRemoveFromCart(newOrder, customer, item);

          if (!newOrder.items.length && isCheckoutPage)
            return router.push("/create/shapes");

          dispatch(
            Checkout.types.refreshShipmentRates({ location: selectedLocation })
          );
        },
      })
    );
  };

  const hasDesign = item?.design?.front_proof || item?.design?.back_proof;

  return (
    <>
      <ConfirmationModal
        text="Are you sure you want to remove this item?"
        isOpened={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        variant="danger"
      />
      <button
        type="button"
        title={icon ? "delete item" : ""}
        onClick={() => (hasDesign ? setIsConfirmOpen(true) : handleDelete())}
        className={cn(
          "flex",
          !icon &&
            "disabled:cursor-not-allowed disabled:text-gray-500 text-red-600 h-[38px] bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center px-3 hover:bg-gray-100 focus:outline-none",
          icon && "bg-transparent text-gray-400 hover:text-gray-500",
          className
        )}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </>
  );
}

DetailsItemDeleteButton.propTypes = {
  item: PropTypes.object.isRequired,
};

export default DetailsItemDeleteButton;
