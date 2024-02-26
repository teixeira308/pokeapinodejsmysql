import express from 'express';
import PokemonController from '../controllers/PokemonController.js';
import { protect } from '../controllers/UserController.js';

const pokemonsRoute = express.Router();

pokemonsRoute
    .get('/', protect,PokemonController.index)
    .get('/:id', protect,PokemonController.findById);
    pokemonsRoute.post('/', protect,PokemonController.addPokemon);
    pokemonsRoute.delete('/:id',protect,PokemonController.deletePokemon);
    pokemonsRoute.put('/:id', protect, PokemonController.alterPokemon);

export default pokemonsRoute;
