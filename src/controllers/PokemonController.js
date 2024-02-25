import Pokemon from '../models/Pokemon.js';

class PokemonController {
    static index = async (_, response) => {
        let pokemon = await Pokemon.findAll();
        response.status(200).json(pokemon);
    };

    static index = async (_, response) => {
        const page = parseInt(_.query.page) || 1; // Página atual, padrão é 1
        const pageSize = parseInt(_.query.pageSize) || 10; // Tamanho da página, padrão é 10
    
        try {
            const totalCount = await Pokemon.count(); // Total de registros
            
            const { count, rows } = await Pokemon.findAndCountAll({
                offset: (page - 1) * pageSize, // Calcula o deslocamento com base na página atual e no tamanho da página
                limit: pageSize // Limite de resultados por página
            });
    
            const totalPages = Math.ceil(totalCount / pageSize); // Total de páginas
            
            response.setHeader("Access-Control-Expose-Headers","*");
            response.setHeader('x-total-count', totalCount); // Configura o cabeçalho X-Total-Count
            response.status(200).json(rows);
        } catch (error) {
            console.error("Erro ao buscar pokemons:", error);
            response.status(500).json({ error: "Erro ao buscar pokemons" });
        }
    };
    

    static findById = async (request, response) => {
        let { id } = request.params;
        let pokemon = await Pokemon.findByPk(id);
        response.status(200).json(pokemon);
    };

    
    
    static alterPokemon = async (request, response) => {
        try {
            // Extrair o ID do Pokémon a ser atualizado dos parâmetros da solicitação
            const { id } = request.params;
    
            // Verificar se o Pokémon com o ID fornecido existe no banco de dados
            let pokemon = await Pokemon.findByPk(id);
            if (!pokemon) {
                return response.status(404).json({ message: "Pokémon não encontrado." });
            }
    
            // Extrair os dados atualizados do corpo da solicitação
            const { name, firstAttribute, secondAttribute, megaEvolution } = request.body;
    
            // Verificar se há pelo menos um campo para atualizar
            if (!name && !firstAttribute && !secondAttribute && !megaEvolution) {
                return response.status(400).json({ message: "Pelo menos um campo para atualizar deve ser fornecido." });
            }
    
            // Atualizar os campos fornecidos
            if (name) {
                pokemon.name = name;
            }
            if (firstAttribute) {
                pokemon.firstAttribute = firstAttribute;
            }
            if (secondAttribute) {
                pokemon.secondAttribute = secondAttribute;
            }
            if (megaEvolution) {
                pokemon.megaEvolution = megaEvolution;
            }
    
            // Salvar as alterações no banco de dados
            await pokemon.save();
    
            // Responder com o Pokémon atualizado
            return response.status(200).json(pokemon);
        } catch (error) {
            // Em caso de erro, responder com o status 500 (erro interno do servidor) e uma mensagem de erro
            console.error("Erro ao atualizar Pokémon:", error);
            return response.status(500).json({ message: "Ocorreu um erro ao atualizar o Pokémon." });
        }
    };
    
    static deletePokemon = async (request, response) => {
        try {
            // Extrair o ID do Pokémon a ser excluído dos parâmetros da solicitação
            const { id } = request.params;
    
            // Verificar se o Pokémon com o ID fornecido existe no banco de dados
            const pokemon = await Pokemon.findByPk(id);
            if (!pokemon) {
                return response.status(404).json({ message: "Pokémon não encontrado." });
            }
    
            // Excluir o Pokémon do banco de dados
            await pokemon.destroy();
    
            // Responder com uma mensagem de sucesso
            return response.status(200).json({ message: "Pokémon excluído com sucesso." });
        } catch (error) {
            // Em caso de erro, responder com o status 500 (erro interno do servidor) e uma mensagem de erro
            console.error("Erro ao excluir Pokémon:", error);
            return response.status(500).json({ message: "Ocorreu um erro ao excluir o Pokémon." });
        }
    };
    static addPokemon = async (request, response) => {
        try {
            // Extrair os dados do corpo da solicitação
            const { id, nationalId, name, firstAttribute, secondAttribute, megaEvolution, createdAt, updatedAt } = request.body;
    
            // Validar os dados (você pode adicionar mais validações conforme necessário)
         //   if (!id || !nationalId || !name || !firstAttribute || !secondAttribute || typeof megaEvolution !== 'boolean' || !createdAt || !updatedAt) {
           //     return response.status(400).json({ message: "Faltam campos obrigatórios ou os campos estão em formatos inválidos." });
            //}
    
            // Criar um novo objeto de Pokémon
            const newPokemon = await Pokemon.create({
                id,
                nationalId,
                name,
                firstAttribute,
                secondAttribute,
                megaEvolution,
                createdAt,
                updatedAt
            });
    
            // Responder com o novo Pokémon adicionado
            return response.status(201).json(newPokemon);
        } catch (error) {
            // Em caso de erro, responder com o status 500 (erro interno do servidor) e uma mensagem de erro
            console.error("Erro ao adicionar Pokémon:", error);
            return response.status(500).json({ message: "Ocorreu um erro ao adicionar o Pokémon." });
        }
    };
}

export default PokemonController;
