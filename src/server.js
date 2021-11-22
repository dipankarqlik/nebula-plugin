const express = require("express");
const app = express();
const fs = require("fs");
const config = require("../config/config");
const token = require("../token/token");

app.use(express.static(__dirname));
//console.log(token.getKey());

app.get("/mashup", (req, res) => {
  let mashFile = fs.readFileSync("./src/index.html", "utf8");
  res.write(mashFile);
  res.end();
});

app.get("/config", (req, res) => {
  res.json(config);
  res.end();
});

app.get("/token", (req, res) => {
  const ip = req.connection.remoteAddress;
  const genT = token.generate(ip, config.tenantDomain);
  res.json({ token: genT });
});

app.get("/theme/:name", (req, res) => {
  let themeFile = fs.readFileSync(`./themes/${req.params.name}.json`);
  res.json({ theme: JSON.parse(themeFile) });
  res.end();
});

//create a server object:
app.listen(8080); //the server object listens on port 8080
