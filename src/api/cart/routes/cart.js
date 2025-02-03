module.exports = {
  routes: [
    {
      method: "POST",
      path: "/cart",
      handler: "cart.addToCart",
    },
    {
      method: "GET",
      path: "/cart/:email",
      handler: "cart.getCart",
    },
    {
      method: "DELETE",
      path: "/cart",
      handler: "cart.removeItemFromCart",
    },
    {
      method: "PUT",
      path: "/cart/quantity",
      handler: "cart.updateItemQuantity", // New route for quantity update
    },
  ],
};
