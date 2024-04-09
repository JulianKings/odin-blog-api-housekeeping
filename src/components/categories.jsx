/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import '../style/categories.css';
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';

function Categories()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        if(!localStorage.getItem('sso_token'))
        {
            navigate('/login');
        }

        if(userObject && (userObject.role !== 'administrator' && userObject.role !== 'author'))
        {
            navigate('/logout');
        } else if(userObject)
        {
            // fetch
            const ssoToken = localStorage.getItem('sso_token');
            fetch("http://localhost:3000/sso/admin/categories", {                
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
                    setCategories(response.categories);                    
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, [userObject]);

    let categoryContent = <div className="category-prompt">Loading categories...</div>;

    if(categories)
    {
        if(categories.length > 0)
        {
            categoryContent = categories.map((category) =>
            { 
                return (<Fragment key={category._id}>
                    <div className="category-holder">
                        <div className="category-name">{category.name}</div>
                        <img src={editIcon} onClick={() => { navigate('/categories/edit/' + category._id) }} />
                        <img src={deleteIcon} onClick={() => { attemptDeletion(category._id) }} />
                    </div>
                </Fragment>);
            })
        } else {
            categoryContent = <div className="category-prompt">There are no categories</div>;
        }
    }

    return <>
        <div className="categories-container">
            <div className="categories-title">Categories</div>
            <div className="categories-add">
                <button onClick={() => { navigate('/categories/add') }} type="button">Add new category</button>
            </div>
            <div className="categories-list">
                {categoryContent}
            </div>
        </div>
    </>;

    function attemptDeletion(categoryId)
    {
        if(localStorage.getItem('sso_token'))
        {
            const requestObject = {
                category_id: categoryId
            }
            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("http://localhost:3000/sso/admin/category/delete", { 
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
                        const newCategoryList = categories.filter((category) => {
                            if(category._id === categoryId)
                            {
                                return false;
                            }
                            return true;
                        });
                        setCategories(newCategoryList);
                    } else if(response.responseStatus === 'confirmDeletion') {
                        navigate('/categories/delete/' + categoryId);
                    }
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }
}

export default Categories