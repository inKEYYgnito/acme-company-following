import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const API = 'https://acme-users-api-rev.herokuapp.com/api';
const userId = '0ecacbc6-d53e-4188-81d5-6553d356ef54';

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            companies: [],
            followingCompanies: []
        }
    }
    componentDidMount() {
        Promise.all([
            axios.get(`${API}/users/detail/${userId}`),
            axios.get(`${API}/companies`),
            axios.get(`${API}/users/${userId}/followingCompanies`)
        ]).then(responses => {
            const [user, companies, followingCompanies] = responses.map(response => response.data)
            this.setState({
                user: user.fullName,
                companies,
                followingCompanies
            })
        })
    }
    render() {
        const { user, companies, followingCompanies } = this.state;
        return (
            <div>
                <h1>Acme Company Follower</h1>
                <h3>You ({user}) are following {followingCompanies.length} companies</h3>
            </div>
        )
    }
}

const root = document.getElementById('root');
ReactDOM.render(<App />, root);