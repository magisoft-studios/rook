import { createContext } from "react";
import Session from "./Session";

let AppContext = createContext( {
    session: new Session(),
    mediaSettings: {
        videoSrc: "",
        audioSrc: "",
        audioDst: "",
    },
    updateMediaSettings: (mediaSettings) => {},
});

export default AppContext;

