const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware")
// create
problemRouter.post("/create",adminMiddleware, createProblem);
// update
problemRouter.patch("/:id",updateProblem);
// Delete
problemRouter.delete("/:id",deleteProblem);
// fetch (Read)
problemRouter.get("/:id",getProblemById);

problemRouter.get("/",getAllProblem);

problemRouter.get("/user",solvedAllProblembyUser);


