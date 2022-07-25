import joi from "joi";
import db from "../db.js";
import chalk from "chalk";
import dayjs from "dayjs";

export async function getRentals(req,res){
    const { customerId, gameId } = req.query;
    try {
        if( customerId && gameId){
            const { rows } = await db.query(`
                SELECT rentals.*,
                json_build_object('id', customers.id, 'name', customers.name) AS customer,
                json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM rentals 
                JOIN customers 
                ON customers.id = $1
                JOIN games
                ON games.id = $2
                JOIN categories
                ON categories.id = games."categoryId";`,
                [customerId,gameId]
            );
            res.status(200).send(rows);
            return;
        }else if(customerId){
            const {rows} = await db.query(`
                SELECT rentals.*,  
                json_build_object('id', customers.id, 'name', customers.name) AS customer,
                json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM rentals
                JOIN games
                ON games.id = rentals."gameId"
                JOIN categories
                ON categories.id = games."categoryId"
                JOIN customers 
                ON customers.id = $1
                WHERE rentals."customerId"= $1;`,[customerId]);
            res.status(200).send(rows);
            return;
        }else if(gameId){
            const { rows } = await db.query(`
                SELECT rentals.*,
                json_build_object('id', customers.id, 'name', customers.name) AS customer,
                json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM rentals
                JOIN customers 
                ON customers.id = rentals."customerId" 
                JOIN games
                ON games.id = $1
                JOIN categories
                ON categories.id = games."categoryId"
                WHERE rentals."gameId"=$1;`,
                [gameId]
            );
            res.status(200).send(rows);
            return;       
        }else{
            const { rows } = await db.query(`
                SELECT rentals.*,
                json_build_object('id', customers.id, 'name', customers.name) AS customer,
                json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM rentals 
                JOIN customers 
                ON customers.id = rentals."customerId"
                JOIN games
                ON games.id = rentals."gameId"
                JOIN categories
                ON categories.id = games."categoryId";`
            );
            res.status(200).send(rows);
            return;
        }   
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while getting rentals!",
        });
    }
}

export async function createRental(req,res){
    const { customerId, gameId,daysRented } = req.body; 

    const rentalSchema = joi.object({
        customerId:joi.number().required(),
        gameId:joi.number().required(),
        daysRented:joi.number().min(1)
    });

    const validation = rentalSchema.validate(req.body);
    if(validation.error){
        res.sendStatus(400);
        return;
    }

    try {
        const customer = await db.query(
            `SELECT * FROM customers WHERE customers.id =$1;`,
            [customerId]
        );
        if( customer.rowCount===0){
            res.sendStatus(400);
            return;
        }

        const game = await db.query(
            `SELECT * FROM games WHERE games.id=$1;`,[gameId]
        );

        const stock = await db.query(
            `SELECT id FROM rentals WHERE "gameId"=$1 AND "returnDate" IS null;`,[gameId]
        );
        if (game.rowCount===0){
            res.sendStatus(400);
            return;
        }else if( game.rowCount>0){
            if (game.rows[0].stockTotal===stock.rowCount){
                res.sendStatus(400);
                return;
            }
        }

        const rentDate = dayjs().locale('pt-br').format('YYYY-MM-DD');
        const originalPrice = daysRented*(game.rows[0].pricePerDay);

        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, null, $5, null)`,
          [customerId, gameId, rentDate, daysRented, originalPrice],
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while creating rental!",
        });
    }
}

export async function finishRental(req,res){
    const { id } = req.params;

    const rentals = await db.query(
        `SELECT * FROM rentals WHERE id = $1`,[id]
    );

    if(rentals.rows[0].returnDate){
        res.sendStatus(400);
        return;
    }

    if (!rentals.rows[0]){
        res.sendStatus(404);
        return;
    }
    

    try {
        const returnDate = dayjs(rentals.rows[0].rentDate).add(rentals.rows[0].daysRented,'day');
        const pricePerDay = rentals.rows[0].originalPrice/rentals.rows[0].daysRented;
        const delayFee = (dayjs().locale('pt-br').diff(returnDate,'days'))*pricePerDay;
        const today = dayjs().locale('pt-br').format('YYYY-MM-DD');
        await db.query(
            `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
            [today,delayFee,id]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while updating rental!",
        });
    }
}

export async function deleteRental(req,res){
    const { id }= req.params;

    const rentals = await db.query(
        `SELECT * FROM rentals WHERE id=$1`,
        [id]
    );

    if (rentals.rowCount===0){
        res.sendStatus(404);
        return;
    }

    if (!rentals.rows[0].returnDate){
        res.sendStatus(400);
        return;
    }

    try {
        await db.query(
            `DELETE FROM rentals WHERE id=$1`,
            [id]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while deleting rental!",
        });
    }

}