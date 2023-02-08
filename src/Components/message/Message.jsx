import "./message.css";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Message({ message, own }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            user.profilePicture
              ? PF + user.profilePicture
              : "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          }
          alt=""
        />
        <p className="messageText">{message.text}
        {/* <small>{user._id}</small> */}
        </p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
