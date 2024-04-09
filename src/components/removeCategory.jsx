/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import '../style/categories.css';
import '../style/removeCategory.css';

function RemoveCategory()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [categoryArticles, setCategoryArticles] = useState(null);
    const [deletionError, setDeletionError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if(!localStorage.getItem('sso_token'))
        {
            navigate('/login');
        }

        if(userObject && (userObject.role !== 'administrator' && userObject.role !== 'author'))
        {
            navigate('/logout');
        }
    }, [userObject]);

    useEffect(() => {

        if(localStorage.getItem('sso_token'))
        {
            const ssoToken = localStorage.getItem('sso_token');
            fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/category/delete/find/" + id, {                
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
                if(response && response.responseStatus === 'categoryFound')
                {
                    setCategoryArticles(response.articles);                    
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, []);

    let articlesContent = <div className="categories-prompt">Loading articles...</div>;

    if(categoryArticles)
    {
        if(categoryArticles.length > 0)
        {
            articlesContent = categoryArticles.map((article) => {
                return <Fragment key={article._id}>
                    <div className="categories-article-item">
                        <div className="categories-article-item-name">- {article.title}</div>
                    </div>
                </Fragment>
            })
        } else {
            articlesContent = <div className="categories-prompt">No articles found</div>
        }
    }

    let categoryDeletionError = '';

    if(deletionError)
    {
        categoryDeletionError = <div className="categories-error">{deletionError}</div>
    }

    return <>
        <div className="categories-container">
            <div className="categories-title">Confirm deletion</div>
            {categoryDeletionError}
            <div className="categories-description">The category that you&apos;re about to delete has the following articles, which will also be deleted:</div>
            <div className="categories-article-list">{articlesContent}</div>
            <div className="categories-confirm-prompt">Are you sure you want to delete this category?</div>
            <div className="categories-add">
                <button onClick={() => { deleteCategory() }} type="button">Delete category</button>
            </div>
        </div>
    </>;

    function deleteCategory()
    {
        if(localStorage.getItem('sso_token'))
        {
            const requestObject = {
                category_id: id
            }
            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/category/force_delete", { 
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
                    if(response.responseStatus === 'categoryDeleted')
                    {
                        navigate('/categories');
                    } else if(response.responseStatus === 'categoryHasFeaturedArticle' || 
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

export default RemoveCategory