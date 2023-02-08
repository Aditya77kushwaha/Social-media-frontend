import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
  ExitToAppOutlined,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router";
import axios from "axios";
import Modal from "react-modal";

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

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();
  const [query, setquery] = useState("");
  const [result, setresult] = useState("");
  
  const getResult = async () => {
    await axios
      .get(`/users/?username=${query}`)
      .then((res) => {
        setresult(res.data);
      })
      .catch((err) => {
        setresult("user not found");
        console.log("result", err);
      });
  };
  
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">Social Media</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <Search
              className="searchIcon"
              onClick={() => {
                setresult("");
                getResult();
              }}
            />
            <input
              placeholder="Search for friend, post or video"
              className="searchInput"
              value={query}
              onChange={(e) => {
                setquery(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <span className="topbarLink">Homepage</span>
            <span className="topbarLink">Timeline</span>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div>
            <div
              className="topbarIconItem"
              onClick={() => {
                history.push("/messenger");
              }}
            >
              <Chat />
              <span className="topbarIconBadge">2</span>
            </div>
            <div
              className="topbarIconItem"
              onClick={() => {
                !modalIsOpen ? openModal() : closeModal();
              }}
            >
              <Notifications />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <ExitToAppOutlined
                onClick={() => {
                  // localStorage.clear();
                  dispatch({ type: "LOGOUT", payload: user });
                }}
              />
            </div>
          </div>
          <Link to={`/profile/${user.username}`}>
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
              className="topbarImg"
            />
          </Link>
        </div>
      </div>
      <div className="results">
        <div className="searchLeft"></div>
        <div className="topbarCenter">
          <div className="searchResult">
            {result &&
              (result.username ? (
                <Link
                  className="searchResultText"
                  to={`/profile/${result.username}`}
                >
                  <p>{result.username}</p>
                </Link>
              ) : (
                <p>{result}</p>
              ))}
          </div>
        </div>
        <div className="searchRight"></div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        openModal={openModal}
        style={customStyles}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
      </Modal>
    </>
  );
}
