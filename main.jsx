import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import trimSpaces from "./trimSpaces";

const API = 'https://acme-users-api-rev.herokuapp.com/api';
const userId = '9a4c1616-b387-4f1b-97d9-de432500ebb9';

const Companies = ({ companies, followingCompanies, handleChange }) => {
  const ratings = ["", 1, 2, 3, 4, 5];

  return (
    <>
      <ul>{
        companies.map(company => {
          const followed = followingCompanies
            .find(followingComp => followingComp.companyId === company.id);

          return (<li key={company.id} className={followed ? "followed" : ""}>
            <p>{company.name}</p>
            <select
              value={(followed) ? followed.rating : ""}
              onChange={(ev) => handleChange(company.id, ev.target.value, followed)}
            >{
              ratings.map(rating => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))
            }</select>
          </li>
        )})
      }</ul>
    </>
  )
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            companies: [],
            followingCompanies: [],
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(companyId, rating, followed) {
      const {followingCompanies, companies} = this.state;

      if (rating === "") {
        console.log('delete')
        axios.delete(`${API}/users/${userId}/followingCompanies/${followed.id}`)
          .then(() => {
            const remainingCompanies = followingCompanies
              .filter(followingComp => followingComp.companyId !== companyId)
            this.setState({ followingCompanies: remainingCompanies })
          })
        return;
      }

      if (!followed) {
        console.log('post')
        axios.post(`${API}/users/${userId}/followingCompanies`, {rating, companyId})
          .then(response => {
            followingCompanies.push(response.data)
            this.setState({ followingCompanies })
          })
      } else {
        console.log('put')
        axios.put(`${API}/users/${userId}/followingCompanies/${followed.id}`, {rating, companyId})
          .then(response => {
            const companyToUpdate = followingCompanies
              .find(following => following.companyId === response.data.companyId)
            companyToUpdate.rating = parseInt(rating)
            this.setState({ followingCompanies })
          })
      }
    }

    componentDidMount() {
        Promise.all([
            axios.get(`${API}/users/detail/${userId}`),
            axios.get(`${API}/companies`),
            axios.get(`${API}/users/${userId}/followingCompanies`)
        ]).then(responses => {
            let [user, companies, followingCompanies] = responses.map(response => response.data)

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
            <>
                <h1>Acme Company Follower</h1>
                <h3>You ({user}) are following {followingCompanies.length} companies</h3>
                <Companies
                  companies={companies}
                  followingCompanies={followingCompanies}
                  handleChange={this.handleChange}
                />
            </>
        )
    }
}

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
