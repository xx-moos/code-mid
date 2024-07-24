import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/solid";
import { Combobox } from "@headlessui/react";
import Customer from "redux/models/Customer";
import Checkout from "redux/models/Checkout";

import classNames from "classnames";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ConfirmationModal } from "components/profile/ConfirmationModal";
import LoadingSpinner from "components/common/LoadingSpinner";
import CreditCardComponent from "./CreditCardComponent";
import { stripePromise } from "config/stripeConfig";
import { trackAddPaymentInfo } from "utils/googleTag";
import useOrder from "hooks/useOrder";
import useCheckout from "hooks/useCheckout";

const createValidationSchema = (isEditing) =>
  Yup.object().shape({
    nickname: Yup.string().required("Card nickname is required"),
    name: Yup.string().required("Name on card is required"),
    month: isEditing
      ? Yup.string().required("Expiration month is required")
      : Yup.string(),
    year: isEditing
      ? Yup.string().required("Expiration year is required")
      : Yup.string(),
    postal_code: isEditing
      ? Yup.string().required("ZIP code is required")
      : Yup.string(),
    is_default: Yup.bool(),
  });

const PaymentFormContent = () => {
  const stripe = useStripe();
  const { order } = useOrder();
  const elements = useElements();
  const customer = useSelector(Customer.selectors.getCustomer);
  const { cards } = customer;
  const selectedCard = useSelector(Checkout.selectors.getSelectedCard);
  const { isAddingCard, setIsAddingCard, isEditingCard, setIsEditingCard } =
    useCheckout();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const dispatch = useDispatch();

  const handleAddNewCard = () => {
    setIsEditingCard(false);
    setIsAddingCard(true);

    values.name = "";
    values.nickname = "";
    values.is_default = true;
  };

  const handleAddCard = (data, { setSubmitting }) => {
    const successCallback = (card) => {
      if (!isEditingCard) trackAddPaymentInfo(order, customer);
      dispatch(Checkout.types.selectCard(card));
      setSubmitting(false);
    };

    if (isEditingCard) {
      dispatch(
        Checkout.types.updateCard({
          ...data,
          onSuccess: successCallback,
          cardId: selectedCard.id,
          onError: () => setSubmitting(false),
        })
      );
    } else {
      if (!elements) return;

      dispatch(
        Checkout.types.addCard({
          ...data,
          cardElement: elements.getElement(CardElement),
          stripe,
          onSuccess: successCallback,
          onError: () => setSubmitting(false),
        })
      );
    }
  };

  const handleEditCard = () => {
    setIsEditingCard(true);
    setIsAddingCard(true);

    values.nickname = selectedCard.nickname;
    values.name = selectedCard.name;
    values.month = selectedCard.exp_month;
    values.year = selectedCard.exp_year;
    values.postal_code = selectedCard.address_zip;
    values.is_default = selectedCard.default;
  };

  const {
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useFormik({
    validationSchema: createValidationSchema(isEditingCard),
    onSubmit: handleAddCard,
    initialValues: {
      nickname: "",
      name: "",
      month: "",
      year: "",
      postal_code: "",
      is_default: true,
    },
  });

  const getError = (field) => {
    if (!!(touched[field] && errors[field])) return errors[field];
  };

  useEffect(() => {
    if (selectedCard === null) {
      if (cards.length === 1) {
        dispatch(Checkout.types.selectCard(cards[0]));
      } else {
        const defaultCard =
          cards.find((card) => card.default === true) || cards[0];
        dispatch(Checkout.types.selectCard(defaultCard));
      }
    }

    if (cards.length === 0) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
      resetForm();
    }
  }, [cards]);

  return (
    <div>
      {!isAddingCard && (
        <div>
          <div className="flex flex-row items-center justify-between my-3">
            <h2 className="text-xl font-medium text-gray-900">
              Payment Method
            </h2>
            <button
              className="flex items-center gap-1 text-base link"
              onClick={handleAddNewCard}
            >
              <PlusIcon className="w-4 h-4" />
              Add card
            </button>
          </div>

          <div className="flex flex-col items-start justify-start w-full gap-2 sm:flex-row">
            <Combobox
              as="div"
              value={selectedCard}
              onChange={(card) => dispatch(Checkout.types.selectCard(card))}
              className="w-full"
            >
              <div className="relative">
                <Combobox.Button className="default-select cursor-input min-h-[39px] bg-transparent">
                  {selectedCard && (
                    <div className="pr-5 text-left">
                      <CreditCardComponent card={selectedCard} />
                    </div>
                  )}
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                    <ChevronDownIcon
                      className="w-5 h-5 text-gray-900"
                      aria-hidden="true"
                    />
                  </div>
                </Combobox.Button>

                {cards.length > 0 && (
                  <Combobox.Options className="absolute z-10 w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-none focus:outline-none sm:text-sm">
                    {cards.map((card) => (
                      <Combobox.Option
                        key={card.id}
                        value={card}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 px-8 text-sm",
                            active ? "bg-blue-600 text-white" : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <div
                              className={classNames(
                                "block",
                                selected && "font-semibold"
                              )}
                            >
                              <p>
                                <b>{card.nickname}</b>
                              </p>
                              <p
                                className={
                                  active ? "text-white" : "text-gray-600"
                                }
                              >
                                {card.name}, {card.brand} *{card.last4} Exp:{" "}
                                {card.exp_month}/{card.exp_year}{" "}
                                {card.default ? "Default" : null}
                              </p>
                            </div>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                  active ? "text-white" : "text-blue-600"
                                )}
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>

            <div className="flex items-center justify-end w-full gap-1 sm:flex-col sm:w-auto">
              <button
                type="button"
                className="blue-button"
                onClick={handleEditCard}
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="red-button"
                onClick={() => {
                  setShowConfirmationModal(true);
                }}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddingCard && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              Payment Method
            </h2>
            {values?.nickname === selectedCard?.nickname && (
              <button
                className="flex items-center gap-1 text-base link"
                onClick={() => {
                  resetForm();
                  setIsAddingCard(false);
                  setShowConfirmationModal(true);
                  setIsEditingCard(false);
                  values.name = "";
                  values.nickname = "";
                  values.is_default = true;
                }}
              >
                <TrashIcon className="w-4 h-4" />
                Delete card
              </button>
            )}
          </div>

          <div className="flex">
            <div className="w-full pr-3 sm:w-1/2">
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700"
              >
                Card nickname
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  className={classNames(
                    "default-input",
                    getError("nickname") && "border-red-600"
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nickname}
                />
              </div>
              {getError("nickname") && (
                <div className="text-xs text-red-600">
                  {getError("nickname")}
                </div>
              )}
            </div>

            <div className="w-full sm:w-1/2 pr-0.5">
              <label
                htmlFor="card_name"
                className="block text-sm font-medium text-gray-700"
              >
                Name on card
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="card_name"
                  name="name"
                  className={classNames(
                    "default-input",
                    getError("name") && "border-red-600"
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </div>
              {getError("name") && (
                <div className="text-xs text-red-600">{getError("name")}</div>
              )}
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row"
            style={{ display: isEditingCard ? "flex" : "none" }}
          >
            <div className="w-full sm:pr-3 sm:w-2/5">
              <label
                htmlFor="cc"
                className="block text-sm font-medium text-gray-700"
              >
                Card Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="cc"
                  id="cc"
                  className="default-input  disabled:cursor-not-allowed disabled:text-gray-500"
                  readOnly
                  disabled
                  value={`**** **** **** ${selectedCard?.last4}`}
                />
              </div>
            </div>
            <div className="w-full sm:pr-3 sm:w-1/5">
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700"
              >
                Month
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="month"
                  id="month"
                  autoComplete="cc-exp-month"
                  className={classNames(
                    "default-input",
                    getError("month") && "border-red-600"
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.month}
                />
              </div>
              {getError("month") && (
                <div className="text-xs text-red-600">{getError("month")}</div>
              )}
            </div>

            <div className="w-full sm:pr-3 sm:w-1/5">
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="year"
                  id="year"
                  autoComplete="cc-exp-year"
                  className={classNames(
                    "default-input",
                    getError("year") && "border-red-600"
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.year}
                />
              </div>
              {getError("year") && (
                <div className="text-xs text-red-600">{getError("year")}</div>
              )}
            </div>

            <div className="w-full sm:w-1/5">
              <label
                htmlFor="postal_code"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  autoComplete="postal-code"
                  className={classNames(
                    "default-input",
                    getError("postal_code") && "border-red-600"
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.postal_code}
                />
              </div>
              {getError("postal_code") && (
                <div className="text-xs text-red-600">
                  {getError("postal_code")}
                </div>
              )}
            </div>
          </div>

          <div
            className="sm:col-span-3"
            style={{ display: isEditingCard ? "none" : "block" }}
          >
            <label
              htmlFor="card"
              className="block text-sm font-medium text-gray-700"
            >
              Card details
            </label>

            <div
              style={{
                border: "1px solid #808080",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <div className="row">
                <CardElement />
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-4 sm:col-span-4">
            <div className="flex items-center">
              <input
                id="is_default"
                name="is_default"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-none"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.is_default}
              />
              <div className="ml-2">
                <label
                  htmlFor="is_default"
                  className="text-sm font-medium text-gray-900"
                >
                  Mark as default card
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4 mt-4 sm:flex-row">
            {!!cards.length && (
              <button
                className="clear-button"
                type="button"
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="items-center blue-button"
              disabled={isSubmitting}
            >
              {isSubmitting && <LoadingSpinner />}
              Save
            </button>
          </div>
        </form>
      )}

      <ConfirmationModal
        variant="danger"
        isOpened={showConfirmationModal}
        onCancel={() => setShowConfirmationModal(false)}
        onConfirm={() => {
          dispatch(
            Checkout.types.deleteCard({
              id: selectedCard?.id,
              cb: (newCards) => {
                const defaultCard =
                  newCards.find((card) => card.default === true) || newCards[0];
                dispatch(Checkout.types.selectCard(defaultCard));
                setShowConfirmationModal(false);
              },
            })
          );
        }}
      />
    </div>
  );
};

const PaymentForm = () => (
  <Elements stripe={stripePromise} options={{ locale: "en" }}>
    <PaymentFormContent />
  </Elements>
);

export default PaymentForm;
