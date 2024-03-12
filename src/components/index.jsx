/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import '../style/index.css';

function Index()
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
        }
    }, [userObject])

    return <>
        <div className="index-container">
            <div className="index-title">Dashboard</div>
        </div>
    </>;

}

export default Index;