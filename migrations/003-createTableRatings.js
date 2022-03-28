exports.up = async (sql) => {
  await sql`
    CREATE TABLE ratings (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			user_id integer REFERENCES users (id) NOT NULL,
			provider_id integer REFERENCES providers (id) NOT NULL,
      rating integer
    )
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE ratings
  `;
};
