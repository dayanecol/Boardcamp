import db from "../db.js";
import joi from "joi";
import chalk from "chalk";

export async function getCategories(req, res) {
  try {
    await db.query("SELECT * FROM categories").then((categories) => {
      res.status(200).send(categories.rows);
    });
  } catch (error) {
    console.log(chalk.bold.red("Erro no servidor!"));
    res.status(500).send({
      message: "Internal server error while getting categories!",
    });
  }
}

export async function createCategory(req, res) {
  const { name } = req.body;

  const categorySchema = joi.object({
    name: joi.string().required(),
  });
  const { error } = categorySchema.validate(req.body);
  if (error) {
    res.sendStatus(400);
    return;
  }
  try {
    const repeatCategory = await db.query(
      "SELECT id FROM categories WHERE name=$1",
      [name]
    );
    if (repeatCategory.rowCount > 0) {
      res.sendStatus(409);
      return;
    }
    db.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
    res.sendStatus(201);
    console.log(chalk.bold.blue("Category created!"));
  } catch (error) {
    console.log(chalk.bold.red("Erro no servidor!"));
    res.status(500).send({
      message: "Internal server error while creating category!",
    });
  }
}
