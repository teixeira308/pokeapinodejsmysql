// router.js
import express from 'express';
import pokemonsRoute from './pokemon.router.js';
import usersRoute from './user.router.js'; // Corrigido o nome do arquivo

const router = (app) => {
    app.use(express.json());
    app.use('/pokemon', pokemonsRoute); // Define um prefixo para as rotas dos pokemons
    app.use('/user', usersRoute); // Define um prefixo para as rotas dos usuários
};

export default router;
