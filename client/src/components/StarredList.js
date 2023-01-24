import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import axios from "axios";
import {useState, useEffect,} from "react";
import {useNavigate} from "react-router-dom";

export const StarredList = () => {
    const logOut = () => {
        localStorage.removeItem('token');
        navigate("/");
    }
    const handleStarredRepos = () => {
        let data={};
        if(ghToken!==''){
            Object.assign(data, {
                'access_token_gh': `${ghToken}`,
            });
        }
        axios
            .post(`http://localhost:8081/github-actions/starred`,
                data,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
            .then((res) =>{
                console.log(res);

            }).catch((err)=>{console.log(err)});
    }
    const handleChange = (event) => {
        setGhToken(event.target.value);
    };
    const navigate = useNavigate();
    const [repos, setRepos] = useState([])
    const [user, setUser] = useState({})
    const [ghToken, setGhToken] = useState('');
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    useEffect( () => {
        if (token) {
            localStorage.setItem('token', token);
                     axios
                        .get(`http://localhost:8081/github-actions/starred`,
                            {headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
                        .then((res) =>{
                            setUser(res.data.user);
                            setRepos(res.data.starred_repos);
                        }).catch((err)=>{console.log(err)});
        } else if(localStorage.getItem('token')) {
            axios
                .get(`http://localhost:8081/github-actions/starred`,
                    {headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
                .then((res) =>{
                    setUser(res.data.user);
                    setRepos(res.data.starred_repos);
                }).catch((err)=>{console.log(err)});
        }else {
            navigate("/")
        }
    }, [])

    return (
        <div style={{height: 400, width: '100%'}}>
            <h1>This pages shows starred Repos of {user.gh_username} with fullname {user.full_name} </h1>
            <div>
                <table id="customers">
                    <tr>
                        <th>Repo Name</th>
                        <th>Language</th>
                        <th>Repo Url</th>
                    </tr>
                    {repos.map(repo => (
                        <tr key={repo._id}>
                            <td>{repo.repo_name}</td>
                            <td>{repo.language}</td>
                            <td className='link'><a href={repo.repo_url}>{repo.repo_url}</a></td>
                        </tr>
                    ))}
                </table>
            </div>
            <div >
                <button onClick={logOut}>logout</button>
            </div>
            <div >
                <button onClick={handleStarredRepos}>Get recent repos</button>
                <input
                    type="text"
                    id="message"
                    name="message"
                    onChange={handleChange}
                    value={ghToken}
                />
                <h3>The input field is optional. You can put your personal access token to get all starred repos you want.Then click button Get recent repos</h3>
            </div>

        </div>
    );
}