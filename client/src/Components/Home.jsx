import React, {Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemons, filtradoPokemonByStatus, filterCreados } from '../Actions/index.js';
import { Link } from 'react-router-dom';

import Card from './Card.jsx'
import Paginado from './Paginado.jsx';

export default function Home() {
    const dispatch = useDispatch()
    const allPokemons = useSelector((state) => state.pokemons)
    const [currentPage, setCurrentPage] = useState(1)
    const [pokemonsPerPage, setPokemonPerPage] = useState(12)
    const indiceUltimoPokemon = currentPage * pokemonsPerPage//12
    const indicePrimerPokemon = indiceUltimoPokemon - pokemonsPerPage// 0
    const pokemonsPaginaActual = allPokemons.slice(indicePrimerPokemon, indiceUltimoPokemon)
    

    const paginado = (pageNumber)   => {
        setCurrentPage(pageNumber)};

    useEffect(() => {
        dispatch(getPokemons());
    }, [])



    function handleClick(e) {
        e.preventDefault();
        dispatch(getPokemons());
    }

    function handleFiltradoStatus(e) {
        e.preventDefault();
        setCurrentPage(1);
        dispatch(filtradoPokemonByStatus(e.target.value))
    }


    function handleFilterCreados(e){
        e.preventDefault();;
        dispatch(filterCreados(e.target.value))
    }

    return (
        <div>
            <Link to='/pokemons'>Create Pokemon</Link>
            <h1>Estas en Home</h1>
            <button onClick={e => { handleClick(e) }}>
                Volver a cargar todos los Pokemons
            </button>
            <div>
                <select>
                    <option value='asc'>Ascendente</option>
                    <option value='desc'>Descendente</option>
                </select>
                <select onChange={e => handleFiltradoStatus(e)}>
                    <option value="All">All</option>
                    <option value="Normal">Normal</option>
                    <option value="Fighting">Fighting</option>
                    <option value="Flying">Flying</option>
                    <option value="Poison">Poison</option>
                    <option value="Ground">Ground</option>
                    <option value="Rock">Rock</option>
                    <option value="Ghost">Ghost</option>
                    <option value="Bug">Bug</option>
                    <option value="Steel">Steel</option>
                    <option value="Fire">Fire</option>
                    <option value="Water">Water</option>
                    <option value="Electric">Electric</option>
                    <option value="Grass">Grass</option>
                    <option value="Psychic">Psychic</option>
                    <option value="Dragon">Dragon</option>
                    <option value="Dark">Dark</option>
                    <option value="Fairy">Fairy</option>
                    <option value="Unknow">Unknow</option>
                    <option value="Shadow">Shadow</option>
                </select>
                <select onChange={e=> handleFilterCreados(e)}>
                    <option value='All'>Todos</option>
                    <option value='DB'>Creados</option>
                    <option value='API'>Existentes</option>
                </select>
                <br />
                    <input type="text" />



                <Paginado
                pokemonsPerPage={pokemonsPerPage}
                allPokemons={allPokemons.length}
                paginado={paginado}
                />
                
                {
                    pokemonsPaginaActual?.map(el => {
                        return (
                            <Fragment>
                                <Link to = {"/home/" + el.id}>
                                <Card name={el.name} img={el.sprites} type={el.types} />
                                </Link>
                            </Fragment>
                        )
                    })
                }

             
            </div>
        </div>
    )
}