require("./util/watcher");
const { debug } = require("./util/debug");
const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const main = require("./routes/main");
const form = require("./routes/form");
const port = 8000;

const start = () => {
  const app = express();

  app.use(express.static("public"));

  nunjucks.configure(path.join(__dirname, "views"), {
    express: app,
    autoescape: true,
    noCache: true,
  });

  app.set("view engine", "html");

  app.use("/", main);
  app.use("/form", form);

  return app;
};

start().listen(port, () => debug(`Listening at http://localhost:${port}`));
