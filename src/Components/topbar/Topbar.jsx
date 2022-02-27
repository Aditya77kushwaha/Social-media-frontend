import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router";
import axios from "axios";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();
  const [query, setquery] = useState("");
  const [result, setresult] = useState("");

  const getResult = async () => {
    const res = await axios.get(`/users/?username=${query}`);
    setresult(res.data);
    console.log("result", result);
  };
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
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">1</span>
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
            {result && (
              <Link
                className="searchResultText"
                to={`/profile/${result.username}`}
              >
                <p>{result.username}</p>
              </Link>
            )}
          </div>
        </div>
        <div className="searchRight"></div>
      </div>
    </>
  );
}
