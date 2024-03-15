/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import PropType from 'prop-types';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import '../style/categories.css';
import '../style/addCategory.css';

function AddCategory({type})
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const categoryInput = useRef(null);
    const [category, setCategory] = useState(null);
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

    useEffect(() => {
        if(categoryInput.current && categoryInput.current.getAttribute('data-change-event') !== 'true')
        {
            categoryInput.current.addEventListener("change", (event) => {
                onInputChange(event, categoryInput.current, categoryInput.current.parentElement.nextElementSibling);
            });
            categoryInput.current.setAttribute('data-change-event', 'true');
        }

        if(type === 'edit' && localStorage.getItem('sso_token'))
        {
            const ssoToken = localStorage.getItem('sso_token');
            fetch("http://localhost:3000/sso/admin/category/find/" + id, {                
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
                    setCategory(response.category);                    
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, []);

    let pageTitle = 'Add Category';
    if(type === 'edit')
    {
        pageTitle = 'Edit category';
    }

    let categoryValue = '';

    if(category && type === 'edit')
    {
        categoryValue = category.name;
    }

    return <>
        <div className="categories-container">
            <div className="categories-title">{pageTitle}</div>
            <form method="post" onSubmit={submitCategory}>
            <div className="form-row">
                    <div className="form-input">
                        <div className="form-input-label"><label htmlFor="categoryName">Category name</label></div>
                        <div className="form-input-content"><input ref={categoryInput} type="text" id="categoryName" name="category_name" minLength="1" maxLength="24" required defaultValue={categoryValue} /></div>
                        <div className="form-input-error"></div>
                    </div>
                </div>
                <div className='form-row'>
                    <button type='submit'>{pageTitle}</button>
                </div>
            </form>
        </div>
    </>;

    function submitCategory(event)
    {
        event.preventDefault();
        if(type === 'add')
        {
            if(categoryInput.current && !categoryInput.current.classList.contains('error') && localStorage.getItem('sso_token') &&
                categoryInput.current.value)
            {
                const requestObject = {
                    category: categoryInput.current.value
                }
                const ssoToken = localStorage.getItem('sso_token');
                // ask the backEnd
                fetch("http://localhost:3000/sso/admin/category/add", { 
                    method: 'POST',
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
                        if(response.responseStatus === 'categoryAdded')
                        {
                            navigate('/categories');
                        } else {
                            response.errors.forEach((error) => {
                                const result = categoryInput.current;

                                if(result)
                                {                    
                                    if(result.classList.contains("valid"))
                                    {
                                        result.classList.remove("valid");
                                    }       
                                    result.classList.add("error");
                                    result.parentElement.nextElementSibling.textContent = error.msg;
                                }
                            });
                        }
                    }            
                })
                .catch((error) => {
                    throw new Error(error);
                });
            }
        } else if(type === 'edit')
        {
            if(categoryInput.current && !categoryInput.current.classList.contains('error') && localStorage.getItem('sso_token') &&
                categoryInput.current.value)
            {
                const requestObject = {
                    category: categoryInput.current.value,
                    category_id: id
                }
                const ssoToken = localStorage.getItem('sso_token');
                // ask the backEnd
                fetch("http://localhost:3000/sso/admin/category/edit", { 
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
                        if(response.responseStatus === 'categoryUpdated')
                        {
                            navigate('/categories');
                        } else {
                            response.errors.forEach((error) => {
                                const result = categoryInput.current;

                                if(result)
                                {                    
                                    if(result.classList.contains("valid"))
                                    {
                                        result.classList.remove("valid");
                                    }       
                                    result.classList.add("error");
                                    result.parentElement.nextElementSibling.textContent = error.msg;
                                }
                            });
                        }
                    }            
                })
                .catch((error) => {
                    throw new Error(error);
                });
            }
        }
    }

    function onInputChange(inputEvent, input, prevSibling)
    {
        //clean up
        if(input.classList.contains("error"))
        {
            input.classList.remove("error");
            // cleanup error notif
            prevSibling.textContent = "";
        }

        if(input.classList.contains("valid"))
        {
            input.classList.remove("valid");
        }
    }
}

AddCategory.propTypes = {
    type: PropType.string
}

export default AddCategory