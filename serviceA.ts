import fastify from "fastify";
import { Client } from "pg";

(async function () {
  const app = fastify({
    logger: true,
  });

  const client = new Client({
    connectionTimeoutMillis: 5000,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : undefined,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });

  console.log({
    host: client.host,
    port: client.port,
    user: client.user,
    database: client.database,
  });

  await client.connect();

  app.get("/", async (req, res) => {
    const d = await client.query("SELECT $1::text as message", [
      "Hello world from Service A!",
    ]);

    res.send(d.rows[0].message);
  });

  await app.ready();

  app.listen(process.env.PORT || "", process.env.HOST || "");
})().catch(console.log);
