module.exports = {
    routes: [
      {
        method: "POST",
        path: "/order",
        handler: "order.createOrder",
      },
      {
        method: "GET",
        path: "/order/:email",
        handler: "order.getOrders",
      },
      {
        method: "PUT",
        path: "/order/cancel",
        handler: "order.cancelOrder",
      },
      {
        method: "PUT",
        path: "/order/order-again",
        handler: "order.orderAgain",
      },
    ],
  };
  