import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Grid, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import { getUser, resetUserSession } from '../service/AuthService';
import styles from '../styles/headerStyles';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            friends: false,
        }

        this.logout = this.logout.bind(this);
    }

    componentDidMount(){
        const currentUser = getUser();
        if(!currentUser) this.setState({redirect: true});
    }

    logout(){
        resetUserSession();
        this.setState({redirect: true});
    }

    render(){
        const { page } = this.props;
        const { redirect, friends } = this.state;
        return (
            <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={styles.navbar}
            >
                {
                    redirect ?
                    <Navigate to="/" /> : <></>
                }
                {
                    friends ?
                    <Navigate to="/friends" /> : <></>
                }
                <h1 style={styles.title}>Movie Night</h1>
                <div>
                    <Link to="/main">
                        <p style={page === "main" ? styles.navSelected : styles.nav}>Find Movie</p>
                    </Link>
                    <Link to="/findevent">
                        <p style={page === "event" ? styles.navSelected : styles.nav}>Find Event</p>
                    </Link>
                    <Link to="/rank">
                        <p style={page === "rank" ? styles.navSelected : styles.nav}>Top Picks</p>
                    </Link>
                    <Link to="/mypage">
                        <p style={page === "mypage" ? styles.navSelected : styles.nav}>My Page</p>
                    </Link>
                </div>
                <Tooltip title="Friends">
                    <PeopleIcon
                        style={{position: 'fixed', right: '4em', cursor: 'pointer'}}
                        onClick={() => this.setState({friends: true})}
                    />
                </Tooltip>
                <Tooltip title="Logout">
                    <LogoutIcon
                        style={{position: 'fixed', right: '2em', cursor: 'pointer'}}
                        onClick={this.logout}
                    />
                </Tooltip>
            </Grid>
        )
    }
}

export default Header;