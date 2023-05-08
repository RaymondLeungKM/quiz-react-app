import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./context/UserContext";

function Logout() {
  const navigate = useNavigate();
  const { user, logout: logoutUser } = useContext(UserContext);

  useEffect(() => {
    logoutUser();
    navigate("/");
  }, []);

  return <></>;
}

export default Logout;
