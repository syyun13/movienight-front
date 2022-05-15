import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Header, Step1, Step2, Step3, Step4 } from '../components';
import { Grid, Box, Stepper, Step, StepLabel } from '@mui/material';
import styles from '../styles/eventStyles';

const steps = [
    'Confirm your movie',
    'Set date and time',
    'Add friends',
    'Create an event'
];

class Event extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            step: 0,
            movie_name: "",
            poster_img: "",
            event_date: null,
            user_id: null,
            friends: [],
        }

        this.returnToMain = this.returnToMain.bind(this);
        this.setValue = this.setValue.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
    }

    componentDidMount(){
        let user_id = sessionStorage.getItem('userId');
        let movie = sessionStorage.getItem('movie');
        if(movie && user_id){
            movie = JSON.parse(movie);
            this.setState({
                movie_name: movie.title,
                poster_img: movie.image,
                user_id: parseInt(user_id),
            });
        } else {
            this.setState({redirect: true});
        }
    }

    returnToMain(){
        this.setState({redirect: true});
    }

    setValue(name, val){
        this.setState({
            [name]: val
        });
    }

    nextStep(){
        this.setState(prev => ({
            step: prev.step + 1,
        }))
    }

    prevStep(){
        this.setState(prev => ({
            step: prev.step - 1,
        }))
    }

    render(){
        const { redirect, step, movie_name, poster_img, event_date, friends } = this.state;
        return (
            <div>
                {
                    redirect ?
                    <Navigate to="/main" /> : <></>
                }
                <Header />
                <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={styles.container}
                >
                    <Box sx={{width: '100%'}}>
                        <Stepper activeStep={step} alternativeLabel>
                        {
                            steps.map(label => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))
                        }
                        </Stepper>
                    </Box>
                {
                    step === 0 &&
                    <Step1
                        movie_name={movie_name} poster_img={poster_img}
                        returnToMain={this.returnToMain}
                        nextStep={this.nextStep}
                    />
                }
                {
                    step === 1 &&
                    <Step2
                        event_date={event_date}
                        setValue={this.setValue}
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                    />
                }
                {
                    step === 2 &&
                    <Step3
                        setValue={this.setValue}
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        friends={friends}
                    />
                }
                {
                    step === 3 &&
                    <Step4
                        state={this.state}
                        setValue={this.setValue}
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                    />
                }
                </Grid>
            </div>
        )
    }
}

export default Event;