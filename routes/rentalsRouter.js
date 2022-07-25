import { Router } from "express";
import { getRentals, createRental, finishRental, deleteRental} from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals',getRentals);
rentalsRouter.post('/rentals', createRental);
rentalsRouter.post('/rentals/:id/return', finishRental);
rentalsRouter.delete('/rentals/:id', deleteRental);


export default rentalsRouter;
