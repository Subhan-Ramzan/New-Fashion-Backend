module.exports = {
    async search(ctx) {
      const { query } = ctx.request.query;
  
      if (!query) {
        return ctx.badRequest('Query parameter is required');
      }
  
      const products = await strapi.db.query('api::product.product').findMany({
        where: {
          $or: [
            { name: { $containsi: query } },
            { slug: { $containsi: query } },
            { subtitle: { $containsi: query } },
            { description: { $containsi: query } },
          ],
        },
        populate: ['images'], // agar images ya relations hain to unko bhi la raha
      });
  
      return products;
    },
  };
  