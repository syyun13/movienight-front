import React, { Component } from 'react';
import { Grid, Button } from '@mui/material';

class Step1 extends Component {
    render(){
        const { movie_name, poster_img } = this.props;
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{paddingTop: 50}}
            >
                <Grid item xs={12} align="center">
                    <img src={poster_img} alt={movie_name} style={{maxWidth: '500px'}} />
                </Grid>
                <Grid item xs={12} align="center">
                    <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                        {movie_name}
                    </p>
                </Grid>
                <Grid item xs={12} align="center" style={{marginBottom: '30px'}}>
                    <Button
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={() => this.props.returnToMain()}
                    >
                        Pick another movie
                    </Button>
                    <Button
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={() => this.props.nextStep()}
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default Step1;