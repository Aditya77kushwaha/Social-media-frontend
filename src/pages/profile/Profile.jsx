import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [coverfile, setcoverFile] = useState(null);
  const [profilefile, setprofileFile] = useState(null);

  const username = useParams().username;
  const submitHandler = async (e) => {
    e.preventDefault();
    const updateUser = {
      userId: user._id,
    };
    if (coverfile) {
      const data = new FormData();
      const fileName = Date.now() + coverfile.name;
      data.append("name", fileName);
      data.append("file", coverfile);
      updateUser.coverPicture = fileName;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axios.put(`/users/${user._id}`, updateUser);
      window.location.reload();
    } catch (err) {}
  };
  const submitHandler2 = async (e) => {
    e.preventDefault();
    const updateUser = {
      userId: user._id,
    };
    if (profilefile) {
      const data = new FormData();
      const fileName = Date.now() + profilefile.name;
      data.append("name", fileName);
      data.append("file", profilefile);
      updateUser.profilePicture = fileName;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axios.put(`/users/${user._id}`, updateUser);
      window.location.reload();
    } catch (err) {}
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {!coverfile ? (
                <img
                  className="profileCoverImg"
                  src={
                    user.coverPicture
                      ? PF + user.coverPicture
                      : PF + "person/cover.png"
                  }
                  alt=""
                />
              ) : (
                <img
                  className="profileCoverImg"
                  src={URL.createObjectURL(coverfile)}
                  alt=""
                />
              )}
              <form className="shareBottom" onSubmit={submitHandler}>
                <div className="shareOptions">
                  <label htmlFor="file" className="shareOption">
                    <span className="shareOptionText">Change Cover Image</span>
                    <input
                      // style={{ display: "none" }}
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setcoverFile(e.target.files[0])}
                    />
                  </label>
                </div>
                {coverfile && (
                  <button className="shareButton" type="submit">
                    Change Cover
                  </button>
                )}
              </form>

              {profilefile ? (
                <img
                  className="profileUserImg"
                  src={URL.createObjectURL(profilefile)}
                  alt=""
                />
              ) : (
                <img
                  className="profileUserImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
              )}
              <form className="shareBottom" onSubmit={submitHandler2}>
                <div className="shareOptions">
                  <label htmlFor="file" className="shareOption">
                    <span className="shareOptionText">
                      Change Profile Image
                    </span>
                    <input
                      // style={{ display: "none" }}
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setprofileFile(e.target.files[0])}
                    />
                  </label>
                </div>
                {profilefile && (
                  <button className="shareButton" type="submit">
                    Change Profile Image
                  </button>
                )}
              </form>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
