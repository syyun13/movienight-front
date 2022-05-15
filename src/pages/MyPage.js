import React, { Component } from 'react';
import { Header, EditEvent } from '../components';
import axios from 'axios';
import { Grid, Button, Tooltip, Alert, Snackbar } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { getUser } from '../service/AuthService';
import styles from '../styles/mypageStyles';

const EVENT_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/event';
const USER_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/user';
const EMAIL_API = 'https://o9hf4zchn4.execute-api.us-east-1.amazonaws.com/prod/email';

class MyPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            events: [],
            loaded: false,
            redirect: false,
            editMode: false,
            selectedEvent: null,
            open: false,
            msg: "",
        }

        this.editEvent = this.editEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.sendReminder = this.sendReminder.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount(){
        const user_id = getUser();
        if(user_id){
            const params = {
                userid: user_id
            }
            axios.get(EVENT_API, {params: params}).then(res => {
                this.setState({
                    events: res.data
                })
            }).catch(error => {
                console.log(error);
            })
        }
    }

    editEvent(event){
        this.setState({ selectedEvent: event, editMode: true });
    }

    deleteEvent(event){
        const params = {
            eventid: event[0]
        };
        axios.delete(EVENT_API, {params: params}).then(res => {
            window.location.reload();
        }).catch(error => {
            console.log(error);
        })
    }

    cancelEdit(){
        this.setState({ editMode: false, selectedEvent: null });
        window.location.reload();
    }

    sendReminder(event_id, event_name){
        const params = {
            eventid: event_id
        };
        let emailList = [];
        axios.get(USER_API, {params: params}).then(res => {
            res.data.forEach(f => {
                emailList.push(f[2]);
            })
            emailList.forEach(email => {
                const body = {
                    email: email,
                    event_name: event_name
                };
                axios.post(EMAIL_API, body).then(res => {
                    this.setState({
                        open: true,
                        msg: "Reminder successfully sent!"
                    })
                }).catch(error => {
                    console.log(error);
                })
            })
        }).catch(error => {
            console.log(error);
        })
    }

    handleClose(){
        this.setState({open: false});
    }

    render(){
        const { events, loaded, editMode, selectedEvent, open, msg } = this.state;

        return (
            <div>
                <Header page="mypage" />
                <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{paddingTop: 50}}
                >
            {
                (loaded && events.length === 0) &&
                <Grid item xs={12} align="center">
                    <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                        No events created yet!
                    </p>
                </Grid>
            }
            {
                !editMode && events.map((event, i) => {
                    const event_id = event[0];
                    const event_name = event[1];
                    const event_date = event[2];
                    const movie_name = event[3];
                    const poster_img = event[4];
                    return (
                        <Grid item xs={4} key={i} align="center">
                            <p style={styles.eventName}>
                                <Tooltip title="Send reminder">
                                    <NotificationsActiveIcon style={styles.notify} onClick={() => this.sendReminder(event_id, event_name)} />
                                </Tooltip>
                                {event_name}
                            </p>
                            <p style={styles.eventDate}><b>Date: </b>{event_date}</p>
                            <p style={styles.movieName}><b>Movie: </b>{movie_name}</p>
                            <img style={styles.poster} src={poster_img} alt={movie_name} />
                            <br />
                            <Button
                                variant="contained"
                                style={styles.editButton}
                                onClick={() => this.editEvent(event)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                style={styles.editButton}
                                onClick={() => this.deleteEvent(event)}
                            >
                                Delete
                            </Button>
                        </Grid>
                    )
                })
            }
            {
                editMode &&
                <EditEvent event={selectedEvent} cancelEdit={this.cancelEdit} />
            }
                </Grid>
                <Snackbar
                    variant="contained"
                    autoHideDuration={6000}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={open}
                    onClose={this.handleClose}
                >
                    <Alert severity="success">{msg}</Alert>
                </Snackbar>
            </div>
        )
    }
}

export default MyPage;