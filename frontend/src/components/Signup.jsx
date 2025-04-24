import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup({ showAlert }) {
    const [user, setUser] = useState({ fullName: "", username: "", email: "", password: "" });

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("fullName", user.fullName);
        formData.append("username", user.username);
        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("avatar", avatar);
        formData.append("coverImage", coverImage);

        const url = 'http://localhost:8080/api/v1/user/register';

        const response = await fetch(url, {
            method: "post",
            body: formData
        })
        const data = await response.json();
        if (data.success) {
            navigate("/login");
            showAlert("Register successfully", 'success');
        } else {
            showAlert(data.message , 'danger');
        }
    }

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    return (
        <div className="container d-flex justify-content-center align-items-center" >
            <div className="card p-4 shadow-lg rounded-4">
                <h2 className="text-center mb-4">Sign up to continue</h2>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">FullName</label>
                        <input type="text" className="form-control" id="fullName" name="fullName" placeholder="Enter your fullname" onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" name="username" placeholder="Enter your username" onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">AvatarImage</label>
                        <input type="file" className="form-control" id="avatar" name="avatar" onChange={(e) => setAvatar(e.target.files[0])} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="coverImage" className="form-label">CoverImage</label>
                        <input type="file" className="form-control" id="coverImage" name="coverImage" onChange={(e) => setCoverImage(e.target.files[0])} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" >Email</label>
                        <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" id="password" onChange={onChange} minLength={5} required />
                    </div>
                    <button className="btn btn-dark w-100" type="submit">Sign up</button>
                </form>
            </div>
        </div>
    )
}

export default Signup
