import { Router } from 'express'
import connection from '../db'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

const router = Router()

router.get('/', async (req, res) => {
  const query = `select * from books`
  const [rows] = await connection.promise().query(query)
  res.json(rows)
})

router.post('/', upload.single('image'), async (req, res) => {
  const book = { image: req.file?.filename, ...req.body }
  const query = `insert into books set ?; select max(id) as id from books`
  const [[, [{ id }]]] = (await connection
    .promise()
    .query(query, book)) as unknown as [[{}, [{ id: string }]]]
  res.json({ image: book.image, id })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { image } = req.body
  const query = `delete from books where id = ?`
  connection.query(query, id)
  fs.unlink(`src/uploads/${image}`, (err) => {
    if (err) throw err
  })
  res.end()
})

router.put('/', upload.single('image'), async (req, res) => {
  const { id, oldImage, ...updatedBookDetails } = req.body
  const image = req.file?.filename
  const query = `update books set ? where id = ?`
  connection.query(query, [{ image, ...updatedBookDetails }, id])

  fs.unlink(`src/uploads/${oldImage}`, (err) => {
    if (err) throw err
  })

  res.json({ image })
})

export default router
