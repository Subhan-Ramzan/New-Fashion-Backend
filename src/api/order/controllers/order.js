"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  // Create a new order
  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      // Ensure userEmail is provided
      if (!data.userEmail) {
        return ctx.badRequest("userEmail is required.");
      }

      // Create the order
      const order = await strapi.service("api::order.order").create({ data });
      return ctx.send(order, 201);
    } catch (error) {
      return ctx.send({ error: error.message }, 400);
    }
  },

  // Get all orders for a specific user (filtered by userEmail)
  async find(ctx) {
    try {
      const { userEmail } = ctx.query;

      // If userEmail is provided, filter orders by userEmail
      const filters = userEmail ? { userEmail } : {};
      const orders = await strapi.entityService.findMany("api::order.order", {
        filters,
      });

      return ctx.send(orders);
    } catch (error) {
      return ctx.send({ error: error.message }, 400);
    }
  },

  // Get a specific order by ID
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const order = await strapi.service("api::order.order").findOne(id);

      if (!order) {
        return ctx.send({ error: "Order not found" }, 404);
      }

      return ctx.send(order);
    } catch (error) {
      return ctx.send({ error: error.message }, 400);
    }
  },

  // Delete an order by ID
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const order = await strapi.service("api::order.order").delete(id);

      if (!order) {
        return ctx.send({ error: "Order not found" }, 404);
      }

      return ctx.send({ message: "Order deleted successfully" });
    } catch (error) {
      return ctx.send({ error: error.message }, 400);
    }
  },
}));
