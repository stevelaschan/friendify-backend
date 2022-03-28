exports.up = async (sql) => {
  await sql`
    CREATE TABLE timeslots (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			user_username varchar (20) REFERENCES users (username),
			provider_id integer REFERENCES providers (id) NOT NULL,
			timeslot_date date NOT NULL,
			timeslot_time varchar (30) NOT NULL
    )
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE timeSlots
  `;
};
