import express from 'express'
import cors from 'cors'
import customersRouter from './routes/customers'
import booksRouter from './routes/books'
import loansRotuer from './routes/loans'

const app = express()

app.use(express.static('src/uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/books', booksRouter)
app.use('/customers', customersRouter)
app.use('/loans', loansRotuer)

app.listen(4000, () => {
  console.log('Server running on port 4000')
})
