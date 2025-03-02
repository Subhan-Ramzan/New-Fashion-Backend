module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders",
      handler: "order.create",
    },
    {
      method: "GET",
      path: "/orders",
      handler: "order.find",
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "order.findOne",
    },
    {
      method: "DELETE",
      path: "/orders/:id",
      handler: "order.delete",
    },
  ],
};
