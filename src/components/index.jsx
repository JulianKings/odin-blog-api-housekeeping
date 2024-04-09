/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import '../style/index.css';
import articleIcon from '../assets/articles.svg';
import subscriptionIcon from '../assets/mail.svg';
import authorIcon from '../assets/feather.svg';
import ArticleItem from "./items/articleItem";
import CommentItem from "./items/commentItem";

function Index()
{
    const navigate = useNavigate();
    const [userObject] = useOutletContext();
    const [recentArticleList, setRecentArticleList] = useState(null);
    const [recentCommentList, setRecentCommentList] = useState(null);
    const [dashboardStat, setDashboardStat] = useState(null);

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
            fetch("http://localhost:3000/sso/admin/dashboard", {                
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
                    setRecentArticleList(response.articles);
                    setRecentCommentList(response.comments);

                    const informationObject = {};
                    informationObject.article_count = response.article_count;
                    informationObject.author_count = response.author_count;
                    informationObject.subscription_count = response.subscription_count;
                    setDashboardStat(informationObject);
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        }
    }, [userObject])

    let authorCount = '?';
    let articleCount = '?';
    let subscriptionCount = '?';

    if(dashboardStat && dashboardStat.article_count)
    {
        articleCount = dashboardStat.article_count;
    }

    if(dashboardStat && dashboardStat.author_count)
    {
        authorCount = dashboardStat.author_count;
    }

    if(dashboardStat && dashboardStat.subscription_count)
    {
        subscriptionCount = dashboardStat.subscription_count;
    }

    let articleContent = <div className="article-prompt">Loading articles...</div>;

    if(recentArticleList)
    {
        if(recentArticleList.length > 0)
        {
            articleContent = recentArticleList.map((art) => <ArticleItem key={art._id} article={art} userInstance={userObject} />)
        } else {
            articleContent = <div className="article-prompt">There are no articles right now</div>;
        }
    }

    let commentContent = <div className="comment-prompt">Loading comments...</div>;

    if(recentCommentList)
    {
        if(recentCommentList.length > 0)
        {
            commentContent = recentCommentList.map((com) => <CommentItem key={com._id} comment={com} />)
        } else {
            commentContent = <div className="comment-prompt">There are no comments right now</div>;
        }
    }

    return <>
        <div className="index-container">
            <div className="index-title">Dashboard</div>
            <div className="statistic-box">
                <div className="statistic-item">
                    <div className="statistic-image"><img src={articleIcon} /></div>
                    <div className="statistic-count">{articleCount}</div>
                    <div className="statistic-caption">Articles</div>
                </div>
                <div className="statistic-item">
                    <div className="statistic-image"><img src={subscriptionIcon} /></div>
                    <div className="statistic-count">{subscriptionCount}</div>
                    <div className="statistic-caption">Subscriptions</div>
                </div>
                <div className="statistic-item">
                    <div className="statistic-image"><img src={authorIcon} /></div>
                    <div className="statistic-count">{authorCount}</div>
                    <div className="statistic-caption">Authors</div>
                </div>
            </div>
            <div className="recent-articles-box">
                <div className="recent-articles-box-title">Recent Articles</div>
                <div className="recent-articles-list">
                    <div className="recent-articles-item recent-article-information">
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
            <div className="recent-comments-box">
                <div className="recent-comments-box-title">Recent Comments</div>
                <div className="recent-comments-list">
                    <div className="recent-comments-item recent-comments-information">
                        <div className="recent-comments-date">Date & Time</div>
                        <div className="recent-comments-content">Content</div>
                        <div className="recent-comments-author">Author</div>
                        <div className="recent-comments-menu"></div>
                    </div>
                    {commentContent}
                </div>
            </div>
        </div>
    </>;

}

export default Index;