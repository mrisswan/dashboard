//import
const express = require("express");
const cors = require("cors");

//implementasi
const app = express();
app.use(cors());

app.use(express.static(__dirname));

//endpoint
const user = require("./router/user");
app.use("/cafe/user", user);

const menu = require("./router/menu");
app.use("/cafe/menu", menu);

const meja = require("./router/meja");
app.use("/cafe/meja", meja);

const transaksi = require("./router/transaksi");
app.use("/cafe/transaksi", transaksi);

//run server
app.listen(4040, () => {
  console.log("server run on port 4040");
});
