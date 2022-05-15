import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Grid, Button, Snackbar, Alert } from '@mui/material';
import { Header } from '../components';
import { getUser } from '../service/AuthService';
import axios from 'axios';
import styles from '../styles/mypageStyles';

const EVENT_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/event';
const USER_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/user';

class FindEvent extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null,
            events: [],
            open: false,
            redirect: false,
            selectedEvent: null,
            severity: "success",
            msg: "",
        }
        this.handleClose = this.handleClose.bind(this);
        this.joinEvent = this.joinEvent.bind(this);
    }

    componentDidMount(){
        const params = {
            userid: 'all'
        };
        axios.get(EVENT_API, {params: params}).then(res => {
            this.setState({
                events: res.data,
            })
        }).catch(error => {
            console.log(error);
        })
        this.setState({
            user: getUser()
        });
    }

    handleClose(){
        this.setState({
            open: false,
            selectedEvent: null,
        });
    }

    joinEvent(event){
        const body = {
            user_id: this.state.user,
            event_id: event[0]
        };
        axios.post(USER_API, body).then(res => {
            this.setState({
                open: true,
                msg: "You successfully joined the event!",
                redirect: true,
            });
        }).catch(error => {
            this.setState({
                open: true,
                severity: "error",
                msg: "Sorry! You could not join this event."
            })
        })
    }

    render(){
        const { events, open, redirect, severity, msg } = this.state;
        return (
            <div>
            {
                redirect ? <Navigate to="/mypage" /> : <></>
            }
                <Header page="event" />
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{paddingTop: 50}}
                >
                {
                    events.map((event, i) => {
                        const event_name = event[1];
                        const event_date = event[2];
                        const movie_name = event[3];
                        const poster_img = event[4];
                        const count = event[5];
                        const user = parseInt(count) > 1 ? 'users' : 'user';
                        return (
                            <Grid item xs={4} key={i} align="center">
                                <p style={styles.eventName}>{event_name}</p>
                                <p style={styles.eventDate}><b>Date: </b>{event_date}</p>
                                <p style={styles.movieName}><i>{count} {user} have already joined!</i></p>
                                <img style={styles.poster} src={poster_img} alt={movie_name} />
                                <br />
                                <Button
                                variant="contained"
                                style={styles.editButton}
                                onClick={() => this.joinEvent(event)}
                                >
                                    Join Event
                                </Button>
                            </Grid>
                        )
                    })
                }
                </Grid>
                <Snackbar
                    open={open}
                    onClose={this.handleClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    autoHideDuration={3000}
                >
                    <Alert severity={severity} variant="filled">{msg}</Alert>
                </Snackbar>
            </div>
        )
    }
}

export default FindEvent;