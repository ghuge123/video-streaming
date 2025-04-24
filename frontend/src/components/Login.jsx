import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../context/userContext';

function Login({showAlert}) {
    const [user , setUser] = useState({email: "" , password : ""});
    let navigate = useNavigate();

    const {fetchData} = useContext(UserContext);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const url = 'http://localhost:8080/api/v1/user/login';
        const response = await fetch(url , {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: user.email , password: user.password})
        });

        const data = await response.json();
        if(data.success){
            await fetchData();
            navigate('/');
            showAlert("Login Successfully", "success");
        }else{
            showAlert("Invalid Credentials", "danger");
        }
    }

    const onChange = (e)=>{
        setUser({ ...user, [e.target.name]: e.target.value });
    }
  return (
    <div className="container d-flex justify-content-center align-items-center mt-4" >
            <div className="card p-4 shadow-lg rounded-4" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login to continue</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" >Email</label>
                        <input type="email" className="form-control" id="email" name="email"  onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" id="password" onChange={onChange} minLength={5} required />
                    </div>
                    <button className="btn btn-dark w-100" type="submit">Login</button>
                </form>
            </div>
        </div>
  )
}

export default Login
