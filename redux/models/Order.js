import { Model, attr } from "redux-orm";

class Order extends Model {
  static modelName = "Order";

  static get fields() {
    return {
      id: attr(),
      items: attr({ getDefault: () => [] }),
    };
  }

  static types = {
    create: (payload) => ({
      type: "ORDER/CREATE",
      payload,
    }),
    postOrder: (payload) => ({
      type: "ORDER/POST",
      payload,
    }),
    retrieveOrder: (payload) => ({
      type: "ORDER/GET",
      payload,
    }),
    updateOrder: (payload) => ({
      type: "ORDER/UPLOAD",
      payload,
    }),
    updateArtwork: (payload) => ({
      type: "ORDER/UPDATE_ARTWORK",
      payload,
    }),
    approveOrder: (payload) => ({
      type: "ORDER/APPROVE",
      payload,
    }),
    rejectOrder: (payload) => ({
      type: "ORDER/REJECT",
      payload,
    }),
    attachToCustomer: (payload) => ({
      type: "ORDER/ATTACH_TO_CUSTOMER",
      payload,
    }),
    delete: (payload) => ({
      type: "ORDER/DELETE",
      payload,
    }),
    clear: (payload) => ({
      type: "ORDER/CLEAR",
      payload,
    }),
    getRecentUncompletedOrder: (payload) => ({
      type: "ORDER/GET_RECENT_UNCOMPLETE",
      payload,
    }),
  };

  static reducer(action, Order, session) {
    const order = Order.all().first();
    switch (action.type) {
      case this.types.clear().type:
        Order.delete();
        break;
      case this.types.create().type:
        Order.delete();
        const newOrder = { ...action.payload };
        if (newOrder?.items?.length) {
          newOrder.items = normalizeOrderItems(newOrder.items);
        }
        Order.create(newOrder);
        break;
      case this.types.postOrder().type:
        break;
      case this.types.retrieveOrder().type:
        break;
      case this.types.updateOrder().type:
        const updateAttributes = { ...action.payload };
        if (updateAttributes?.items?.length) {
          updateAttributes.items = normalizeOrderItems(updateAttributes.items);
        }
        order.update(updateAttributes);
        break;
      case this.types.updateArtwork().type:
        const { designId, front_proof, back_proof } = action.payload;
        const newItems = order.items.map((item) => {
          if (item.design.id === designId) {
            return {
              ...item,
              design: { ...item.design, front_proof, back_proof },
            };
          }
          return item;
        });
        order.update({ items: newItems });
        break;
      case this.types.delete().type:
        Order.delete();
        break;
    }
  }

  static selectors = {
    getOrder: (state) => {
      const order = state.Order.itemsById[state.Order.items[0]];
      if (order) {
        const newOrder = { ...order };
        newOrder.items = [...(newOrder.items || [])];
        newOrder.items.sort((itemA, itemB) => (itemA.id < itemB.id ? 1 : -1));
        return newOrder;
      }
      return order;
    },
    getOrderItems: (state) =>
      state.Order.itemsById[state.Order.items[0]]?.items || [],
    getOrderItemsByDesign: (state, design) =>
      state.Order.itemsById[state.Order.items[0]]?.items?.filter(
        (el) => el?.design?.id === design
      ) || [],
  };
}

function normalizeOrderItems(items) {
  return items.map((item) => ({
    ...item,
    // TODO create a migration on the database to remove this workaround
    description: item.description?.replace("No Fragrance", "No Scent"),
    scent: item.attributes?.find(({ category }) => category === "Scent"),
    shape: item.attributes?.find(({ category }) => category === "Shape"),
    string: item.attributes?.find(({ category }) => category === "String"),
  }));
}

export default Order;
