import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { getImageDataFromSide } from "utils/designer/canvas";
import Stage from "redux/models/Stage";
import Modal from "components/common/Modal";
import Order from "redux/models/Order";
import { useRouter } from "next/router";
import { ArrowRightIcon, ExclamationCircleIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";

export const IncompleteItemsModal = ({ onClose }) => {
  const order = useSelector(Order.selectors.getOrder);

  const router = useRouter();

  return (
    <Modal size="md" isOpened={true} onClose={onClose}>
      <div className="flex flex-col divide-y divide-slate-200">
        <div className="flex justify-center	relative p-4">
          <h4 className="text-center text-lg text-red-500 flex flex-row items-center ">Artwork Missing!</h4>
          <button
            type="button"
            className="absolute right-[1rem] top top-[0.7rem] text-xl opacity-40"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="items-center justify-center flex flex-1">
          <p className="max-w-lg text-center text-lg text-gray-600 my-12">
          <b>Some items in your order are missing artwork.</b><br/>Please go to your
            cart, either delete those items or add the missing artwork before
            checking out. Thank you!
          </p>
        </div>
        <div className="flex justify-center p-4">
          <button
            className="blue-button flex justify-center items-center"
            onClick={() => router.push(`/cart/${order?.id}`)}
          >
            Go to Cart <ArrowRightIcon className="h-4 w-4  ml-2"/>
          </button>
        </div>
      </div>
    </Modal>
  );
};

