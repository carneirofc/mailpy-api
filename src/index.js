require("dotenv").config();
const config = require("./config");

const app = require("./app");

app.listen(config.server.port, config.server.port, () => {
  console.log(`Express server started on port ${config.server.port} at ${config.server.port}`);
});
