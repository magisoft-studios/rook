import { useContext, createContext } from "react";

export const AppContext = createContext( {
    sessionInfo: {
        isLoggedIn: false,
        token: "",
        playerId: "",
        playerName: "",
    }
});

export function useAppContext() {
    return useContext(AppContext);
}
