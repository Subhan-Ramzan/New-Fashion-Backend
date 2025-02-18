"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({

  // Create a new order
  async createOrder(ctx) {
    const { email, items, total, status } = ctx.request.body;

    if (!email || !items) {
      return ctx.badRequest("Email and items are required.");
    }

    try {
      // Create a new order record. By default, status will be set to "Processing" if not provided.
      const newOrder = await strapi.entityService.create("api::order.order", {
        data: {
          userEmail: email,
          items: items,
          total: total,
          status: status || "Processing",
        },
      });

      return ctx.send({
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to create order.");
    }
  },

  // Get all orders for a given email
  async getOrders(ctx) {
    const { email } = ctx.params;

    if (!email) {
      return ctx.badRequest("Email is required.");
    }

    try {
      const orders = await strapi.entityService.findMany("api::order.order", {
        filters: { userEmail: email },
      });

      if (orders && orders.length > 0) {
        return ctx.send(orders);
      } else {
        return ctx.notFound("No orders found.");
      }
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to fetch orders.");
    }
  },

  // Cancel an order (only if the order status is "Processing")
  async cancelOrder(ctx) {
    const { email, orderId } = ctx.request.body;

    if (!email || !orderId) {
      return ctx.badRequest("Email and orderId are required.");
    }

    try {
      // Fetch the order by ID and ensure it belongs to the user
      const order = await strapi.entityService.findOne("api::order.order", orderId, {
        filters: { userEmail: email },
      });

      if (!order) {
        return ctx.notFound("Order not found.");
      }

      if (order.status.toLowerCase() !== "processing") {
        return ctx.badRequest("Only orders with a 'Processing' status can be cancelled.");
      }

      // Update the order status to "Cancelled"
      const updatedOrder = await strapi.entityService.update("api::order.order", orderId, {
        data: { status: "Cancelled" },
      });

      return ctx.send({
        message: "Order cancelled successfully",
        order: updatedOrder,
      });
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to cancel order.");
    }
  },

  // Order Again functionality: For orders that are "Cancelled", create a new order with the same details.
  async orderAgain(ctx) {
    const { email, orderId } = ctx.request.body;

    if (!email || !orderId) {
      return ctx.badRequest("Email and orderId are required.");
    }

    try {
      // Fetch the cancelled order
      const order = await strapi.entityService.findOne("api::order.order", orderId, {
        filters: { userEmail: email },
      });

      if (!order) {
        return ctx.notFound("Order not found.");
      }

      if (order.status.toLowerCase() !== "cancelled") {
        return ctx.badRequest("Only cancelled orders can be reordered.");
      }

      // Create a new order using the same items and total, resetting the status to "Processing"
      const newOrder = await strapi.entityService.create("api::order.order", {
        data: {
          userEmail: email,
          items: order.items,
          total: order.total,
          status: "Processing",
        },
      });

      return ctx.send({
        message: "Order placed again successfully",
        order: newOrder,
      });
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Failed to reorder.");
    }
  },

}));
