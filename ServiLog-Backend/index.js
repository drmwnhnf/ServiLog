const express = require('express');
const dotenv = require('dotenv');
const db = require('./src/configs/db');
const requestLogger = require('./src/middlewares/requestLogger');
const logger = require('./src/utils/logger');

const app = express();
const port = process.env.PORT;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

db.databaseConnectionTest();

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});