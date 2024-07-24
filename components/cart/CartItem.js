import Link from "next/link";
import Checkout from "redux/models/Checkout";
import { useDispatch, useSelector } from "react-redux";
import Order from "redux/models/Order";
import DetailsItemDeleteButton from "components/checkout/DetailsItemDeleteButton";
import { PencilIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import ItemDesignDisplay from "components/common/ItemDesignDisplay";
import LoadingSpinner from "components/common/LoadingSpinner";
import DetailsItem from "components/checkout/detailsItem";
import Design from "redux/models/Design";
import Redo from "assets/svg/Redo";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const order = useSelector(Order.selectors.getOrder);
  const customShape = useSelector(Checkout.selectors.getCustomShape);
  const shapes = useSelector(Checkout.selectors.getShapesList);
  const [loading, setLoading] = useState(false);
  const design = useSelector((state) =>
    Design.selectors.getDesign(state, item?.design?.id)
  );

  const isDesignArtworkBlank = useSelector((state) =>
    Design.selectors.isDesignArtworkBlank(state, item?.design?.id)
  );

  const isCustomShape =
    item.design.shape_attribute === customShape?.attribute_id;

  const missingArtwork =
    !item?.design?.front_proof || !item?.design?.back_proof;

  useEffect(() => {
    if (!design?.id)
      dispatch(Design.types.retrieveDesign({ designId: item?.design?.id }));
  }, [design]);

  return (
    <li key={item.id} className="flex flex-col md:flex-row py-6 px-2 sm:px-4">
      <ItemDesignDisplay
        item={item}
        imageClassName="w-28 h-28 md:w-16 md:h-16 mb-3 md:mb-0"
      />

      <div className="md:ml-6 flex-1 flex flex-col">
        <div className="flex">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800 flex items-center ">
              Item #{item.id}
              {missingArtwork && (
                <Link
                  href={`/create/${order?.id}/${item.design.id}/${
                    isCustomShape ? "upload" : "design"
                  }`}
                >
                  <a
                    className={`flex text-xs ml-2 bg-red-500 hover:bg-red-600 transition ease-in duration-100 rounded px-2 text-white drop-shadow`}
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
              {isDesignArtworkBlank && (
                <Link
                  href={`/create/${order?.id}/${item.design.id}/${
                    isCustomShape ? "upload" : "design"
                  }`}
                >
                  <a
                    className={`flex text-xs ml-2 bg-slate-500 hover:bg-slate-600 transition ease-in duration-100 rounded px-2 text-white drop-shadow`}
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
                    Blank artwork!
                  </a>
                </Link>
              )}
            </h4>
            <p className="mt-1 text-xs text-gray-500">{item?.description}</p>
          </div>

          <div className="flex flex-row items-center">
            <div className="mr-6">
              <Link
                href={`/create/${order?.id}/${item.design.id}/${
                  isCustomShape ? "upload" : "design"
                }`}
              >
                <a
                  className={`flex md:tooltips text-gray-400 hover:text-gray-500`}
                  onClick={() => {
                    dispatch(
                      Checkout.types.updateCheckout({ customCropType: "" })
                    );
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
                  {isCustomShape ? (
                    <>
                      <span className="hidden md:block">Redo image</span>
                      <Redo className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <span className="hidden md:block">Edit design</span>
                      <PencilIcon className="h-5 w-5" />
                    </>
                  )}
                </a>
              </Link>
            </div>

            <DetailsItemDeleteButton
              item={item}
              className="-m-2.5 bg-transparent text-gray-400 hover:text-gray-500"
              icon
            />
          </div>
        </div>

        <DetailsItem
          item={item}
          noDeleteButton
          noStringOption={isCustomShape}
          setLoading={setLoading}
        />

        <div
          className={`flex-1 pt-2 flex items-center justify-left mt-1 text-sm font-medium text-gray-900`}
        >
          <p className={loading ? "opacity-50" : "opacity-100"}>
            Total: ${parseFloat(item.total, 10).toFixed(2)}
          </p>

          {loading && (
            <LoadingSpinner className="animate-spin ml-2 -mt-1 h-5 w-5 text-blue-500" />
          )}
        </div>
      </div>
    </li>
  );
};

export default CartItem;
