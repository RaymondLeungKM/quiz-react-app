import React from "react";

const UserContext = React.createContext({
    user: {},
    login: () => {},
    logout: () => {}
});

export default UserContext;