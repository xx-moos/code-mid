import PropTypes from "prop-types";
import MainWrapper from "components/checkout/MainWrapper";
import Checkout from "redux/models/Checkout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import CustomShape from "redux/models/CustomShape";
import { useRouter } from "next/router";
import Meta from "components/common/Meta";
import {
  getScentsList,
  getShapesList,
  getStringsList,
} from "services/CheckoutService";
import LoadingAnimationWithTexts from "components/common/LoadingAnimationWithTexts";

const CustomDesignLayout = ({
  children,
  goBackHref,
  isLoading = false,
  disableSteps = false,
}) => {
  const dispatch = useDispatch();
  const scents = useSelector(Checkout.selectors.getScentsList);
  const strings = useSelector(Checkout.selectors.getStringsList);
  const customShape = useSelector(Checkout.selectors.getCustomShape);

  const isProcessing = useSelector(CustomShape.selectors.isProcessing);

  const router = useRouter();

  useEffect(() => {
    if (scents?.length && strings?.length && customShape?.attribute_id) return;

    getScentsList().then((resp) => {
      dispatch(Checkout.types.updateCheckout({ scents: resp }));
    });
    getShapesList().then((resp) => {
      dispatch(
        Checkout.types.updateCheckout({
          shapes: resp.filter((shape) => !shape.slug.includes("custom")),
          customShape: resp.find((shape) => shape.slug.includes("custom")),
        })
      );
    });
    getStringsList().then((resp) => {
      dispatch(Checkout.types.updateCheckout({ strings: resp }));
    });
  }, []);

  return (
    <>
      <div id="top"></div>

      <Meta
        title="Air Freshener Fragrances | Custom Car Air Fresheners"
        description="Make My Freshener offers a variety of distinct shapes to choose from. If you have a design in mind for your custom car air freshener, find a shape that compliements it!"
        canonicalLink="https://www.makemyfreshener.com/create/shapes"
      />
      <div className="flex flex-col items-stretch flex-1 px-5 -mt-6 lg:flex-row lg:mt-6 lg:p-0">
        <MainWrapper disableSteps={disableSteps} disableMobileOrderSumary>
          <div className="flex-col w-full p-0 overflow-visible card">
            {children}
          </div>
          {goBackHref && (
            <div className="flex mt-5 space-x-8">
              <button
                className="flex items-center justify-center px-8 clear-button"
                onClick={() => router.push(goBackHref)}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-3 -ml-3" />
                Back
              </button>
            </div>
          )}
        </MainWrapper>

        {(isLoading || isProcessing) && <LoadingAnimationWithTexts />}
      </div>
    </>
  );
};

CustomDesignLayout.propTypes = {
  children: PropTypes.node,
};

export default CustomDesignLayout;
