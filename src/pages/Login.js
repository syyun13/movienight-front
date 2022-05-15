import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, Paper, TextField, Snackbar } from '@mui/material';
import { setUserSession } from '../service/AuthService';
import styles from '../styles/loginStyles';

const API_URL = 'https://09vz5t8w6i.execute-api.us-east-1.amazonaws.com/prod/login';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            username: "",
            password: "",
            open: false,
            errormsg: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClose(){
        this.setState({open: false});
    }

    loginUser(){
        const { username, password } = this.state;
        if(!username || !password){
            this.setState({
                open: true,
                errormsg: "All fields are required."
            })
        } else {
            const body = {
                username: username,
                password: password
            };
            axios.post(API_URL, body).then(res => {
                setUserSession(res.data);
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
        const { username, password, redirect, open, errormsg } = this.state;
        return ([
            <div style={styles.container} key="login-container">
                {
                    redirect ?
                    <Navigate to="/main" /> : <></>
                }
                <Paper style={styles.paper} elevation={3}>
                    <h1 style={styles.title}>Movie Night</h1>
                    <p style={styles.helperText}>
                        Log in to your account
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
                        label="Password"
                        style={styles.textfield}
                        InputProps={styles.inputProps}
                        name="password"
                        onChange={this.handleChange}
                        value={password}
                        type="password"
                    />
                    <Button fullWidth variant="contained" style={styles.button} onClick={this.loginUser}>
                        LOGIN
                    </Button>
                    <p style={styles.secondaryText}>
                        Don't have an account?
                        <a href="/signup" style={{textDecoration: 'none'}}>
                            <span style={styles.empText}> Register now</span>
                        </a>
                    </p>
                </Paper>
            </div>,
            <Snackbar
            autoHideDuration={6000}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={open}
            onClose={this.handleClose}
            key="login-alert"
            >
                <Alert severity="warning">{errormsg}</Alert>
            </Snackbar>
        ])
    }
}

export default Login;