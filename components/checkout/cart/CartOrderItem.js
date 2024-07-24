import ItemDesignDisplay from "components/common/ItemDesignDisplay";
import DetailsItemDeleteButton from "../DetailsItemDeleteButton";
import Order from "redux/models/Order";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";
import Link from "next/link";

export default function CartOrderItem({ item }) {
  const dispatch = useDispatch()
  const order = useSelector(Order.selectors.getOrder);
  const customShape = useSelector(Checkout.selectors.getCustomShape);
  const shapes = useSelector(Checkout.selectors.getShapesList);

  const isCustomShape =
    item.design.shape_attribute === customShape?.attribute_id;

  const missingArtwork =
    !item?.design?.front_proof || !item?.design?.back_proof;
  return (
    <li className="flex py-6 pl-4 pr-4">
      <ItemDesignDisplay item={item} imageClassName="h-10 w-10" />

      <div className="flex flex-col flex-1 ml-2">
        <div className="flex">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
              Item #{item.id}
              {missingArtwork && (
                <Link
                  href={`/create/${order?.id}/${item.design.id}/${
                    isCustomShape ? "upload" : "design"
                  }`}
                >
                  <a
                    className={`flex text-xs bg-red-500 hover:bg-red-600 transition ease-in duration-100 rounded px-2 text-white drop-shadow w-fit`}
                    onClick={() => {
                      dispatch(
                        Checkout.types.selectShape(
                          [customShape, ...shapes].find(
                            ({ attribute_id }) =>
                              attribute_id === item.design.shape_attribute
                          )?.id
                        )
                      );
                    }}
                  >
                    Missing artwork!
                  </a>
                </Link>
              )}
            </h4>
            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
          </div>

          <div className="flex-shrink-0 flow-root ml-4">
            <DetailsItemDeleteButton item={item} icon />
          </div>
        </div>

        <div className="flex items-end justify-between flex-1 pt-2 mt-1 text-sm font-medium text-gray-900">
          <p>Qty: {item.quantity}</p>
          <div className="flex flex-col items-end justify-end">
            <span className="text-xs font-normal text-gray-500">
              Unit Price: ${parseFloat((+item.quote).toFixed(4))}
            </span>
            <p>Item Total: ${item.total}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
