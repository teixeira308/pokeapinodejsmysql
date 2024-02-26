import express from 'express';
import UserController from '../controllers/UserController.js';
import handleValidations from '../middleware/handleValidations.js';

const UsersRouter = express.Router();

UsersRouter.post("/register", userCreateValidation(), handleValidations.validate, UserController.registrarUsuario);

export default UsersRouter;
