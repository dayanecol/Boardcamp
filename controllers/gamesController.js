import joi from "joi";
import db from "../db.js";
import chalk from "chalk";

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    if (name) {
      const games = await db.query(`
            SELECT games.*,categories.name as categoryName FROM games
            JOIN categories
            ON games.categoryId = categories.id
            WHERE lower(games.name) LIKE lower('${name}%')
        `);
      res.send(games.rows);
      return;
    }
    const games = await db.query(`
        SELECT games.*,categories.name as "categoryName" FROM games
        JOIN categories
        ON games."categoryId" = categories.id
    `);
    res.send(games.rows);
  } catch (error) {
    console.log(chalk.bold.red("Erro no servidor!"));
    res.status(500).send({
      message: "Internal server error while getting games!",
    });
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
 
  const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().min(1).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().min(1).required()
  });
 
  const validation = gameSchema.validate(req.body);
  if (validation.error) {
    res.sendStatus(400);
    return;
  }

  try {
    const category = await db.query('SELECT * FROM categories WHERE id=$1',[categoryId]);

    if (category.rowCount === 0) {
      res.sendStatus(400);
      return;
    }
    const repeatName = await db.query('SELECT * FROM games WHERE name=$1',[name]);

    if (repeatName.rowCount > 0) {
      res.sendStatus(409);
      return;
    }
    await db.query(`
      INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1,$2,$3,$4,$5);`,[name,image,Number(stockTotal),categoryId,Number(pricePerDay)]);
    res.sendStatus(201);
    return;
  } catch (error) {
    console.log(chalk.bold.red("Erro no servidor!"));
    res.status(500).send({
      message: "Internal server error while creating game!",
    });
  }
}
