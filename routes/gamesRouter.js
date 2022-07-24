import { Router } from "express";
import { getGames, createGame } from "../controllers/gamesController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", createGame);

export default gamesRouter;
