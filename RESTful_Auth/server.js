const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')

//Import router
const authRoute = require('./routers/auth');
const postRoute = require('./routers/posts')
const verify = require('./routers/verifyToken');

dotenv.config();

// Database connnection

mongoose.connect(process.env.DB_CONNECT)
    .then((res) => {
        console.log("Database connected!")
    })


// Middlewares
app.use(express.json())
// Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(3000, () => console.log('Server is running up'))
