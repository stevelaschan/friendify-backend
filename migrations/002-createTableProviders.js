exports.up = async (sql) => {
  await sql`
    CREATE TABLE providers (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			user_id integer REFERENCES users (id)
    )
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE providers
  `;
};
