import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Button, TextField, Alert, Snackbar } from '@mui/material';
import { getUser } from '../service/AuthService';

const API_URL = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/event';

class Step4 extends Component {
    constructor(props){
        super(props);
        this.state = {
            event_name: " ",
            open: false,
            errormsg: "",
            redirect: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.createEvent = this.createEvent.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClose(){
        this.setState({open: false});
    }

    createEvent(){
        const { event_name } = this.state;
        const { event_date, movie_name, poster_img, friends } = this.props.state;
        if(event_name === " " || event_name === ""){
            this.setState({
                open: true,
                errormsg: "Event name cannot be empty."
            });
        } else if(!event_date){
            this.setState({
                open: true,
                errormsg: "Please choose date and time for your event."
            });
        } else if(!movie_name){
            this.setState({
                open: true,
                errormsg: "There is no movie set."
            })
        } else {
            const user = getUser();
            let friendList = [];
            friends.map(friend => friendList.push(friend.id));
            const body = {
                event_name: event_name,
                event_date: event_date,
                movie_name: movie_name,
                poster_img: poster_img,
                user_id: user,
                guests: friendList.join(",")
            };
            axios.post(API_URL, body).then(res => {
                this.setState({redirect: true});
            }).catch(error => {
                this.setState({
                    open: true,
                    errormsg: error.response.data
                });
            })
        }
    }

    render(){
        const { state } = this.props;
        const { event_name, open, errormsg, redirect } = this.state;
        const { event_date, movie_name, friends } = state;
        let friendlist = [];
        friends.forEach(f => {
            friendlist.push(f.username)
        })
        return (
            <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{paddingTop: 50}}
            >
            {
                redirect ?
                <Navigate to="/mypage" /> : <></>
            }
                <Grid item xs={12} align="center">
                    <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                        Movie Night Details
                    </p>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        style={{width: '60vw', margin: 5}}
                        variant="standard"
                        label="Event Name *"
                        value={event_name}
                        name="event_name"
                        onChange={this.handleChange}
                    />
                    <TextField
                        style={{width: '60vw', margin: 5}}
                        variant="standard"
                        label="Movie Name"
                        value={movie_name}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                    <TextField
                        style={{width: '60vw', margin: 5}}
                        variant="standard"
                        label="Date and Time"
                        value={event_date}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                {
                    friendlist.length > 0 &&
                    <TextField
                        style={{width: '60vw', margin: 5}}
                        variant="standard"
                        label="Invited Friends"
                        value={friendlist.join(", ")}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                }
                </Grid>
                <Grid item xs={12} align="center" style={{marginTop: 100}}>
                    <Button
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={() => this.props.prevStep()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        style={{margin: 5}}
                        onClick={this.createEvent}
                    >
                        Finish
                    </Button>
                </Grid>
                <Snackbar
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open}
                onClose={this.handleClose}
                >
                    <Alert severity="warning">{errormsg}</Alert>
                </Snackbar>
            </Grid>
        )
    }
}

export default Step4;