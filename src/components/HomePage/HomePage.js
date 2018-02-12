import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPosts } from "../../actions/actionCreators";

import Navbar from "../Navbar/Navbar";
import PostGrid from "./PostGrid";
import HeroImage from "./HeroImage";
import PostPreview from "./PostPreview";
import { invokeOpenApig } from "../../libs/awsLib";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  async componentDidMount() {
    try {
      const results = await this.posts();

      this.props.addPosts(results);
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  posts() {
    return invokeOpenApig({ path: "/posts" });
  }

  renderPosts = () => {
    // debugger;
    // console.debug(this.props.posts);
    return (
      <PostGrid sticky={this.props.sticky}>
        {this.props.posts.map((post, i) => (
          <PostPreview
            video={post.attachment}
            key={i}
            title={post.title}
            date={post.videoDate}
          />
        ))}
      </PostGrid>
    );
  };

  render() {
    return (
      <div>
        <HeroImage />
        <Navbar sticky={this.props.sticky} />
        {!this.state.isLoading && this.renderPosts()}
      </div>
    );
  }
}

HomePage.propTypes = {
  posts: PropTypes.array.isRequired,
  sticky: PropTypes.bool.isRequired
};

// connect to store
export default connect(
  state => ({
    posts: state.posts,
    sticky: state.sticky,
    isAuthenticated: state.isAuthenticated
  }),
  dispatch => ({
    addPosts: posts => dispatch(addPosts(posts))
  })
)(HomePage);
