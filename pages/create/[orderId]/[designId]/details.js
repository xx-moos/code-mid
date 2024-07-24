import Details from "components/checkout/Details";
import Meta from "components/common/Meta";
import withState from "hocs/withState";
import useOrder from "hooks/useOrder";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import CustomShape from "redux/models/CustomShape";

const DetailsPage = () => {
  const dispatch = useDispatch();
  const { order } = useOrder();
  const isShippingQuotesLoading = useSelector(
    Checkout.selectors.getShippingQuotesLoading
  );
  const shapes = useSelector(Checkout.selectors.getShapesList);
  const scents = useSelector(Checkout.selectors.getScentsList);

  useEffect(() => {
    if (order?.id && (!shapes.length || !scents.length)) {
      dispatch(Checkout.types.getShapes());
      dispatch(Checkout.types.getStrings());
      dispatch(Checkout.types.getScents());
    }
    dispatch(CustomShape.types.delete());
    dispatch(Checkout.types.updateCheckout({ customCropType: "" }));

    // It fixes the bug: refresh when loading new quotes
    return () => {
      dispatch(
        Checkout.types.updateCheckout({
          ...(isShippingQuotesLoading && {
            shippingQuotes: null,
          }),
        })
      );
    };
  }, [order?.id]);

  return (
    <>
      <div id="top"></div>

      <Meta
        title="Air Freshener Fragrances | Custom Car Air Fresheners"
        description="Make My Freshener offers a variety of distinct shapes to choose from. If you have a design in mind for your custom car air freshener, find a shape that compliements it!"
        canonicalLink="https://www.makemyfreshener.com/create/shapes/"
      />
      <div className="flex flex-col items-stretch flex-1 px-5 -mt-6 lg:flex-row lg:mt-6 lg:p-0">
        <Details />
      </div>
    </>
  );
};

export default withState(DetailsPage);
