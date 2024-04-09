/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import '../style/articles.css';
import '../style/removeArticle.css';

function RemoveArticle()
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

        if(userObject && userObject.role !== 'administrator' && userObject.role !== 'author')
        {
            navigate('/logout');
        }
    }, [userObject]);

    let articleDeletionError = '';

    if(deletionError)
    {
        articleDeletionError = <div className="remove-articles-error">{deletionError}</div>
    }

    return <>
        <div className="articles-container">
            <div className="articles-title">Confirm deletion</div>
            {articleDeletionError}
            <div className="remove-articles-description">The article that you&apos;re about to delete also can have comments, which will also be deleted.</div>
            <div className="remove-articles-confirm-prompt">Are you sure you want to delete this article?</div>
            <div className="remove-articles-confirm">
                <button onClick={() => { deleteArticle() }} type="button">Delete article</button>
            </div>
        </div>
    </>;

    function deleteArticle()
    {
        if(localStorage.getItem('sso_token'))
        {
            const requestObject = {
                article_id: id
            }
            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("http://localhost:3000/sso/admin/article/force_delete", { 
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
                    if(response.responseStatus === 'articleDeleted')
                    {
                        navigate('/articles');
                    } else if(response.responseStatus === 'articleIsFeatured' || 
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

export default RemoveArticle