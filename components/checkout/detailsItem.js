import PropTypes from "prop-types";
import Checkout from "redux/models/Checkout";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import DetailsItemDeleteButton from "./DetailsItemDeleteButton";
import Items from "redux/models/Items";
import { cn, debounce } from "utils";
import Order from "redux/models/Order";

const DetailsItem = ({ item, noStringOption, noDeleteButton, setLoading }) => {
  const dispatch = useDispatch();
  const scents = useSelector(Checkout.selectors.getScentsList);
  const strings = useSelector(Checkout.selectors.getStringsList);
  const customShape = useSelector(Checkout.selectors.getCustomShape);
  const shapes = useSelector(Checkout.selectors.getShapesList);
  const [value, setValue] = useState({ ...item });
  const itemsList = useSelector((state) =>
    Order.selectors.getOrderItemsByDesign(state, item?.design?.id)
  );
  const selectedShape = useSelector(Checkout.selectors.getSelectedShape);

  const shapeMinQuantity = useMemo(() => {
    const shapeId =
      item.attributes.find((attr) => attr.category === "Shape")?.id ||
      selectedShape;
    const selectedShapeObj = [...shapes, customShape].find(
      (shape) => shape?.attribute_id === shapeId
    );
    return selectedShapeObj?.min_qty_mmf || 50;
  }, [item, selectedShape, shapes]);

  const debounceFn = useCallback(
    debounce(
      (values) =>
        dispatch(
          Items.types.updateItem({
            ...values,
            cb: () => {
              setLoading(false);
              if (
                !!values.quantity &&
                itemsList.find((i) => i.id === item.id)?.quantity !=
                  values.quantity
              ) {
                dispatch(Checkout.types.refreshShipmentRates());
              }
            },
          })
        ),
      1000
    ),
    []
  );

  const onChange = (newValues) => {
    setLoading(true);
    setValue({ ...value, ...newValues });

    const { quantity, scent, string } = newValues;

    const newQuantity = quantity || value.quantity || item.quantity;

    if (!quantity && !scent && !string) return;
    if (newQuantity < shapeMinQuantity) return;

    const newScentId = +scent?.id || +value.scent?.id;
    const newStringId = +string?.id || +value.string?.id;

    const newScent = scents.find((s) => s.attribute_id === newScentId);
    const newString = strings.find((s) => s.attribute_id === newStringId);

    const shapeAttr = value.attributes.find(
      (attr) => attr.category === "Shape"
    );
    const scentAttr = {
      id: newScentId,
      category: "Scent",
      name: newScent.name,
    };
    const stringAttr = {
      id: newStringId,
      category: "String",
      name: newString.name,
    };
    const freshAttr = value.attributes.find(
      (attr) => attr.category === "Freshener"
    );

    const description = [shapeAttr, scentAttr, stringAttr, freshAttr]
      .filter(Boolean)
      .map((attr) => attr.name)
      .join(", ");
    const newAttrs = [shapeAttr, stringAttr, scentAttr, freshAttr];
    setValue({ ...value, ...newValues, attributes: newAttrs });

    debounceFn({
      id: value.id,
      description,
      quantity: newQuantity,
      attributes: newAttrs,
    });
  };

  return (
    <div
      key={value.id}
      className={cn(
        "mt-2 sm:mt-4 sm:mb-6 grid grid-cols-5 gap-y-2 sm:gap-x-4 bg-gray-200 px-2 pb-6 pt-1 rounded sm:p-0 sm:bg-transparent",
        !noDeleteButton ? "sm:grid-cols-8" : "sm:grid-cols-7"
      )}
    >
      <div
        className={noStringOption ? "col-span-5 sm:col-span-3" : "col-span-2"}
      >
        <label
          htmlFor="scent"
          className="block text-sm font-medium text-gray-700 -mb-1"
        >
          Fragrances
        </label>
        <div className="mt-1">
          <select
            id="scent"
            name="scent"
            value={value?.scent?.id}
            onChange={(e) =>
              onChange({
                scent: { id: e.target.value },
              })
            }
            className="py-2 px-3 block border w-full bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 sm:text-sm"
          >
            {scents.map((scent) => (
              <option key={scent.id} value={scent.attribute_id}>
                {scent.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-span-4 sm:col-span-3 relative">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 -mb-1"
        >
          Quantity
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="quantity"
            value={value.quantity}
            min={shapeMinQuantity}
            onChange={(e) =>
              onChange({ quantity: e.target.value.replace(/\D/g, "") })
            }
            id="quantity"
            className={`py-2 px-3 block border w-full rounded-md shadow-sm focus:outline-none sm:text-sm focus:border-blue-500
              ${
                value?.quantity < shapeMinQuantity
                  ? "bg-red-50 border-red-500 focus:border-red-500"
                  : ""
              }`}
          />
        </div>{" "}
        <div className="ml-1 mt-1 text-xs absolute text-gray-500">
          For this shape the minimum is {shapeMinQuantity}
        </div>
      </div>

      {!noStringOption && (
        <Listbox
          value={value?.string?.id}
          onChange={(color) => {
            onChange({
              string: { id: color },
            });
          }}
        >
          {({ open }) => (
            <div className="col-span-2">
              <Listbox.Label className="block text-sm font-medium text-gray-700">
                String
              </Listbox.Label>
              <div className="mt-1 relative">
                <Listbox.Button
                  className={classNames(
                    "relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 h-9 text-left cursor-default focus:outline-none focus:border-blue-500 sm:text-sm"
                  )}
                >
                  <span className="flex items-center">
                    <div
                      style={{
                        backgroundColor: strings.find(
                          ({ attribute_id }) =>
                            attribute_id === value?.string?.id
                        )?.color,
                        ...(strings.find(
                          ({ attribute_id }) =>
                            attribute_id === value?.string?.id
                        )?.slug === "white" && {
                          border: "1px solid #bbb",
                        }),
                      }}
                      className="flex-shrink-0 h-5 w-5 rounded-full"
                    />
                    <span className="ml-3 block truncate capitalize">
                      {
                        strings.find(
                          ({ attribute_id }) =>
                            attribute_id === value?.string?.id
                        )?.name
                      }
                    </span>
                  </span>
                  <span className="ml-3 -mr-2 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-900"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                    {strings.map((string) => (
                      <Listbox.Option
                        key={string.id}
                        className={({ active }) =>
                          classNames(
                            active && "bg-gray-200",
                            "text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9"
                          )
                        }
                        value={string.attribute_id}
                      >
                        <div className="flex items-center">
                          <div
                            className="flex-shrink-0 h-6 w-6 rounded-full"
                            style={{
                              backgroundColor: string.color,
                              ...(string.slug === "white" && {
                                border: "1px solid #bbb",
                              }),
                            }}
                          />
                          <span className={"ml-3 block truncate capitalize"}>
                            {string.name}
                          </span>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </div>
          )}
        </Listbox>
      )}
      {!noDeleteButton && (
        <div className="flex items-end justify-end">
          <DetailsItemDeleteButton item={value} />
        </div>
      )}
    </div>
  );
};

DetailsItem.propTypes = {
  setLoading: PropTypes.func,
  item: PropTypes.object,
  noStringOption: PropTypes.bool,
  noDeleteButton: PropTypes.bool,
};
DetailsItem.defaultProps = {
  setLoading: () => null,
};

export default DetailsItem;
