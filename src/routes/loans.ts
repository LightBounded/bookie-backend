import { Router } from 'express';
import connection from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const query = `select * from loans`;
  const [rows] = await connection.promise().query(query);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const loan = req.body;
  const query = `insert into loans set ?;select max(id) as id from loans`;
  const [[, [{ id }]]] = (await connection
    .promise()
    .query(query, loan)) as unknown as [[{}, [{ id: string }]]];
  res.json(id);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const query = `delete from loans where id = ?`;
  const hello = connection.query(query, id);
  console.log(hello);
  res.end();
});

router.put('/', (req, res) => {
  const { id, ...updatedLoanDetails } = req.body;
  const query = `update loans set ? where id = ? `;
  connection.query(query, [updatedLoanDetails, id]);
  res.end();
});

export default router;
