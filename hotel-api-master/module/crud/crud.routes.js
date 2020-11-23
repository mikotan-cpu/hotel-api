import express from "express";
import userController from "./crud.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";
const crudRoutes = express.Router();

crudRoutes.get("/", function(req, res, next) {
  res.json({ message: "from index api" });
});

// Create
crudRoutes.post("/register", asyncWrapper(userController.register));

// Login
crudRoutes.post("/login", asyncWrapper(userController.login));

// Login
crudRoutes.post("/activate/:activation", asyncWrapper(userController.activate));

//GetAll Data
crudRoutes.get("/users", [authenticateToken,isAdmin],asyncWrapper(userController.findAll));

//GetBy ID
crudRoutes.get("/users/:userId", [authenticateToken, onlyOwner], asyncWrapper(userController.findOne));

//update by ID
crudRoutes.put("/users/:userId",[authenticateToken, onlyOwner], asyncWrapper(userController.update));

//Delete
crudRoutes.delete("/users/:userId", [authenticateToken,isAdmin],asyncWrapper(userController.delete));

export { crudRoutes };
