import PropTypes from 'prop-types';
import '../../style/commentItem.css';
import { DateTime } from 'luxon';
import moreIcon from '../../assets/more.svg';

function CommentItem({ comment }) {

    let commentMessage = '';
    if(comment.message.length > 40)
    {
        commentMessage = comment.message(0, 40) + "...";
    } else {
        commentMessage = comment.message;
    }

    let parsedCommentMessage = (new DOMParser()).parseFromString(commentMessage, "text/html").documentElement.textContent;

    let luxonDatetime = DateTime.fromISO(comment.timestamp);

    return <>
        <hr className='comment-separator' />
        <div className="recent-comments-item comment-item">
            <div className="recent-comments-date">{luxonDatetime.toFormat('LLL dd')} at {luxonDatetime.toFormat("hh':'mm a")}</div>
            <div className="recent-comments-content">{parsedCommentMessage}</div>
            <div className="recent-comments-author">{comment.author.first_name} {comment.author.last_name}</div>
            <div className="recent-comments-menu"><img src={moreIcon} /></div>
        </div>
    </>
}

CommentItem.propTypes = {
    comment: PropTypes.object
}

export default CommentItem