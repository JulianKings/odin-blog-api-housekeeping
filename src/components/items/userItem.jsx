import PropTypes from 'prop-types';
import '../../style/userItem.css';
import moreIcon from '../../assets/more.svg';
import { Link } from 'react-router-dom';

function UserItem({ user, usersState, updateUsers }) {

    const roleClass = 'users-list-role ' + user.membership_role;

    const capitalizedRole = user.membership_role.charAt(0).toUpperCase() + user.membership_role.slice(1);

    const deleteLink = '/users/delete/' + user._id;

    let menuBoxContent = 
    <div className='users-list-menu-box-container'>
        <div className='users-list-menu-box-item'>
            Unable to modify
        </div>
    </div>;

    if(user.membership_role !== 'administrator')
    {
        menuBoxContent = 
        <div className='users-list-menu-box-container'>
            <div className='users-list-menu-box-item'>
                <Link onClick={attemptPromoteAdmin} to='/users'>Promote to Administrator</Link>
            </div>
            <div className='users-list-menu-box-item'>
                <Link onClick={attemptPromoteAuthor} to='/users'>{(user.membership_role === 'author') ? 'Demote to user' : 'Promote to author'}</Link>
            </div>
            <div className='users-list-menu-box-item'>
                <Link onClick={attemptBan} to='/users'>{(user.is_banned) ? 'Unban' : 'Ban'}</Link>
            </div>
            <div className='users-list-menu-box-item'>
                <Link to={deleteLink}>Delete</Link>
            </div>
        </div>;
    }
    
    return <>
        <hr className='users-separator' />
        <div className="users-list-item user-item">
            <div className="users-list-name">{user.first_name} {user.last_name}</div>
            <div className="users-list-username">{user.username}</div>
            <div className="users-list-mail">{user.email}</div>
            <div className={roleClass}>{capitalizedRole}</div>
            <div className="users-list-menu" tabIndex={0}>
                <img src={moreIcon} />

                <div className='users-list-menu-box'>
                    {menuBoxContent}
                </div>
            </div>
        </div>
    </>;

    function attemptBan(event)
    {
        event.preventDefault();
        if(updateUsers && localStorage.getItem('sso_token'))
        {
            const requestObject = {};
            requestObject.user_id = user._id;
            requestObject.user_is_banned = user.is_banned;

            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("http://localhost:3000/sso/admin/users/update_ban", { 
                method: 'PUT',
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
                    if(response.responseStatus === 'userBanUpdated')
                    {
                        const updatedUser = response.updatedResult;
                        const oldArray = usersState.filter((us) => us._id !== user._id);
                        const updatedArray = [updatedUser].concat(oldArray);
                        updateUsers(updatedArray);
                    } 
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }

    function attemptPromoteAuthor(event)
    {
        event.preventDefault();
        if(updateUsers && localStorage.getItem('sso_token'))
        {
            const requestObject = {};
            requestObject.user_id = user._id;
            requestObject.user_role = (user.membership_role === 'author') ? 'user' : 'author';

            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("http://localhost:3000/sso/admin/users/update_role", { 
                method: 'PUT',
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
                    if(response.responseStatus === 'userRoleUpdated')
                    {
                        const updatedUser = response.updatedResult;
                        const oldArray = usersState.filter((us) => us._id !== user._id);
                        const updatedArray = [updatedUser].concat(oldArray);
                        updateUsers(updatedArray);
                    } 
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }

    function attemptPromoteAdmin(event)
    {
        event.preventDefault();
        if(updateUsers && localStorage.getItem('sso_token'))
        {
            const requestObject = {};
            requestObject.user_id = user._id;
            requestObject.user_role = 'administrator';

            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("http://localhost:3000/sso/admin/users/update_role", { 
                method: 'PUT',
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
                    if(response.responseStatus === 'userRoleUpdated')
                    {
                        const updatedUser = response.updatedResult;
                        const oldArray = usersState.filter((us) => us._id !== user._id);
                        const updatedArray = [updatedUser].concat(oldArray);
                        updateUsers(updatedArray);
                    } 
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }
}

UserItem.propTypes = {
    user: PropTypes.object,
    usersState: PropTypes.array,
    updateUsers: PropTypes.func
}

export default UserItem