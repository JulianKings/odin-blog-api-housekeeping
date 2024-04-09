/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

function RemoveComment()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const { id } = useParams();

    useEffect(() => {
        if(!localStorage.getItem('sso_token'))
        {
            navigate('/login');
        }

        if(userObject && userObject.role !== 'administrator')
        {
            if(userObject.role === 'author')
            {
                navigate('/');
            } else {
                navigate('/logout');
            }
        } else if(userObject)
        {
            const requestObject = {
                comment_id: id
            }
            const ssoToken = localStorage.getItem('sso_token');
            // ask the backend
            fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/comments/force_delete", { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + ssoToken
                },
                mode: "cors",
                dataType: 'json',
                body: JSON.stringify(requestObject),
            })
            .then((response) => {
            if (response.status >= 400) {
                throw new Error("server error");
            }
            return response.json();
            })
            .then((response) => {
                if(response.responseStatus)
                {
                    if(response.responseStatus === 'commentDeleted')
                    {
                        navigate('/');
                    } else {
                        // an error happened
                        navigate('/');
                    }
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }, [userObject]);

    return <>
        <div className="comment-container">
            Deleting comment...
        </div>
    </>;
}

export default RemoveComment