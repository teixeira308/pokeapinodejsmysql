// user.router.js
import express from 'express';
import { signUp, signIn, protect } from '../controllers/UserController.js';

const usersRoute = express.Router(); // Corrigido o nome da variável

usersRoute.post('/register', signUp);
usersRoute.post('/login', signIn);
usersRoute.get('/secret-route', protect, (req, res) => {
  res.send('This is the secret content. Only logged in users can see that!');
});

export default usersRoute; // Corrigido para exportar a rota correta
