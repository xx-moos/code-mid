import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/outline";

const EmptyCart = () => {
  return (
    <div className="flex-1 flex flex-col items-center space-y-8 mt-12 px-5 lg:p-0 mb-32">
      <div className=" h-40 w-40 bg-slate-300 text-gray-500 rounded-full flex items-center justify-center">
        <ShoppingCartIcon className="h-24 w-24" />
      </div>
      <section className="text-center">
        <h1 className="text-2xl">Your cart is empty</h1>
        <h2 className="text-gray-500 text-lg">
          Looks like you haven't designed your fresheners yet
        </h2>
      </section>
      <div className="text-sm text-gray-500">
        <Link href="/create/shapes">
          <a className="blue-button text-xl">Design now!</a>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
