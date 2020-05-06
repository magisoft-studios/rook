import { useContext, createContext } from "react";

export const AppContext = createContext( {
    sessionInfo: {
        isLoggedIn: false,
        sessionId: "",
        playerId: "",
        playerName: "",
    }
});

export function useAppContext() {
    return useContext(AppContext);
}
