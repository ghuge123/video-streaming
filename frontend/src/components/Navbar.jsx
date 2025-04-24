import React, { useContext, useEffect, useState, useRef } from 'react'
import logoImg from '../assets/logo.png'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from '../context/userContext';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { VideoContext } from '../context/VideoContext';

function Navbar({ toggleSidebar, showAlert }) {

    const useUser = useContext(UserContext);
    const { user, setUser } = useUser;

    const { addVideo } = useContext(VideoContext);

    const [video, setVideo] = useState({ title: "", description: "" });

    const [videoFile, setVideoFile] = useState(null);

    const [thumbnail, setThumbnail] = useState(null);


    const handleOnChange = (e) => {
        setVideo({ ...video, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", video.title);
        formData.append("description", video.description);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);
        console.log(formData);
        await addVideo(formData);
    }

    const handleLogout = async () => {
        let url = 'http://localhost:8080/api/v1/user/logout';

        const response = await fetch(url, {
            method: 'post',
            credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
            showAlert("user loggout successfully", "success");
            setUser(null);
        } else {
            showAlert("user loggout failed", "danger");
        }

    };

    return (
        <div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Upload Video</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} encType='multipart/form-data'>
                                {/* <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="border border-2 rounded-3 p-4 text-center mb-3"
                                    style={{ border: '2px dashed gray', cursor: 'pointer' }}
                                >
                                    <div style={{ height: '60px', width: '60px', borderRadius: '50%', backgroundColor: 'red', marginLeft: '174px' }} className='text-center'><FileUploadIcon style={{ marginTop: '16px' }}></FileUploadIcon></div>
                                    <p>click to select one</p>
                                    <button style={{height: '60px', width: '60px'}}>
                                        <input
                                           
                                            style={{ display: 'none' }} required
                                        />
                                    </button>
                                </div> */}

                                <div className="mb-3">
                                    <label htmlFor='video' className="form-label">Upload Video*</label>
                                    <input  type="file" accept="video/*" className="form-control" name='video' id='video' onChange={(e)=> setVideoFile(e.target.files[0])} required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor='thumbnail' className="form-label">Thumbnail*</label>
                                    <input type='file' className="form-control" name='thumbnail' onChange={(e) => setThumbnail(e.target.files[0])} id='thumbnail' required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title*</label>
                                    <input type="text" accept="image/*"  className="form-control" id="title" name='title' onChange={handleOnChange} placeholder="Enter Title here" required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description*</label>
                                    <textarea className="form-control" id="description" name="description" onChange={handleOnChange} rows="3" required></textarea>
                                </div>
                                <div className="mb-3">
                                    <button className='btn btn-success' type='submit'>Save</button>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ marginLeft: '16px', marginRight: '16px' }}>
                <nav className="navbar bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand ">
                            <div className='d-flex flex-row justify-content-center' style={{ marginTop: '5px' }}>
                                <MenuIcon onClick={toggleSidebar} style={{ marginTop: '4px' }}></MenuIcon>
                                <img src={logoImg} style={{ height: '36px', width: '36px', marginLeft: '18px' }}></img>
                                <p className='fs-5 fw-semibold' style={{ marginLeft: '2px' }}>VideoStreaming</p>
                            </div>
                        </a>
                        <form className="d-flex" role="search">
                            <div className='d-flex flex-row border rounded-2' style={{ height: '40px', width: '300px', backgroundColor: 'white' }}>
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{ border: 'none' }}></input>
                                <button className='border border-0 ' type="submit"><SearchIcon></SearchIcon></button>
                            </div>
                        </form>
                        {user ? <div>
                            <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <AddIcon style={{ marginRight: "4px" }}></AddIcon>addVideo
                            </button>

                            <button className='btn btn-success' style={{ margin: '2px' }} onClick={handleLogout}>logout</button>
                        </div> :
                            <div>
                                <Link className='btn btn-success' to='/login' style={{ margin: '2px' }}>login</Link>
                                <Link className='btn btn-success' to='/signup' style={{ margin: '2px' }}>signup</Link>
                            </div>
                        }
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Navbar
