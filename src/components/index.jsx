/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Index()
{
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem('sso_token'))
        {
            navigate('/login');
        }
    }, [])

}

export default Index;