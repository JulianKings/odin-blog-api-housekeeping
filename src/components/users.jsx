/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import '../style/users.css'
import UserItem from "./items/userItem";

function Users()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [userList, setUserList] = useState(null);

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
            fetch("http://localhost:3000/sso/admin/users", {                
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
                    setUserList(response.users);                    
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, [userObject])

    let userContent = <div className="users-prompt">Loading users...</div>;

    if(userList)
    {
        if(userList.length > 0)
        {
            userContent = userList.map((us) => <UserItem key={us._id} user={us} usersState={userList} updateUsers={setUserList} />)
        } else {
            userContent = <div className="users-prompt">There are no users right now.</div>;
        }
    }

    return <>
        <div className="users-container">
            <div className="users-title">Users</div>
            <div className="users-box">
                <div className="users-box-title">User list</div>
                <div className="users-list">
                    <div className="user-item users-information">
                        <div className="users-list-name">Name</div>
                        <div className="users-list-username">Username</div>
                        <div className="users-list-mail">E-mail</div>
                        <div className="users-list-role">Role</div>
                        <div className="users-list-menu"></div>
                    </div>
                    {userContent}
                </div>
            </div>
        </div>
    </>;
}

export default Users