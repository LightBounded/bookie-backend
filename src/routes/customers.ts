import { Router } from "express";
import connection from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const query = `select * from customers`;
  const [rows] = await connection.promise().query(query);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const customer = req.body;
  const query = `insert into customers set ?;select max(id) as id from customers`;
  const [[, [{ id }]]] = (await connection
    .promise()
    .query(query, customer)) as unknown as [[{}, [{ id: string }]]];
  res.json(id);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const query = `delete from customers where id = ?`;
  connection.query(query, id);
  res.end();
});

router.put("/:id", (req, res) => {
  const customer = req.body;
  const id = req.params.id;
  const query = `update customers set ? where id = ?`;
  connection.query(query, [customer, id]);
  res.end();
});

export default router;
