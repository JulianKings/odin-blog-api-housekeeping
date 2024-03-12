/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './content.css'
import { Outlet } from 'react-router-dom';

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
            <div className='navigation-link'>Dashboard</div>
            <div className='navigation-link'>Articles</div>
            <div className='navigation-link'>Categories</div>
            <div className='navigation-link navigation-end'>Users</div>
            <div className='navigation-link navigation-end'>Settings</div>
            <div className='navigation-link navigation-end'>Logout</div>
        </nav>
        <main className='content-holder'>
            <Outlet context={[userObject, setUserObject]} />
        </main>

        <footer className='footer'>footer</footer>
    </div>
    </>
}

export default MainContent