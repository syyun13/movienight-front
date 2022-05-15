import React, { Component } from 'react';
import { Grid, Paper, Avatar } from '@mui/material';
import axios from 'axios';
import styles from '../styles/rankStyles';

const API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/getrank';

class RankList extends Component {
    constructor(props){
        super(props);
        this.state = {
            movieList: [],
        }
    }

    componentDidMount(){
        axios.get(API).then(res => {
            this.setState({
                movieList: res.data,
            });
        }).catch(error => {
            console.log(error);
        })
    }

    render(){
        const { movieList } = this.state;
        return (
            <Grid container
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{marginTop: '3em'}}
            >
            {
            movieList.map((movie, i) => {
                const count = movie[0];
                const title = movie[1];
                const poster = movie[2];
                return (
                    <Paper elevation={0} style={styles.paper} key={`movierank-${i}`}>
                        <Avatar style={i === 0 ? styles.top : styles.ranking}><b>{i+1}</b></Avatar>
                        <span style={styles.title}>{title}</span>
                        <br />
                        <span style={styles.desc}>selected by {count} {count > 1 ? 'users' : 'user'}</span>
                        <br />
                        <img src={poster} alt={title} style={styles.poster} />
                    </Paper>
                )
            })
            }
            </Grid>
        )
    }
}

export default RankList;