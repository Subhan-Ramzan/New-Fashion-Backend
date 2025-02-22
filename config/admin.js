
module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'default-admin-secret'), // Default value if missing
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'default-api-token-salt'), // Default value if missing
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'default-transfer-token-salt'), // Default value if missing
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
