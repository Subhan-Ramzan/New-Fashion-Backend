module.exports = {
    async index(ctx) {
      try {
        // DB ko ping karne ke liye simple query
        await strapi.db.connection.raw('SELECT 1');
  
        ctx.send({
          status: 'ok',
          message: 'Backend and Database are healthy!',
          timestamp: new Date(),
        });
      } catch (error) {
        ctx.send({
          status: 'error',
          message: 'Database connection failed!',
          error: error.message,
          timestamp: new Date(),
        });
      }
    },
  };
  