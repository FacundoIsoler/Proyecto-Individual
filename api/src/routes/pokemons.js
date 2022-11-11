const { Router } = require('express');
const axios = require('axios');
const router = Router();
const { Pokemon, Type } = require('../db.js')
let {
    obtenerPokemons
} = require("./../Controllers/FindPokemonAPI.js");



const getApiInfo = async () => {
    try {
        const { results } = (
            await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=151")
        ).data;
        const promisesArray = await Promise.all(
            results.map((p) => axios.get(p.url))
        );

        return promisesArray.map(({ data }) => {
            return {
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.substring(1),
                life: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                speed: data.stats[5].base_stat,
                height: data.height,
                weight: data.weight,
                types: data.types.map((type) => { return type.type.name.charAt(0).toUpperCase() + type.type.name.substring(1) }),
                sprites:
                    data.sprites.other["dream_world"].front_default ||
                    data.sprites.other["official-artwork"].front_default,
            };
        });
    } catch (e) {
        return e;
    }
};

const getDbInfo = async () => {
    return await Pokemon.findAll({
        include: {
            model: Type,
            attributes: ['name'],
            through: {
                attribute: [],
            },
        }
    })
}
const getAllPokemons = async () => {
    const apiDepurada = await getApiInfo();
    const dbDepurada = await getDbInfo();
    const allPokemons = apiDepurada.concat(dbDepurada);
    return allPokemons;
};


router.get('/', async (req, res, next) => {
    const name = req.query.name;
    const todosLosPokemons = await getAllPokemons();
    try {
        if (name) {
            let pokemonName = await todosLosPokemons.filter(el => el.name.toLowerCase().includes(name.toLocaleLowerCase()));
            pokemonName.length ?
                res.status(200).json(pokemonName) :
                res.status(404).send("It is not possible to find that name")

        } else {
            
            // todosLosPokemons.sort((a, b) => {
            //     return a.name.toLowerCase() > b.name.toLowerCase()? 1 : -1
            // }) //ordenamiento de la a a la z
            //  todosLosPokemons.sort((a, b) => {
            //          return a.name.toLowerCase() < b.name.toLowerCase()? 1 : -1
            //      })//ordenamiento de z a la a
            res.status(200).json(todosLosPokemons);
        }
    } catch (error) {
        res.status(404).send("GET_ALL_POKEMONS_FAILED: " + error.message);
    }
});



router.get('/:idPokemon', async (req, res) => {
    const { idPokemon } = req.params;
     console.log(typeof idPokemon)
    try {
        console.log("estamos en el try")
        if(isNaN(Number(idPokemon))) {
            console.log("entró al if")
            const dataDB = await Pokemon.findByPk(idPokemon, { include: Type });
            if (dataDB) {
                res.status(200).json(dataDB);
                console.log(dataDB);
                return;
            }
        }else{
            console.log("entró al else")
            const {data} = await axios(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
            console.log(data)
                const pokemonFinal = {
                    id: data.id,
                    name: data.name.charAt(0).toUpperCase() + data.name.substring(1),
                     life: data.stats[0].base_stat,
                     attack: data.stats[1].base_stat,
                     defense: data.stats[2].base_stat,
                     speed: data.stats[5].base_stat,
                     height: data.height,
                     weight: data.weight,
                     types: data.types.map((type) => { return type.type.name.charAt(0).toUpperCase() + type.type.name.substring(1) }),
                     sprites:
                         data.sprites.other["dream_world"].front_default ||
                         data.sprites.other["official-artwork"].front_default,
                };
                console.log("entraste a la data")
            res.status(200).send(pokemonFinal);
        }
        
    }
    catch (err) {
        res.status(404).send(err)
    }
});



router.post('/', async (req, res, next) => {
    try {
        let  { name, vida, ataque, defensa, velocidad, altura, peso, type } = req.body
        let  newPokemon = await Pokemon.create({ name, vida, ataque, defensa, velocidad, altura, peso })
        
        // let typeDb = await Type.findAll({
        //     where: {name: type}
        // })
        // newPokemon.addType(typeDb)

        const addTypes = await newPokemon.addType(type, {
            through: null,
          });

        res.status(200).json({msg: 'Pokemon created successfully', newPokemon})
    } catch (error) {
        next(error)
    }
});

router.put('/', (req, res, next) => {
    res.send('soy put /pokemons');
});

router.delete('/', (req, res, next) => {
    res.send('soy delete /pokemons');
});








module.exports = router;
