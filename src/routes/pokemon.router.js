import express from 'express';
import PokemonController from '../controllers/PokemonController.js';

const pokemonsRoute = express.Router();

pokemonsRoute
    .get('/pokemon', PokemonController.index)
    .get('/pokemon/:id', PokemonController.findById);
    pokemonsRoute.post('/pokemon', PokemonController.addPokemon);
    pokemonsRoute.delete('/pokemon/:id',PokemonController.deletePokemon);
    pokemonsRoute.put('/pokemon/:id',PokemonController.alterPokemon);

export default pokemonsRoute;
