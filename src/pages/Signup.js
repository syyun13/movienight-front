import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, Paper, TextField, Snackbar } from '@mui/material';
import styles from '../styles/loginStyles';

const API_URL = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/register';

class Signup extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            open: false,
            errormsg: "",
            redirect: false,
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.signupUser = this.signupUser.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    handleClose(){
        this.setState({open: false});
    }

    signupUser(){
        const { username, email, password } = this.state;
        if(!username || !email || !password){
            this.setState({
                open: true,
                errormsg: "All fields are required."
            })
        } else if(!email.includes("@") || !email.includes(".")){
            this.setState({
                open: true,
                errormsg: "Email is not valid."
            })
        } else {
            const body = {
                username: username,
                email: email,
                password: password
            };
            axios.post(API_URL, body).then(res => {
                this.setState({redirect: true});
            }).catch(error => {
                console.log(error);
                this.setState({
                    open: true,
                    error: "Cannot login!"
                });
            })
        }
    }

    render(){
        const { username, password, email, redirect, open, errormsg } = this.state;
        return ([
            <div style={styles.container} key="signup-container">
                {
                    redirect ?
                    <Navigate to="/" /> : <></>
                }
                <Paper style={styles.paper} elevation={3}>
                    <h1 style={styles.title}>Movie Night</h1>
                    <p style={styles.helperText}>
                        Register a new account
                    </p>
                    <TextField
                        fullWidth variant="filled"
                        label="Username"
                        style={styles.textfield}
                        InputProps={styles.inputProps}
                        name="username"
                        onChange={this.handleChange}
                        value={username}
                    />
                    <TextField
                        fullWidth variant="filled"
                        label="Email"
                        style={styles.textfield}
                        InputProps={styles.inputProps}
                        name="email"
                        onChange={this.handleChange}
                        value={email}
                    />
                    <TextField
                        fullWidth variant="filled"
                        label="Password"
                        style={styles.textfield}
                        InputProps={styles.inputProps}
                        name="password"
                        onChange={this.handleChange}
                        value={password}
                        type="password"
                    />
                    <Button fullWidth variant="contained" style={styles.button} onClick={this.signupUser}>
                        SIGN UP
                    </Button>
                    <p style={styles.secondaryText}>
                        Already have an account?
                        <a href="/" style={{textDecoration: 'none'}}>
                            <span style={styles.empText}> Login</span>
                        </a>
                    </p>
                </Paper>
            </div>,
            <Snackbar
                key="signup-alert"
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open}
                onClose={this.handleClose}
            >
                <Alert severity="warning">{errormsg}</Alert>
            </Snackbar>
        ])
    }
}

export default Signup;