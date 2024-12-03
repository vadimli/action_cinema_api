require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connection = require('./connection');
const router = require('./router');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);


const start = async () => {
    try {
        await connection;

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();