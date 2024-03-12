/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './content.css'
import { NavLink, Outlet } from 'react-router-dom';

function MainContent()
{
    const [userObject, setUserObject] = useState(null);

    useEffect(() => {

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
            <div className='navigation-logo'>Blog<span>API</span></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/' className={({ isActive }) => isActive ? "selected" : ""}>Dashboard</NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/articles' className={({ isActive }) => isActive ? "selected" : ""}>Articles</NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/categories' className={({ isActive }) => isActive ? "selected" : ""}>Categories</NavLink>
            </div></div>
            <div className='navigation-link-box navigation-end'><div className='navigation-link'>
                <NavLink to='/users' className={({ isActive }) => isActive ? "selected" : ""}>Users</NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/settings' className={({ isActive }) => isActive ? "selected" : ""}>Settings</NavLink>
            </div></div>
            <div className='navigation-link-box'><div className='navigation-link'>
                <NavLink to='/logout' className={({ isActive }) => isActive ? "selected" : ""}>Logout</NavLink>
            </div></div>
        </nav>
        <main className='content-holder'>
            <Outlet context={[userObject, setUserObject]} />
        </main>

        <footer className='footer'>© 2024 Site developed as part of one of the final lessons for The Odin Project</footer>
    </div>
    </>
}

export default MainContent