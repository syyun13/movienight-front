import React, { Component } from 'react';
import { Grid, Button, TextField, Chip, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import styles from '../styles/searchStyles';

const USER_API = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/user'

class Step3 extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            open: false,
            errormsg: "",
        }

        this.findUser = this.findUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
    }

    findUser(){
        const { username } = this.state;
        const { friends } = this.props;
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
            axios.get(USER_API, {params: params}).then(res => {
                const friend = {
                    id: res.data,
                    username: username,
                }
                newList.push(friend);
                this.props.setValue('friends', newList);
            }).catch(error => {
                this.setState({
                    open: true,
                    errormsg: error.response.data
                });
            })
        }
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
        const { friends } = this.props;
        let newList = friends.filter(function(friend) {
            return friend.id !== id;
        });
        this.props.setValue('friends', newList)
    }

    render(){
        const { username, open, errormsg } = this.state;
        const { friends } = this.props;
        return (
            <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{paddingTop: 50}}
            >
                <Grid item xs={12} align="center">
                    <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                        Who will you invite?
                    </p>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        variant="outlined"
                        style={{width: '500px'}}
                        value={username}
                        name="username"
                        onChange={this.handleChange}
                        helperText="Click next if you don't want to add a friend"
                        InputProps={{
                            endAdornment: <Button variant="contained" style={styles.searchButton} onClick={() => this.findUser()}>Add</Button>
                        }}
                    />
                </Grid>
                <Grid item xs={12} align="center" style={{marginTop: 30}}>
                {
                    friends.map(friend => (
                        <Chip
                            variant="outlined"
                            key={friend.id} label={friend.username}
                            onDelete={() => this.deleteFriend(friend.id)}
                        />
                    ))
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
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={() => this.props.nextStep()}
                    >
                        Next
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

export default Step3;