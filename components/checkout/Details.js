import MainWrapper from "./MainWrapper";
import Checkout from "redux/models/Checkout";
import Order from "redux/models/Order";
import { useSelector } from "react-redux";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import DetailsItem from "./detailsItem";
import Design from "redux/models/Design";
import CartSideBar from "./cart/CartSideBar";
import Link from "next/link";
import { useRouter } from "next/router";
import AddScentButton from "./AddScentButton";
import LoadingSpinner from "components/common/LoadingSpinner";
import { trackAddToCart } from "utils/googleTag";
import Customer from "redux/models/Customer";

const Details = () => {
  const router = useRouter();
  const { designId } = router?.query;

  const order = useSelector((state) => Order.selectors.getOrder(state));
  const customer = useSelector(Customer.selectors.getCustomer);
  const customShape = useSelector(Checkout.selectors.getCustomShape);
  const itemsList = useSelector((state) =>
    Order.selectors.getOrderItemsByDesign(state, designId)
  );

  const design = useSelector((state) =>
    Design.selectors.getDesign(state, designId)
  );
  const hasDesign = design?.back_proof || design?.front_proof;
  const isCustomShape =
    design?.shape?.attribute_id === customShape?.attribute_id;

  const onSubmit = () => {
    if (hasDesign) {
      router.push(`/cart`);
    } else if (isCustomShape) {
      trackAddToCart({ ...order, items: itemsList }, customer);
      router.push(`/create/${order?.id}/${designId}/upload`);
    } else {
      trackAddToCart({ ...order, items: itemsList }, customer);
      router.push(`/create/${order?.id}/${designId}/design`);
    }
  };

  return (
    <>
      <MainWrapper>
        <div>
          <div>
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">
                Details and Quantity
              </h2>
            </div>

            {itemsList.map((item) => (
              <DetailsItem key={item.id} item={item} noStringOption={true} />
            ))}
          </div>

          <div className="mt-4">
            <div className="pt-3 mt-2 border-t sm:mt-8">
              <AddScentButton />
            </div>
            <p className="text-sm text-gray-500">
              Bulk discounts are applied, per fragrance quantity exceeding 500.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 mt-10 mb-20">
            <div className="flex space-x-4">
              {design?.data?.front || design?.data?.back ? (
                <Link href={`/cart/${order?.id}`}>
                  <a
                    rel="nofollow"
                    className="items-center flex-1 px-4 py-3 text-base blue-button"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-3" />
                    <div className="hidden sm:block">Back to cart</div>
                    <div className="mr-5 sm:hidden">Back</div>
                  </a>
                </Link>
              ) : (
                <Link href="/create/shapes">
                  <a className="items-center flex-1 px-4 py-3 text-base secondary-button">
                    <ArrowLeftIcon className="w-5 h-5 mr-3 -ml-3" />

                    <div className="mr-5">Shape</div>
                  </a>
                </Link>
              )}

              <button
                type="button"
                disabled={itemsList.length === 0}
                onClick={onSubmit}
                className="items-center flex-1 px-4 py-3 text-base primary-button"
              >
                {hasDesign ? "Continue" : "Create design"}
              </button>
            </div>
          </div>
        </div>
      </MainWrapper>
      <CartSideBar className="lg:block hidden">
        <button
          type="button"
          disabled={itemsList.length === 0}
          onClick={onSubmit}
          className="w-full px-4 py-3 primary-button"
        >
          {hasDesign ? "Continue" : "Create design"}
        </button>
      </CartSideBar>
    </>
  );
};

export default Details;
