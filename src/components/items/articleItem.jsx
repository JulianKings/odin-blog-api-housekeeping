import PropTypes from 'prop-types';
import '../../style/articleItem.css';
import { DateTime } from 'luxon';
import moreIcon from '../../assets/more.svg';

function ArticleItem({ article }) {

    let imageUrl = (article.imageUrl === '' ? '/src/assets/newspaper.webp' : article.imageUrl);
    //let articleUrl = '/article/' + article._id;
    const articleClass = 'recent-articles-status ' + article.status;

    let luxonDatetime = DateTime.fromISO(article.timestamp);
    const capitalizedStatus = article.status.charAt(0).toUpperCase() + article.status.slice(1);

    return <>
        <hr className='article-separator' />
        <div className="recent-articles-item article-item">
            <div className="recent-articles-date">{luxonDatetime.toFormat('LLL dd')} at {luxonDatetime.toFormat("hh':'mm a")}</div>
            <div className="recent-articles-image"><img src={imageUrl} /></div>
            <div className="recent-articles-title">{article.title}</div>
            <div className="recent-articles-author">{article.author.first_name} {article.author.last_name}</div>
            <div className={articleClass}>{capitalizedStatus}</div>
            <div className="recent-articles-menu"><img src={moreIcon} /></div>
        </div>
    </>
}

ArticleItem.propTypes = {
    article: PropTypes.object
}

export default ArticleItem