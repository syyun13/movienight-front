import React, { Component } from 'react';
import { Grid, Chip, Button, TextField, Alert, Snackbar, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Upload from './Upload';
import axios from 'axios';

const USER_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/user'
const UPDATE_API_URL = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/updateevent';

class EditEvent extends Component {
    constructor(props){
        super(props);
        this.state = {
            step: 0,
            username: "",
            event_name: "",
            event_date: "",
            movie_name: "",
            poster_img: "",
            friends: [],
            open: false,
            errormsg: "",
            image_file: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.findUser = this.findUser.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.setImageFile = this.setImageFile.bind(this);
    }

    componentDidMount(){
        const event = this.props.event;
        const event_id = event[0];
        let friends = [];

        const params = {
            eventid: event_id
        };
        axios.get(USER_API, {params: params}).then(res => {
            res.data.forEach(f => {
                const obj = {
                    id: f[0],
                    username: f[1],
                }
                friends.push(obj);
            })
            this.setState({
                event_id: event[0],
                event_name: event[1],
                event_date: event[2],
                movie_name: event[3],
                poster_img: event[4],
                friends: friends,
            });
        }).catch(error => {
            console.log(error);
        })
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClose(){
        this.setState({open: false});
    }

    deleteFriend(id){
        const { friends } = this.state;
        let newList = friends.filter(function(friend) {
            return friend.id !== id;
        });
        this.setState({friends: newList});
    }

    findUser(){
        const { username, friends } = this.state;
        let newList = [...friends];
        if(!username || username === ""){
            this.setState({
                open: true,
                errormsg: "Please input username."
            });
        } else {
            const params = {
                username: username
            };
            axios.get(USER_API, {params: params}, ).then(res => {
                const friend = {
                    id: res.data,
                    username: username,
                }
                newList.push(friend);
                this.setState({friends: newList});
            }).catch(error => {
                this.setState({
                    open: true,
                    errormsg: error.response.data
                });
            })
        }
    }

    updateEvent(){
        const { event_id, event_name, event_date, friends, poster_img } = this.state;
        let guests = [];
        friends.forEach(f => {
            guests.push(f.id);
        })
        const body = {
            event_id: event_id,
            event_name: event_name,
            event_date: event_date,
            guests: guests.join(","),
            poster_img: poster_img
        };
        axios.post(UPDATE_API_URL, body).then(res => {
            this.props.cancelEdit();
        }).catch(error => {
            console.log(error);
        })
    }

    setImageFile(val){
        this.setState({
            poster_img: val
        });
    }

    render(){
        const { username, event_name, event_date, movie_name, friends, open, errormsg, poster_img, image_file } = this.state;
        const { cancelEdit } = this.props;
        return (
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Grid item xs={12} align="center">
                    <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                        Edit Event
                    </p>
                </Grid>
                <TextField
                    style={{width: '20vw', margin: 10}}
                    variant="outlined"
                    label="Event Name"
                    value={event_name}
                    name="event_name"
                    onChange={this.handleChange}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Date and Time"
                        value={event_date}
                        onChange={(newValue) => {
                            this.setState({event_date: newValue});
                        }}
                    />
                </LocalizationProvider>
                <TextField
                    style={{width: '20vw', margin: 10}}
                    variant="outlined"
                    label="Movie Name"
                    value={movie_name}
                    name="movie_name"
                    InputProps={{
                        readOnly: true
                    }}
                />
                <Grid item xs={12} align="center" style={{marginTop: 15}}>
                    <b>Users in this event are:</b>
                </Grid>
                <Grid item xs={12} align="center" style={{marginTop: 5}}>
                {
                    friends.map(friend => (
                        <Chip
                            variant="outlined"
                            key={friend.id} label={friend.username}
                            style={{margin: 5}}
                            onDelete={() => this.deleteFriend(friend.id)}
                        />
                    ))
                }
                </Grid>
                <Grid item xs={12} align="center" style={{marginTop: 5}}>
                    <TextField
                        variant="outlined"
                        style={{width: '500px'}}
                        value={username}
                        name="username"
                        onChange={this.handleChange}
                        helperText="Search for a new friend to add"
                        InputProps={{
                            endAdornment: <Button variant="contained" style={{backgroundColor: '#4f57e8', fontWeight: 'bold'}} onClick={() => this.findUser()}>Add</Button>
                        }}
                    />
                </Grid>
                <Grid item xs={12} align="center" style={{marginTop: 10}}>
                    <b>Current event poster:</b>
                    <br />
                    <img src={poster_img} alt='movie-poster' style={{margin: 10, objectFit: 'cover', width: 250, height: 400}} />
                    <br />
                    <Upload poster={poster_img} image_file={image_file} setImageFile={this.setImageFile} />
                </Grid>
                <Grid item xs={12} align="center" style={{marginTop: 20, marginBottom: 20}}>
                    <Button
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={cancelEdit}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={this.updateEvent}
                    >
                        Update
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
            </Box>
        )
    }
}

export default EditEvent;