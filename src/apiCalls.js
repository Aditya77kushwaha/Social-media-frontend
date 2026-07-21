import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  const API = process.env.REACT_APP_API || "http://localhost:8800/api/";

  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${API}/auth/login`, userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
    // if (error.response && error.response.status === 401) {
    //   setErrorMessage(error.response.data.error);
    // } else {
    //   console.error("Error from server :", error.message);
    // }
  }
};
