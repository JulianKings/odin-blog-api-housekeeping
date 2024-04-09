import PropTypes from 'prop-types';
import '../../style/articleItem.css';
import { DateTime } from 'luxon';
import moreIcon from '../../assets/more.svg';
import { Link } from 'react-router-dom';

function ArticleItem({ article, articlesState, updateArticles, userInstance }) {

    let imageUrl = (article.imageUrl === '' ? '/src/assets/newspaper.webp' : article.imageUrl);
    //let articleUrl = '/article/' + article._id;
    const articleClass = 'recent-articles-status ' + article.status;

    let luxonDatetime = DateTime.fromISO(article.timestamp);
    const capitalizedStatus = article.status.charAt(0).toUpperCase() + article.status.slice(1);

    const editLink = '/articles/edit/' + article._id;
    const deleteLink = '/articles/delete/' + article._id;

    let configureContentBox = <div className='recent-articles-menu-box'>
        <div className='recent-articles-menu-box-container'>
            <div className='recent-articles-menu-box-item'>
                No actions available
            </div>
        </div>
    </div>;

    if(userInstance.role === 'administrator')
    {
        configureContentBox = <div className='recent-articles-menu-box'>
            <div className='recent-articles-menu-box-container'>
                <div className='recent-articles-menu-box-item'>
                    <Link onClick={attemptStatusUpdate} to='/articles'>{(article.status === 'active') ? 'Pending' : 'Approve'}</Link>
                </div>
                <div className='recent-articles-menu-box-item'>
                    <Link to={editLink}>Edit</Link>
                </div>
                <div className='recent-articles-menu-box-item'>
                    <Link to={deleteLink}>Delete</Link>
                </div>
            </div>
        </div>;
    } else if(userInstance.role === 'author' && userInstance._id === article.author._id)
    {
        configureContentBox = <div className='recent-articles-menu-box'>
            <div className='recent-articles-menu-box-container'>
                <div className='recent-articles-menu-box-item'>
                    <Link to={editLink}>Edit</Link>
                </div>
                <div className='recent-articles-menu-box-item'>
                    <Link to={deleteLink}>Delete</Link>
                </div>
            </div>
        </div>;
    }
    
    return <>
        <hr className='article-separator' />
        <div className="recent-articles-item article-item">
            <div className="recent-articles-date">{luxonDatetime.toFormat('LLL dd')} at {luxonDatetime.toFormat("hh':'mm a")}</div>
            <div className="recent-articles-image"><img src={imageUrl} /></div>
            <div className="recent-articles-title">{article.title}</div>
            <div className="recent-articles-author">{article.author.first_name} {article.author.last_name}</div>
            <div className={articleClass}>{capitalizedStatus}</div>
            <div className="recent-articles-menu" tabIndex={0}>
                <img src={moreIcon} />

                {configureContentBox}
            </div>
        </div>
    </>;

    function attemptStatusUpdate(event)
    {
        event.preventDefault();
        if(updateArticles && localStorage.getItem('sso_token'))
        {
            const requestObject = {};
            requestObject.article_id = article._id;
            requestObject.article_status = article.status;

            const ssoToken = localStorage.getItem('sso_token');
            // ask the backEnd
            fetch("https://odin-blog-app-904858222abf.herokuapp.com/sso/admin/articles/update_status", { 
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
                    if(response.responseStatus === 'articleStatusUpdated')
                    {
                        const updatedArticle = response.updatedResult;
                        const oldArray = articlesState.filter((art) => art._id !== article._id);
                        const updatedArray = [updatedArticle].concat(oldArray);
                        updateArticles(updatedArray);
                    } 
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }
}

ArticleItem.propTypes = {
    article: PropTypes.object,
    articlesState: PropTypes.array,
    updateArticles: PropTypes.func,
    userInstance: PropTypes.object
}

export default ArticleItem