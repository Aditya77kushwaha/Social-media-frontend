import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Modal from "react-modal";
import { Close } from "@material-ui/icons";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [userLiked, setUserLiked] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
    post.likes.map(async (x) => {
      await axios.get(`/users?userId=${x}`).then((res) => {
        setUserLiked((prev) => [
          ...prev,
          [res?.data?.username, res?.data?.profilePicture],
        ]);
      });
    });
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    window.location.reload();
  };

  // let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span
              className="postLikeCounter"
              onClick={() => {
                !modalIsOpen ? openModal() : closeModal();
              }}
            >
              {like} people like it
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        openModal={openModal}
        style={customStyles}
        // className="modal"
      >
        <div className="modal">
          <div className="header">
            Users who liked this post
            <div
              className="close-modal"
              onClick={() => {
                closeModal();
              }}
            >
              <Close />
            </div>
          </div>
          <hr />
          <ul className="users-liked">
            {userLiked.map((x, i) => {
              return (
                <>
                  <Link to={`/profile/${x[0]}`} className="user-liked">
                    <img
                      className="postProfileImg"
                      src={
                        x[1]
                          ? PF + user.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                      alt=""
                    />
                    <li key={i}>{x}</li>
                  </Link>
                </>
              );
            })}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
