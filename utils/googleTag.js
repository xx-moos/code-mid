export const track = (event, data) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...(event && { event }),
    ...data,
  });
};

function getUserDataObject(order, customer) {
  const firstName = customer?.name?.split(" ")?.[0] || "";
  const lastName = customer?.name?.split(" ")?.[1] || "";
  const shipment = order?.shipments?.[0];
  return {
    user_id: `${order?.customer || customer?.customer_id}`,
    phone_number: shipment?.phone,
    email_address: customer?.email || "",
    address: {
      first_name: firstName,
      last_name: lastName,
      city: shipment?.city || "",
      region: shipment?.state || "",
      postal_code: shipment?.postal_code || "",
      country: shipment?.country || "",
    },
  };
}

export const trackOrder = async (order, customer) => {
  track("", { ecommerce: null });
  track("purchase", {
    shipping_tier: `${order.shipments[0].method.provider} - ${order.shipments[0].method.service}`,
    rush: order.pricing.rush,
    rush_tier: order.rush_option?.name || "10 days",
    coupon_value: order.pricing.discount || 0,
    user_data: getUserDataObject(order, customer),
    ecommerce: {
      ...getEcommerceObjByOrder(order),
      coupon: order.coupon_code || "",
      transaction_id: order.id,
      value: order.pricing.total,
      tax: order.pricing.tax,
      shipping: order.pricing.shipping,
    },
  });
};

export const contactGA = () => {
  track("Form Submission");
};

export const DesignListGA = () => {
  track("Account Orders");
};

export const CartRushGA = () => {
  track("Cart Rush");
};

function normalizeOrderItemToTrack(item, index) {
  const attrs = item.attributes;
  const shape = attrs.find((att) => att.category === "Shape");
  const product = attrs.find((att) => att.category === "Freshener");
  const scent = attrs.find((att) => att.category === "Scent");
  const string = attrs.find((att) => att.category === "String");
  return {
    item_id: `${shape.id}`,
    item_name: shape.name?.replace(" - Full Color", ""),
    item_category: scent.name,
    item_category2: string.name,
    item_category3: product.name,
    quantity: item.quantity,
    index,
    price: +item.price || 0,
  };
}

function getEcommerceObjByOrder(order) {
  return {
    currency: "USD",
    value: order?.items.reduce((acc, item) => +item.total + acc, 0),
    items: order?.items.map((orderItem, index) =>
      normalizeOrderItemToTrack(orderItem, index)
    ),
  };
}

export const trackViewItem = (shape) => {
  track("", { ecommerce: null });
  track("view_item", {
    ecommerce: {
      currency: "USD",
      value: 0,
      items: [
        {
          index: 0,
          item_id: shape.id,
          item_name: shape.name,
          quantity: 1,
        },
      ],
    },
  });
};

export const trackViewCart = (order, customer) => {
  track("", { ecommerce: null });
  track("view_cart", {
    user_data: getUserDataObject(order, customer),
    ecommerce: getEcommerceObjByOrder(order),
  });
};

export const trackAddToCart = (order, customer) => {
  track("", { ecommerce: null });
  track("add_to_cart", {
    user_data: getUserDataObject(order, customer),
    ecommerce: getEcommerceObjByOrder(order),
  });
};

export const trackRemoveFromCart = (order, customer, item) => {
  track("", { ecommerce: null });
  track("remove_from_cart", {
    user_data: getUserDataObject(order, customer),
    ecommerce: {
      ...getEcommerceObjByOrder(order),
      items: [normalizeOrderItemToTrack(item, 0)],
    },
  });
};

export const trackSignUp = () => {
  track("sign_up", { method: "email" });
};

export const trackSignIn = () => {
  track("login", { method: "email" });
};

export const trackNotFound = () => {
  track("page_not_found");
};

export const trackBeginCheckout = (order, customer) => {
  track("", { ecommerce: null });
  track("begin_checkout", {
    user_data: getUserDataObject(order, customer),
    ecommerce: getEcommerceObjByOrder(order),
  });
};

export const trackAddShippingInfo = (order, customer) => {
  track("", { ecommerce: null });
  track("add_shipping_info", {
    user_data: getUserDataObject(order, customer),
    ecommerce: getEcommerceObjByOrder(order),
  });
};

export const trackAddPaymentInfo = (order, customer) => {
  track("", { ecommerce: null });
  track("add_payment_info", {
    user_data: getUserDataObject(order, customer),
    ecommerce: {
      ...getEcommerceObjByOrder(order),
      payment_type: "Credit Card",
    },
  });
};
