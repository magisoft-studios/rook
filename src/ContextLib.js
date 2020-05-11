import { createContext } from "react";
import Session from "./Session";

export const AppContext = createContext( {
    session: new Session()
});

