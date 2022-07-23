import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import db from "./db.js";
import router from "./routes/router.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.use(router);

app.get("/", (req, res) => {
  res.send("Funcionando!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(chalk.bold.green(`Servidor conectado na porta ${PORT}.`));
});
