/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import '../style/users.css';
import '../style/removeUser.css';

function RemoveUser()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [deletionError, setDeletionError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if(!localStorage.getItem('sso_token'))
        {
            navigate('/login');
        }

        if(userObject && userObject.role !== 'administrator')
        {
            navigate('/logout');
        }
    }, [userObject]);

    let userDeletionError = '';

    if(deletionError)
    {
        userDeletionError = <div className="remove-users-error">{deletionError}</div>
    }

    return <>
        <div className="users-container">
            <div className="users-title">Confirm deletion</div>
            {userDeletionError}
            <div className="remove-users-description">The user that you&apos;re about to delete also can have comments, which will also be deleted.
            <br /><br />Keep in mind that articles created by this user must be deleted first before this user can be deleted.</div>
            <div className="remove-users-confirm-prompt">Are you sure you want to delete this user?</div>
            <div className="remove-users-confirm">
                <button onClick={() => { deleteUser() }} type="button">Delete user</button>
            </div>
        </div>
    </>;

    function deleteUser()
    {
        if(localStorage.getItem('sso_token'))
        {
            const requestObject = {
                user_id: id
            }
            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/users/force_delete", { 
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
                    if(response.responseStatus === 'userDeleted')
                    {
                        navigate('/users');
                    } else if(response.responseStatus === 'userHasArticles' || 
                        (response.responseStatus === 'notEnoughPermissions'))
                    {
                        setDeletionError(response.error);
                    }
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }
}

export default RemoveUser