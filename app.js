const express = require('express')
const app = express()
require('./middlewares/dbconnection')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var cors = require('cors')

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res)=>{
    console.log('GET / request');
    res.status(200).json({success: true, message: 'Welcome to the backend.'})
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/authenticate', require('./routes/authenticationRoute'))
app.use('/api/provider', require('./routes/providerRoute'))
app.use('/api/user', require('./routes/userRoute'))
app.use((req, res)=>{
    res.status(404).json({success: false, message:'Route not found.'})
})

app.listen(5000, ()=>{
    console.log('App listening at port 5000')
})