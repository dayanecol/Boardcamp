import { Router } from "express";
import { createCustomer, getCustomers, getCustomerById, updateCustomer } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers',getCustomers);
customersRouter.get('/customers/:id',getCustomerById);
customersRouter.post('/customers',createCustomer);
customersRouter.put('/customers/:id',updateCustomer);


export default customersRouter;
