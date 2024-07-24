import PropTypes from "prop-types";
import Steps from "./Steps";
import CheckoutMobileBottomPanel from "./cart/MobileCart";

const MainWrapper = ({
  children,
  disableMobileOrderSumary,
  disableSteps = false,
}) => {
  return (
    <>
      <main className="flex-1 h-full justify-center flex mt-10 lg:mt-0 ">
        <section
          aria-labelledby="primary-heading"
          className="min-w-0 max-w-2xl flex-1 h-full flex flex-col lg:order-last"
        >
          {!disableSteps && (
            <div className="max-w-2xl">
              <Steps />
            </div>
          )}

          {children}
        </section>
      </main>
      {!disableMobileOrderSumary && (
        <div className="flex flex-col w-full pt-4 border-t lg:hidden">
          <div className="fixed bottom-0 left-0 z-10 sm:z-0 flex flex-col w-full gap-0 sm:relative sm:flex-row sm:gap-3 shadow-[0px_0px_5px_rgba(0,0,0,0.2)] sm:shadow-none">
            <CheckoutMobileBottomPanel />
          </div>
        </div>
      )}
    </>
  );
};

MainWrapper.propTypes = {
  children: PropTypes.node,
};

export default MainWrapper;
