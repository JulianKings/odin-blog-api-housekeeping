/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import '../style/articles.css'

function Articles()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();

    useEffect(() => {
        if(!localStorage.getItem('sso_token'))
        {
            navigate('/login');
        }

        if(userObject && userObject.role !== 'administrator')
        {
            navigate('/logout');
        } else if(userObject)
        {
            // fetch
            const ssoToken = localStorage.getItem('sso_token');
            fetch("http://localhost:3000/sso/admin/dashboard", {                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + ssoToken
                },
                mode: "cors",
                dataType: 'json',
             })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("server error");
                }
                return response.json();
            })
            .then((response) => {
                if(response && response.responseStatus === 'validRequest')
                {
                    // We are logged in
                    
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, [userObject])

    return <>
        <div className="articles-container">
            <div className="articles-title">Articles</div>
        </div>
    </>;
}

export default Articles