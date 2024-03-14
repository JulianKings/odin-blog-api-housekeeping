/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import '../style/settings.css'

function Settings()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [articles, setArticles] = useState(null);
    const [settings, setSettings] = useState(null);
    const selectInput = useRef(null);

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
            fetch("http://localhost:3000/sso/admin/settings", {                
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
                    setArticles(response.articles);
                    setSettings(response.settings);
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, [userObject]);

    let articleContent = <option selected value='default'>Loading articles...</option>;
    let selectValue = 'default';

    if(articles && settings)
    {
        if(articles.length > 0)
        {
            articleContent = articles.map((article) => {
                if(article._id === settings.featured_article)
                {
                    selectValue = article._id;
                } 

                return <Fragment key={article._id}>
                    <option value={article._id}>{article.title}</option>
                </Fragment>
            })
        } else {
            articleContent = <option value='default'>None</option>;
        }
    }

    return <>
        <div className="settings-container">
            <div className="settings-title">Settings</div>
            <div className="settings-caption">Featured Article</div>
            <div className="settings-description">Please select an article for the &apos;featured&apos; section of the home page.</div>
            <div className="settings-selection">
                <form method="post" onSubmit={updateFeatured} >
                    <div className="settings-selection-input">
                        <label htmlFor='article_selection'>Select an article: </label>
                        <select ref={selectInput} defaultValue={selectValue} id='article_selection'>
                            {articleContent}
                        </select>
                    </div>
                    <div className="settings-selection-button">
                        <button type="submit">Update featured article</button>
                    </div>
                </form>
            </div>
        </div>
    </>;

    function updateFeatured(event)
    {
        event.preventDefault();
        if(settings && selectInput.current && localStorage.getItem('sso_token') &&
            selectInput.current.value)
        {
            const requestObject = {
                featured_article: selectInput.current.value,
                settings_id: settings._id
            }
            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("http://localhost:3000/sso/admin/settings/edit", { 
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
                    if(response.responseStatus === 'settingsUpdated')
                    {
                        navigate(0);
                    }
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }
}

export default Settings