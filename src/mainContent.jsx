/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './content.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import homeIcon from './assets/home.svg';
import articleIcon from './assets/book.svg';
import categoryIcon from './assets/list.svg';
import usersIcon from './assets/users.svg';
import settingsIcon from './assets/settings.svg';
import logoutIcon from './assets/log-out.svg';

function MainContent()
{
    const [userObject, setUserObject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem('sso_token'))
        {
            navigate('/login');
        }

        if(localStorage.getItem('sso_token'))
        {
            const ssoToken = localStorage.getItem('sso_token');
            fetch("http://localhost:3000/sso", {                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + ssoToken
                },
                mode: "cors",
                dataType: 'json',
             })
            .then((response) => {
                if(response.status === 401)
                {
                    // Awaiting for login or token expired

                    if(localStorage.getItem('sso_token'))
                    {
                        localStorage.removeItem('sso_token');
                    }
                    // cleanup user if it exists
                    if(userObject)
                    {
                        setUserObject(null);
                    }
                    return null;
                } else if (response.status >= 400) {
                    throw new Error("server error");
                }
                return response.json();
            })
            .then((response) => {
                if(response)
                {
                    // We are logged in
                    setUserObject(response.user);
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, []);

    return <>
    <div className='content-box'>
        <nav className='navigation'>
        <div className='navigation-box'>
            <div className='navigation-logo'>Blog<span>API</span></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/' className={({ isActive }) => isActive ? "selected" : ""}>
                    <img src={homeIcon} />
                    <span>Dashboard</span>
                </NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/articles' className={({ isActive }) => isActive ? "selected" : ""}>
                    <img src={articleIcon} />
                    <span>Articles</span>
                </NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/categories' className={({ isActive }) => isActive ? "selected" : ""}>
                    <img src={categoryIcon} />
                    <span>Categories</span>
                </NavLink>
            </div></div>
            <div className='navigation-link-box navigation-end'><div className='navigation-link'>
                <NavLink to='/users' className={({ isActive }) => isActive ? "selected" : ""}>
                    <img src={usersIcon} />
                    <span>Users</span>
                </NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/settings' className={({ isActive }) => isActive ? "selected" : ""}>
                    <img src={settingsIcon} />
                    <span>Settings</span>
                </NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/logout' className={({ isActive }) => isActive ? "selected" : ""}>
                    <img src={logoutIcon} />
                    <span>Logout</span>
                </NavLink>
            </div></div>
        </div>
        </nav>
        <main className='content-holder'>
            <Outlet context={[userObject, setUserObject]} />
        </main>

        <footer className='footer'>© 2024 Site developed as part of one of the final lessons for The Odin Project</footer>
    </div>
    </>
}

export default MainContent