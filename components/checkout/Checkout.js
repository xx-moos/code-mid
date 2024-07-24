import { useSession } from "next-auth/react";

import AuthSection from "./AuthSection";
import CartSidebar from "./cart/CartSideBar";
import CheckoutLoggedSection from "./CheckoutLoggedSection";
import useOrder from "hooks/useOrder";

const CheckoutStep = () => {
  const { status } = useSession();
  const { order } = useOrder();
  const isLogged = status === "authenticated";

  return (
    <>
      <div className="flex justify-center flex-1 h-full px-5 mt-10 lg:mt-0">
        <section className="flex flex-col flex-1 h-full max-w-2xl min-w-0 lg:order-last">
          {!isLogged && <AuthSection />}
          {isLogged && order?.customer && <CheckoutLoggedSection />}
        </section>
      </div>
      <div className="hidden sm:block">
        {isLogged && order?.customer && <CartSidebar hideShippingRatePreview />}
      </div>
    </>
  );
};

export default CheckoutStep;
