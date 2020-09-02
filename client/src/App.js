

import React, {useState} from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from "axios";

function App() {
  
    const urlAddress = "http://localhost:3001/";
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState(""); 

    // To store the data received from the server
    const [data, setData] = useState("");
  
    const register =() =>{
        axios({
            method: "POST",
            data:{
                username: registerUsername,
                password: registerPassword
            },
            withCredentials: true, 
            url: `${urlAddress}register`

        })
        .then(res => console.log(res));
    }


    const login = () => {
        axios({
            method: "POST",
            data:{
                username: registerUsername,
                password: registerPassword
            },
            withCredentials: true, 
            url: `${urlAddress}login`

        })
        .then(res => console.log(res));
    }
    
    
    const getUser = () => {
        axios({
            method: "GET",
            data:{
                username: loginUsername,
                password: loginPassword
            },
            withCredentials: true, 
            url: `${urlAddress}user`

        })
        .then(res => setData(res.data)); // Store the data in state
    }


    return (
    <div className="App">
      
        <div>
            <h1>Register</h1>
            <input placeholder="username" onChange={e => setRegisterUsername(e.target.value)}></input>
            <input placeholder="password" onChange={e => setRegisterPassword(e.target.value)}></input>
            <button onClick={register}>Submit</button>
        </div>

        <div>
            <h1>Login</h1>
            <input placeholder="username" onChange={e => setLoginUsername(e.target.value)}></input>
            <input placeholder="password" onChange={e => setLoginPassword(e.target.value)}></input>
            <button onClick={login}>Submit</button>
        </div>

        <div>
            <h1>Get User</h1>
            <button onClick={getUser}>User Query</button>
            {data ? <h1>Welcome Back {data.username}</h1> : null}
        </div>



    </div>
  );
}

export default App;
