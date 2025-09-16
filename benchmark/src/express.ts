import express from 'express'


const app = express()

app.get('/', (req,res) => res.send("Hello world!"))

app.listen(3002, () => console.log('express running on 3002'))