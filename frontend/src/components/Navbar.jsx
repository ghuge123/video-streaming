import React from 'react'
import logoImg from '../assets/logo.png'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

function Navbar({ toggleSidebar}) {
    return (
        <div style={{marginLeft: '16px' , marginRight: '16px'}}>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand ">
                        <div className='d-flex flex-row justify-content-center' style={{ marginTop: '5px' }}>
                            <MenuIcon onClick = {toggleSidebar} style={{marginTop: '4px'}}></MenuIcon>
                            <img src={logoImg} style={{ height: '36px', width: '36px' , marginLeft: '18px' }}></img>
                            <p className='fs-5 fw-semibold' style={{marginLeft: '2px'}}>VideoStreaming</p>
                        </div>
                    </a>
                    <form className="d-flex" role="search">
                        <div className='d-flex flex-row border rounded-2' style={{height: '40px' , width:'300px' , backgroundColor:'white'}}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{border: 'none'}}></input>
                            <button className='border border-0 ' type="submit"><SearchIcon></SearchIcon></button>
                        </div>
                    </form>
                    <div>
                        <Link className='btn btn-success' to='/login' style={{margin: '2px'}}>login</Link>
                        <button  className='btn btn-success' style={{margin: '2px'}}>signUp</button>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
