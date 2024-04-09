/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import '../style/articles.css'
import ArticleItem from "./items/articleItem";

function Articles()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [articles, setArticles] = useState(null);

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
            fetch("http://localhost:3000/sso/admin/articles", {                
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
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, [userObject])

    let articleContent = <div className="article-prompt">Loading articles...</div>;

    if(articles)
    {
        if(articles.length > 0)
        {
            articleContent = articles.map((art) => <ArticleItem key={art._id} article={art} articlesState={articles} updateArticles={setArticles} userInstance={userObject} />)
        } else {
            articleContent = <div className="article-prompt">There are no articles right now</div>;
        }
    }

    return <>
        <div className="articles-container">
            <div className="articles-title">Articles</div>
            <div className="articles-add">
                <button type="button" onClick={() => { navigate('/articles/add') }}>Post new article</button>
            </div>
            <div className="articles-box">
                <div className="articles-box-title">Recent Articles</div>
                <div className="articles-list">
                    <div className="articles-item article-information">
                        <div className="recent-articles-date">Date & Time</div>
                        <div className="recent-articles-image"></div>
                        <div className="recent-articles-title">Article</div>
                        <div className="recent-articles-author">Author</div>
                        <div className="recent-articles-status">Status</div>
                        <div className="recent-articles-menu"></div>
                    </div>
                    {articleContent}
                </div>
            </div>
        </div>
    </>;
}

export default Articles