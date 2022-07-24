import joi from "joi";
import db from "../db.js";
import chalk from "chalk";

export async function getCustomers (req,res){
    const { cpf } = req.query;

    try {
        if(cpf){
            const {rows} = await db.query(`
                SELECT * FROM customers
                WHERE customers."cpf" LIKE '${cpf}%'
            `);
            res.status(200).send(rows);
            return;
        }
        const {rows} = await db.query(`SELECT * FROM customers;`);
        res.status(200).send(rows);
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while getting customers!",
        });
    }
}

export async function getCustomerById(req,res){
    const { id } = req.params;
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`,[id]);
        
        if (customer.rowCount===0){
            res.sendStatus(404);
            return;
        }
        res.status(200).send(customer.rows);
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while getting customer!",
        });
    }
    
}

export async function createCustomer(req,res){
    const {name, phone, cpf, birthday} = req.body;

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf:joi.string().pattern(/^[0-9]{11}$/).required(),
        birthday:joi.date().required()
    });

    const validation = customerSchema.validate(req.body);
    if(validation.error){
        res.sendStatus(400);
        return;
    }

    try {

        const repeatCpf = await db.query('SELECT * FROM customers WHERE cpf=$1',[cpf]);
        if (repeatCpf.rowCount>0){
            res.sendStatus(409);
            return;
        }

        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);`,
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while creating customer!",
        });
    }

}

export async function updateCustomer(req,res){
    const { id } = req.params;
    const {name, phone, cpf, birthday} = req.body;

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf:joi.string().pattern(/^[0-9]{11}$/).required(),
        birthday:joi.date().required()
    });

    const validation = customerSchema.validate(req.body);
    if(validation.error){
        res.sendStatus(400);
        return;
    }

    try {

        const repeatCpf = await db.query('SELECT * FROM customers WHERE cpf=$1',[cpf]);
        if (repeatCpf.rowCount>0){
            res.sendStatus(409);
            return;
        }

        await db.query(`
            UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
            [name, phone, cpf, birthday, id]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(chalk.bold.red("Erro no servidor!"));
        res.status(500).send({
            message: "Internal server error while updating customer!",
        });
    }

}