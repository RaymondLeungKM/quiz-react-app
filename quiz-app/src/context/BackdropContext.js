import React from "react";

const BackdropContext = React.createContext({
    visible: false,
    show: () => {},
    hide: () => {}
});

export default BackdropContext;