const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware")
const userMiddleware = require("../middleware/userMiddleware")
const createProblem = require("../controllers/userProblem")
const updateProblem = require("../controllers/userProblem")
// create
problemRouter.post("/create",adminMiddleware, createProblem);
// update
problemRouter.patch("/update/:id",adminMiddleware,updateProblem);
// Delete
problemRouter.delete("/delete/:id",adminMiddleware, deleteProblem);
// fetch (Read)
problemRouter.get("/problemById/:id",userMiddleware, getProblemById);

problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);

problemRouter.get("/ProblemSolvedByUser",userMiddleware, solvedAllProblembyUser);

module.exports = problemRouter;


