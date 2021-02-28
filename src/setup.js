import { readFile } from "fs/promises";
import { query, end } from "./db.js";
import faker from "faker";
import { createNewUser } from "./users.js";

const schemaFile = "./sql/schema.sql";

async function mock(n) {
  for (let i = 0; i < n; i++) {
    const name = faker.name.findName();
    const nationalId = Math.floor(Math.random() * 8999999999) + 1000000000;
    const comment = Math.random() < 0.5 ? faker.lorem.sentence() : "";
    const anonymous = faker.random.boolean();
    const signed = faker.date.between("2021-02-13", "2021-02-27");

    const q = `
INSERT INTO signatures
      (name, nationalId, comment, anonymous, signed)
    VALUES
      ($1, $2, $3, $4, $5);`;

    await query(q, [name, nationalId, comment, anonymous, signed]);
  }
}

await query(`CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username CHARACTER VARYING(255) NOT NULL,
  password CHARACTER VARYING(255) NOT NULL
  );`);

async function create() {
  const data = await readFile(schemaFile);

  await query(data.toString("utf-8"));

  console.info("Schema created");

  await mock(500);

  await createNewUser("admin", "123");

  console.info("Mock data inserted");

  await end();
}

create().catch((err) => {
  console.error("Error creating schema", err);
});
