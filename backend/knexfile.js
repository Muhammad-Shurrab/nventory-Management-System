// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "inventory",
      user: "postgres",
      password: "123456",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
