import React, { Component } from 'react';
import { Header } from '../components';
import { Grid, Box, Button, TextField, Card, Tooltip, Alert, Snackbar, Dialog } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EventIcon from '@mui/icons-material/Event';
import BlockIcon from '@mui/icons-material/Block';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getUser } from '../service/AuthService';
import axios from 'axios';
import styles from '../styles/friendsStyles';

const USER_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/user'
const EVENT_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/event';

class Friends extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchname: "",
            selected: null,
            eventList: [],
            follower: [],
            following: [],
            severity: "success",
            open: false,
            msg: "",
            modalOpen: false,
            modalData: []
        }

        this.followUser = this.followUser.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.block = this.block.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.openModal = this.openModal.bind(this);
        this.joinEvent = this.joinEvent.bind(this);
    }

    componentDidMount(){
        const me = getUser();
        let follower = [];
        let following = [];

        // Fetch the users that I follow
        let params = {
            follower: me
        };
        axios.get(USER_API, {params: params}).then(res => {
            res.data.forEach(user => {
                let obj = {
                    id: user[0],
                    username: user[1]
                };
                following.push(obj);
            });
            this.setState({following: following});
        });

        // Fetch the users that are following me
        params = {
            following: me
        };
        axios.get(USER_API, {params: params}).then(res => {
            res.data.forEach(user => {
                let obj = {
                    id: user[0],
                    username: user[1]
                };
                follower.push(obj);
            });
            this.setState({follower: follower});
        })
    }

    followUser(){
        const { searchname, following } = this.state;
        let newFollowing = [...following];
        const me = getUser();
        const body = {
            user: searchname,
            follower: me,
        };
        if(searchname && searchname !== " "){
            axios.post(USER_API, body).then(res => {
                newFollowing.push({
                    id: res.data,
                    username: searchname
                });
                this.setState({
                    open: true,
                    msg: `You followed ${searchname}`,
                    following: newFollowing,
                    searchname: "",
                })
            }).catch(error => {
                this.setState({
                    open: true,
                    msg: error.response.data,
                    severity: "warning"
                });
            })
        }
    }

    unfollow(id){
        const me = getUser();
        const params = {
            follower: me,
            user: id,
        };
        let following = [...this.state.following];
        axios.delete(USER_API, {params: params}).then(res => {
            following = following.filter(u => u.id !== id);
            this.setState({
                open: true,
                msg: "Successfully unfollowed.",
                following: following
            });
        }).catch(error => {
            this.setState({
                open: true,
                msg: "Unfollow failed!",
                severity: "warning"
            });
        });
    }

    block(id){
        const me = getUser();
        const params = {
            follower: id,
            user: me,
        };
        let follower = [...this.state.follower];
        axios.delete(USER_API, {params: params}).then(res => {
            follower = follower.filter(u => u.id !== id);
            this.setState({
                open: true,
                msg: "Successfully blocked user.",
                follower: follower
            });
        }).catch(error => {
            this.setState({
                open: true,
                msg: "Blocking failed!",
                severity: "warning"
            });
        });
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClose(){
        this.setState({open: false});
    }

    modalClose(){
        this.setState({modalOpen: false});
    }
    
    openModal(id){
        const params = {
            userid: id
        };
        axios.get(EVENT_API, {params: params}).then(res => {
            this.setState({
                modalData: res.data,
                modalOpen: true
            })
        }).catch(error => {
            console.log(error);
        })
    }

    joinEvent(id){
        const me = getUser();
        const body = {
            user_id: me,
            event_id: id
        };
        axios.post(USER_API, body).then(res => {
            this.setState({
                modalOpen: false,
                open: true,
                msg: "You successfully joined the event!",
                severity: "success",
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
        const { searchname, open, msg, severity, follower, following, modalOpen, modalData } = this.state;
        return (
            <div>
                <Header />
                <Grid
                container
                style={{paddingTop: 50}}
                >
                    <Grid item xs={12} align="center">
                        <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                            Add New Friends
                        </p>
                        <TextField
                            variant="outlined"
                            style={{width: '500px'}}
                            value={searchname}
                            name="searchname"
                            onChange={this.handleChange}
                            helperText="Submit username"
                            InputProps={{
                                endAdornment:
                                    <Button
                                    variant="contained"
                                    style={{backgroundColor: '#4f57e8', fontWeight: 'bold'}}
                                    onClick={() => this.followUser()}
                                    >
                                        Follow
                                    </Button>
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} align="center">
                        <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                            Followers
                        </p>
                        {
                            follower.map(friend => {
                                const id = friend.id;
                                const username = friend.username;
                                return (
                                    <Card key={`follower-${username}`} sx={{maxWidth: 300, margin: 3, padding: 2}}>
                                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                            <Tooltip title="Block">
                                                <BlockIcon onClick={() => this.block(id)} style={styles.unfollow} />
                                            </Tooltip>
                                            <span style={{ display: 'table-cell', verticalAlign: 'middle'}}>{username}</span>
                                            <Tooltip title="Events">
                                                <EventIcon onClick={() => this.openModal(id)} style={styles.event} />
                                            </Tooltip>
                                        </Grid>
                                    </Card>
                                )
                            })
                        }
                    </Grid>
                    <Grid item xs={6} align="center">
                        <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                            Following
                        </p>
                        {
                            following.map(friend => {
                                const id = friend.id;
                                const username = friend.username;
                                return (
                                    <Card key={`following-${username}`} sx={{maxWidth: 300, margin: 3, padding: 2}}>
                                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                            <Tooltip title="Unfollow">
                                                <HighlightOffIcon onClick={() => this.unfollow(id)} style={styles.unfollow} />
                                            </Tooltip>
                                            <span style={{ display: 'table-cell', verticalAlign: 'middle'}}>{username}</span>
                                            <Tooltip title="Events">
                                                <EventIcon onClick={() => this.openModal(id)} style={styles.event} />
                                            </Tooltip>
                                        </Grid>
                                    </Card>
                                )
                            })
                        }
                    </Grid>
                </Grid>
                <Snackbar
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open}
                onClose={this.handleClose}
                >
                    <Alert severity={severity}>{msg}</Alert>
                </Snackbar>
                <Dialog
                    open={modalOpen}
                    onClose={this.modalClose}
                >
                    <Box style={styles.modal}>
                    {
                        modalData.map(event => {
                            const id = event[0];
                            const event_name = event[1];
                            const event_date = event[2];
                            const movie_name = event[3];
                            const poster_img = event[4];
                            return (
                                <div key={`modalevent-${id}`} style={styles.modalDiv}>
                                    <img src={poster_img} alt={movie_name} style={styles.poster} />
                                    <span style={styles.eventName}>
                                        {event_name}
                                    </span>
                                    <br />
                                    <span style={styles.eventDate}>
                                        {event_date}
                                    </span>
                                    <Tooltip title="Join">
                                        <AddCircleIcon onClick={() => this.joinEvent(id)} style={styles.add} />
                                    </Tooltip>
                                </div>
                            )
                        })
                    }
                    </Box>
                </Dialog>
            </div>
        )
    }
}

export default Friends;