import React, { Component } from 'react';
import { Header, RankList } from '../components';

class Rank extends Component {
    render(){
        return (
            <div>
                <Header page="rank" />
                <RankList />
            </div>
        )
    }
}

export default Rank;