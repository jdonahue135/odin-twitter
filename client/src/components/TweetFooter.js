import React from "react";
import { renderGraphic } from "../helpers";
import { graphics } from "../constants";

class TweetFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //tracking status and counts so page updates immediately onClick
      likeStatus: false,
      likeCount: null,
      retweetStatus: false,
      retweetCount: null,
      //don't need to track replyStatus
      replyCount: null,
    };
  }

  componentDidMount() {
    const likeStatus = this.props.tweet.likes.includes(
      this.props.currentUser._id
    )
      ? true
      : false;
    const retweetStatus = this.props.tweet.retweets.includes(
      this.props.currentUser._id
    )
      ? true
      : false;

    this.setState({
      likeStatus: likeStatus,
      retweetStatus: retweetStatus,
      likeCount: this.props.tweet.likes.length,
      retweetCount: this.props.tweet.retweets.length,
      replyCount: this.props.tweet.replies.length,
    });
  }
  handleLikeClick() {
    this.props.onLike(this.props.tweet._id);
    const likeCount = this.state.likeStatus
      ? this.state.likeCount - 1
      : this.state.likeCount + 1;
    this.setState({
      likeStatus: !this.state.likeStatus,
      likeCount: likeCount,
    });
  }

  handleRetweetClick() {
    const retweetCount = this.state.retweetStatus
      ? this.state.retweetCount - 1
      : this.state.retweetCount + 1;
    this.setState({
      retweetStatus: !this.state.retweetStatus,
      retweetCount: retweetCount,
    });
    this.props.onRetweet(this.props.tweet._id);
  }

  handleReplyClick() {
    this.setState({ replyCount: this.state.replyCount + 1 });
    this.props.onReply(this.props.tweet);
  }

  renderTweetGraphic(name) {
    const selected = this.state[name + "Status"] ? true : false;
    const functionString =
      "handle" + name[0].toUpperCase() + name.slice(1) + "Click";
    return (
      <div className="tweet-graphic-item">
        {renderGraphic(
          graphics[name.toUpperCase()],
          selected,
          this[functionString].bind(this)
        )}

        {this.state[name + "Count"] > 0 ? (
          <div className={"tweet-footer-count " + name + "-count"}>
            {this.state[name + "Count"]}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    return (
      <div className="tweet-footer">
        {this.renderTweetGraphic("reply")}
        {this.renderTweetGraphic("retweet")}
        {this.renderTweetGraphic("like")}
        <div className="tweet-graphic-item">
          {renderGraphic(graphics.SHARE)}
        </div>
      </div>
    );
  }
}

export default TweetFooter;
