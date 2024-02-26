import express from 'express';
import pokemonsRoute from './pokemon.router.js';
import UsersRoute from './user.router.js';

const router = (app) => {
    app.use(express.json(), {pokemonsRoute,UsersRoute});
    
};

export default router;