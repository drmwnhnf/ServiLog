const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./src/configs/db');
const { port, frontendUrl } = require('./src/configs/env');
const requestLogger = require('./src/middlewares/requestLogger');
const logger = require('./src/utils/logger');
const accountRoutes = require('./src/routes/accountRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');

const app = express();
const options = {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(express.json());
app.use(cors(options));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/account', accountRoutes);
app.use('/vehicle', vehicleRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

db.databaseConnectionTest();

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});