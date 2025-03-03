module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/products/search',
        handler: 'product.search',
        config: {
          auth: false, // Public access dena hai to
        },
      },
    ],
  };
  