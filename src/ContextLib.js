import { useContext, createContext } from "react";

export const AppContext = createContext( {
    sessionInfo: {
        isLoggedIn: false,
        token: "",
        playerId: ""
    }
});

export function useAppContext() {
    return useContext(AppContext);
}
