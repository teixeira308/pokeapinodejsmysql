import express from 'express';
import pokemonsRoute from './pokemon.router.js';

const router = (app) => {
    app.use(express.json(), pokemonsRoute);
    
};

export default router;
