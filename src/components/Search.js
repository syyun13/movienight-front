import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, TextField, Button, Paper, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from '../styles/searchStyles';

const API_URL = 'https://imdb-api.com/en/API/SearchMovie'
const API_KEY = 'k_q21xwtv3'

class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            keyword: "",
            movies: [],
            redirect: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.addMovie = this.addMovie.bind(this);
    }

    componentDidMount(){
        const movie = sessionStorage.getItem('movie');
        if(movie) sessionStorage.removeItem('movie');
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    search(){
        const { keyword } = this.state;
        axios.get(`${API_URL}/${API_KEY}/${keyword}`).then(res => {
            this.setState({
                movies: res.data.results
            })
        }).catch(error => {
            console.log(error);
        })
    }

    addMovie(movie){
        sessionStorage.setItem('movie', JSON.stringify(movie));
        this.setState({redirect: true});
    }

    render(){
        const { keyword, movies, redirect } = this.state;
        return ([
            <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={styles.container}
            key="search-container"
            >
                {
                    redirect ?
                    <Navigate to="/event" /> : <></>
                }
                <TextField
                    variant="outlined"
                    style={styles.searchbar}
                    value={keyword}
                    name="keyword"
                    onChange={this.handleChange}
                    helperText="Search for a movie title"
                    InputProps={{
                        endAdornment: <Button variant="contained" style={styles.searchButton} onClick={this.search}>Search</Button>
                    }}
                />
            </Grid>,
            <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            style={styles.container}
            sx={{marginBottom: '30px'}}
            key="search-result"
            >
            {
                movies.length > 0 &&
                movies.map((movie, i) => (
                    <Grid item xs={4} key={`movie-${i}`} align="center">
                        <Paper style={styles.paper}>
                            <img src={movie.image} style={styles.poster} alt={movie.title} />
                            <IconButton
                                aria-label="add"
                                style={styles.add}
                                onClick={() => this.addMovie(movie)}
                            >
                                <AddCircleIcon />
                            </IconButton>
                            <p style={styles.title}> {movie.title} <span style={styles.desc}>{movie.description}</span></p>
                        </Paper>
                    </Grid>
                ))
            }
            </Grid>
        ])
    }
}

export default Search;