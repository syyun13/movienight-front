import React, { Component } from 'react';
import { Header, Search } from '../components';

class Main extends Component {
    render(){
        return (
            <div>
                <Header page="main" />
                <Search />
            </div>
        )
    }
}

export default Main;