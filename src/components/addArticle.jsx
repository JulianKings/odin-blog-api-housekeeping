/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useRef, useState } from "react";
import PropType from 'prop-types';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import '../style/articles.css';
import '../style/addArticle.css';
import useMultiRefs from "../scripts/helper/helper";
import { Editor } from '@tinymce/tinymce-react';

function AddArticle({type})
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [inputs, addInput] = useMultiRefs();
    const [categories, setCategories] = useState(null);
    const [article, setArticle] = useState(null);
    const [tinyLoaded, setTinyLoaded] = useState(false);
    const imagePreview = useRef(null);
    const editorInput = useRef(null);
    const { id } = useParams();

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
            fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/articles/categories", {                
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

    useEffect(() => {
        const inputElements = inputs();
        inputElements.forEach((input) => {
            // register all Handlers
            if(input.getAttribute('data-change-event') !== 'true')
            {
                input.addEventListener("change", (event) => {
                    onInputChange(event, input, input.parentElement.nextElementSibling);
                });
                input.setAttribute('data-change-event', 'true');
            }
        });

        if(type === 'edit' && localStorage.getItem('sso_token'))
        {
            const ssoToken = localStorage.getItem('sso_token');
            fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/article/find/" + id, {                
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
                if(response && response.responseStatus === 'articleFound')
                {
                    setArticle(response.article);                    
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, []);

    useEffect(() => {
        if(tinyLoaded && editorInput.current && type === 'edit' && article)
        {
            let cleanContent = (new DOMParser().parseFromString(article.message, "text/html")).documentElement.textContent;
            editorInput.current.setContent(cleanContent, {format : 'raw'});
        }
    }, [tinyLoaded])

    let pageTitle = 'Post article';
    if(type === 'edit')
    {
        pageTitle = 'Edit article';
    }

    let defaultTitle = '';
    let defaultDescription = '';
    let defaultCategory = 'default';
    let defaultImagePreset = '/src/assets/newspaper.webp';
    let defaultImageUrl = '';

    if(article)
    {
        defaultTitle = article.title;
        defaultDescription = article.description;
        defaultCategory = article.category;
        defaultImagePreset = (article.imageUrl.startsWith('/src/assets/')) ? article.imageUrl : '/src/assets/newspaper.webp';
        defaultImageUrl = (!article.imageUrl.startsWith('/src/assets/')) ? article.imageUrl : '';
    }

    console.log(defaultCategory);

    let categoryOptions = <option value='default'>Loading categories...</option>;

    if(categories)
    {
        if(categories.length > 0)
        {
            categoryOptions = categories.map((cat) => {
                return <Fragment key={cat._id}>
                    <option value={cat._id}>{cat.name}</option>
                </Fragment>
            });

        } else {
            categoryOptions = <option value='default'>None</option>
        }
    }

    const articleContent = <Editor
    onInit={(event, editor) => {
            setTinyLoaded(true);
            editorInput.current = editor;
        }}
    id="article_content"
    apiKey='wjz4j6marq6bhqbltqlr06r6eyq18ybo05n6m3jwkr1stxzv'
    init={{
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
      toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons',
    }}
  />

    return <>
        <div className="articles-container">
            <div className="articles-title">{pageTitle}</div>
            <form method="post" onSubmit={submitArticle}>
                <div className="form-row">
                    <div className="form-input">
                        <div className="form-input-label"><label htmlFor="article_title">Title</label></div>
                        <div className="form-input-content"><input ref={addInput} type="text" id="article_title" name="article_title" minLength="1" maxLength="24" required defaultValue={defaultTitle} /></div>
                        <div className="form-input-error"></div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-input">
                        <div className="form-input-label"><label htmlFor="article_description">Description</label></div>
                        <div className="form-input-content">
                            <textarea rows={4} ref={addInput} id="article_description" name="article_description" required defaultValue={defaultDescription}>
                            </textarea>
                        </div>
                        <div className="form-input-error"></div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-input">
                        <div className="form-input-label"><label htmlFor="article_category">Category</label></div>
                        <div className="form-input-content">
                            <select key={(article && tinyLoaded) ? 'loading' : 'loadedCategory'} ref={addInput} defaultValue={defaultCategory} id="article_category" name="article_category" required>
                                {categoryOptions}    
                            </select>
                        </div>
                        <div className="form-input-error"></div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-textarea">
                        <div className="form-input-label"><label htmlFor="article_content">Content</label></div>
                        <div className="form-input-content">
                            {articleContent}
                        </div>
                        <div className="form-input-error"></div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-input">
                        <div className="form-input-label"><label htmlFor="article_category">Image Preset</label></div>
                        <div className="form-input-content">
                            <select key={defaultImagePreset} onChange={updateImage} ref={addInput} defaultValue={defaultImagePreset} id="article_image_preset" name="article_image_preset">
                                <option value='/src/assets/working.webp'>Working man</option>  
                                <option value='/src/assets/newspaper.webp'>Newspaper</option>  
                                <option value='/src/assets/city.webp'>A city</option>     
                                <option value='/src/assets/coding.webp'>A person coding</option> 
                                <option value='/src/assets/cogwheel.webp'>Cogwheels running</option> 
                                <option value='/src/assets/lake.webp'>A city next to a lake</option> 
                                <option value='/src/assets/stock.webp'>Stock Investment</option> 
                                <option value='/src/assets/money.webp'>A bunch of money</option>                    
                            </select>
                        </div>
                        <div className="form-input-error"></div>
                        <div ref={imagePreview} className="form-input-preview">
                            <img src={defaultImagePreset} />
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-input">
                        <div className="form-input-label"><label htmlFor="article_title">Image Url</label></div>
                        <div className="form-input-content"><input ref={addInput} type="text" id="article_image" name="article_image" defaultValue={defaultImageUrl} /></div>
                        <div className="form-input-error"></div>
                    </div>
                </div>
                <div className='form-row'>
                    <button type='submit'>{pageTitle}</button>
                </div>
            </form>
        </div>
    </>;

    function updateImage(event)
    {
        let nextImage = event.target.value;
        if(imagePreview.current)
        {
            imagePreview.current.innerHTML = '<img src="' + nextImage + '" />'
        }
    }

    function submitArticle(event)
    {
        event.preventDefault();
        if(type === 'add')
        {
            const user = {};
            let errorNoticed = false;
            const inputElements = inputs();

            inputElements.forEach((input) => {
                if(input.classList.contains('error'))
                {
                    errorNoticed = true;
                } else {
                    user[input.id] = input.value;
                }
            });

            if(editorInput.current)
            {
                user.article_content = editorInput.current.getContent();
            }

            if(!errorNoticed && localStorage.getItem('sso_token'))
            {
                const ssoToken = localStorage.getItem('sso_token');
                // ask the backEnd
                fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/articles/add", { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + ssoToken
                    },
                    mode: "cors",
                    dataType: 'json',
                    body: JSON.stringify(user),
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
                        if(response.responseStatus === 'articleCreated')
                        {
                            navigate('/articles');
                        } else {
                            response.errors.forEach((error) => {
                                const result = inputElements.find((input) => {
                                    if(input.id === error.path)
                                    {
                                        return input;
                                    }
                                })

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
            const user = {};
            let errorNoticed = false;
            const inputElements = inputs();

            inputElements.forEach((input) => {
                if(input.classList.contains('error'))
                {
                    errorNoticed = true;
                } else {
                    user[input.id] = input.value;
                }
            });

            if(editorInput.current)
            {
                user.article_content = editorInput.current.getContent();
            }

            user.article_id = id;

            if(!errorNoticed && localStorage.getItem('sso_token'))
            {
                const ssoToken = localStorage.getItem('sso_token');
                // ask the backEnd
                fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/articles/edit", { 
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + ssoToken
                    },
                    mode: "cors",
                    dataType: 'json',
                    body: JSON.stringify(user),
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
                        if(response.responseStatus === 'articleUpdated')
                        {
                            navigate('/articles');
                        } else {
                            response.errors.forEach((error) => {
                                const result = inputElements.find((input) => {
                                    if(input.id === error.path)
                                    {
                                        return input;
                                    }
                                })

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

AddArticle.propTypes = {
    type: PropType.string
}

export default AddArticle