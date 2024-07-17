import { Fragment, useCallback, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, LogoutIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";
import MmfLogo from "assets/svg/MmfLogo";
import useLogout from "hooks/useLogout";
import { useRouter } from "next/router";
import { getCartOrder } from "utils/storage";
import { ConfirmationModal } from "components/profile/ConfirmationModal";

const Header = ({ isLogged }) => {
  const logout = useLogout();
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const routes = [
    {
      name: "Shapes",
      href: "/create/shapes",
    },
    { name: "Fragrances", href: "/scents" },
    { name: "Guidelines", href: "/guidelines" },
    {
      name: "Pricing",
      href: "/create/shapes",
    },
    { name: "FAQ", href: "/faq" },
    {
      name: "Cart",
      onClick: () => router.push(`/cart/${getCartOrder() || ""}`),
      rel: "nofollow",
      prefetch: false,
    },
  ];

  const handleGoToWarning = useCallback((href) => {
    if (["/create/[orderId]/[designId]/lasso"].includes(router.pathname))
      setShowConfirmationModal(href);
    else router.push(href);
  }, []);

  return (
    <Popover className="flex flex-col justify-center items-center relative bg-[#6e818d] lg:fixed lg:w-full lg:top-0 lg:left-0 lg:z-30">
      <div className="max-w-[80rem] w-full">
        <div className="flex justify-between items-center px-4 py-2 sm:px-6 lg:justify-start lg:space-x-10 m-x-auto">
          <nav className="flex items-center justify-between w-full">
            <div className="hidden lg:block flex justify-start lg:w-0 lg:flex-1 h-[58px] w-full relative lg:ml-4">
              <Link href="/" className="text-gray-200 ">
                <a className="absolute flex items-center cursor-pointer lg:w-[189px] lg:h-[110px] lg:-mt-3 w-full h-[92px] -mt-4">
                  <span className="sr-only">Homepage</span>
                  <span className="hidden lg:block">
                    <MmfLogo
                      alt={`Make My Freshener`}
                      width={170}
                      height={100}
                    />
                  </span>
                </a>
              </Link>
            </div>

            <div className="lg:hidden block flex items-center justify-evenly lg:w-0 lg:flex-1 h-[58px] w-full relative lg:ml-4">
              <div className="mr-3 lg:hidden">
                <Popover.Button className="bg-slate-500 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Toggle navigation</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
              <Link href="/" className="text-gray-200 ">
                <a className="flex items-center r w-full h-[80px]">
                  <MmfLogo alt={`Make My Freshener`} width={129} height={65} />
                </a>
              </Link>
              <Link href="/create/shapes">
                <a className="blue-button ml-auto font-bold px-2 pt-1.5 pb-1 rounded flex-1">
                  <span className="text-nowrap">DESIGN NOW</span>
                </a>
              </Link>
            </div>

            <ul className="relative hidden lg:flex space-x-6 ml-32 items-center">
              {routes.map((route) => (
                <li key={route.name}>
                  {route.onClick ? (
                    <button
                      className="uppercase text-gray-50 hover:text-gray-400 font-bold transition-colors duration-100 text-lg"
                      onClick={route.onClick}
                    >
                      {route.name}
                    </button>
                  ) : (
                    <Link
                      href={route.href}
                      rel={route.rel || ""}
                      {...(!route.prefetch && { prefetch: false })}
                    >
                      <a className="uppercase text-gray-50 hover:text-gray-400 font-bold transition-colors duration-100 cursor-pointer text-lg">
                        {route.name}
                      </a>
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link href="/create/shapes">
                  <a className="whitespace-nowrap blue-button font-bold text-lg px-2 pt-1.5 pb-1 rounded">
                    DESIGN NOW
                  </a>
                </Link>
              </li>
            </ul>
            <ul className="relative hidden lg:flex ml-6 items-center gap-6 w-[88px]">
              {!isLogged && (
                <li>
                  <button
                    onClick={() => handleGoToWarning("/auth/signin")}
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-gray-800 bg-gray-200 hover:bg-gray-100 focus:outline-none "
                  >
                    SIGN IN
                  </button>
                </li>
              )}
              {isLogged && (
                <Link href="/profile" prefetch={false}>
                  <a>
                    <UserCircleIcon className="h-8 w-8 text-gray-200 cursor-pointer" />
                  </a>
                </Link>
              )}
              {isLogged && (
                <button type="button" onClick={logout}>
                  <LogoutIcon className="h-8 w-8 text-gray-200" />
                </button>
              )}
            </ul>
          </nav>
        </div>

        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-50 top-0 inset-x-0 p-2 transition transform origin-top-left lg:hidden"
          >
            {({ close }) => (
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-slate-500">
                <div className="pt-5 px-5">
                  <div className="flex items-center justify-start">
                    <div className="-ml-2 -mt-2 mb-2">
                      <Popover.Button className="bg-slate-500 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <nav className="pb-6 px-5">
                  <ul className="grid grid-cols-2 gap-4">
                    {routes.map((route) => (
                      <li key={route.name}>
                        {route.onClick ? (
                          <button
                            className="uppercase text-gray-200 hover:text-gray-400 font-medium transition-colors duration-100"
                            onClick={() => {
                              route.onClick();
                              close();
                            }}
                          >
                            {route.name}
                          </button>
                        ) : (
                          <Link
                            href={route.href}
                            rel={route.rel || ""}
                            {...(!route.prefetch && { prefetch: false })}
                          >
                            <a
                              onClick={close}
                              className="uppercase text-gray-200 hover:text-gray-400 font-medium transition-colors duration-100 cursor-pointer"
                            >
                              {route.name}
                            </a>
                          </Link>
                        )}
                      </li>
                    ))}
                    <li>
                      <Link href="/create/shapes">
                        <a
                          onClick={close}
                          className="whitespace-nowrap blue-button px-2 pt-1.5 pb-1 rounded"
                        >
                          DESIGN NOW
                        </a>
                      </Link>
                    </li>

                    {isLogged && (
                      <li>
                        <Link href="/profile" prefetch={false}>
                          <a
                            onClick={close}
                            className="uppercase text-gray-200 hover:text-gray-400 font-medium transition-colors duration-100 cursor-pointer"
                          >
                            Profile
                          </a>
                        </Link>
                      </li>
                    )}
                  </ul>
                  <div className="mt-8">
                    {!isLogged && (
                      <button
                        onClick={() => handleGoToWarning("/auth/signin")}
                        className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-800 bg-gray-200 hover:bg-gray-100 focus:outline-none"
                      >
                        Sign in
                      </button>
                    )}
                    {isLogged && (
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          close();
                        }}
                        className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-800 bg-gray-200 hover:bg-gray-100 focus:outline-none"
                      >
                        <span>Sign out</span>
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </div>
      <ConfirmationModal
        variant="danger"
        size="md"
        title="Are you sure?"
        text="You can sign in after creating your custom freshener! If you leave the page now, you might need to restart the process."
        isOpened={!!showConfirmationModal}
        onCancel={() => setShowConfirmationModal(false)}
        onConfirm={() => {
          router.push(showConfirmationModal);
          setShowConfirmationModal(false);
        }}
      />
    </Popover>
  );
};

export default Header;
