import chalk from 'chalk';
import request from 'request';
import { JSDOM } from 'jsdom';
import Pokemon from '../models/Pokemon.js';

const url = 'https://pokemondb.net/pokedex/all';

console.log(chalk.green('[*] Running database seeder'));

request(url, (error, response, body) => {
    if (error) {
        console.log(chalk.red(`[*] Error in request: ${error}`));
        return;
    }

    let dom = new JSDOM(body);
    let pokemonsRequest = dom.window.document.querySelectorAll(
        '#pokedex > tbody > tr'
    );

    pokemonsRequest.forEach((pokemon) => {
        let pokemonModel = new Pokemon();
        let pokemonReturn = {};

        let queryPokeDex = pokemon.querySelector('.infocard-cell-data');
        if (queryPokeDex) pokemonModel.nationalId = queryPokeDex.textContent;

        let queryName = pokemon.querySelector('.ent-name');
        if (queryName) pokemonModel.name = queryName.textContent;

        let megaEvolution = pokemon.querySelector('.text-muted');
        if (megaEvolution)
            pokemonModel.megaEvolution = megaEvolution.textContent;

        let queryPokeAttributes = pokemon.querySelectorAll('.type-icon');

        if (queryPokeAttributes) {
            pokemonReturn.attributes = [];
            queryPokeAttributes.forEach((attribute) => {
                pokemonReturn.attributes.push(attribute.textContent);
            });
        }

        pokemonModel.firstAttribute = pokemonReturn.attributes[0];
        if (pokemonReturn.attributes[1])
            pokemonModel.secondAttribute = pokemonReturn.attributes[1];

        pokemonModel.save();
    });
});
