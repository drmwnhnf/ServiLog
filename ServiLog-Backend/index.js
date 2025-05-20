const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./src/configs/db");
const { port, frontendUrl } = require("./src/configs/env");
const requestLogger = require("./src/middlewares/requestLogger");
const logger = require("./src/utils/logger");
const accountRoutes = require("./src/routes/accountRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const partRoutes = require("./src/routes/partRoutes");
const mileageRoutes = require("./src/routes/mileageRoutes");

const app = express();
const options = {
  origin: frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(express.json());
app.use(cors(options));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/account", accountRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/part", partRoutes);
app.use("/mileage", mileageRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

db.databaseConnectionTest();

app.listen(3000, () => {
  logger.info(`Server is running on port 3000`);
});
