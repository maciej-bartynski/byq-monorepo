import { Auth0ContextInterface, Auth0Provider, Auth0ProviderOptions, User } from "@auth0/auth0-react";
import { AuthState } from "@auth0/auth0-react/dist/auth-state";
import { createContext, FC, useCallback, useEffect, useMemo, useState } from "react";

const isDev = process.env.NODE_ENV === 'development';

export const DevAuthContext = createContext<Auth0ContextInterface<User>>({} as Auth0ContextInterface<User>);

const DevAuth0Provider: FC<Auth0ProviderOptions> = ({ children, domain }) => {
    const [state, setState] = useState({
        error: undefined,
        isAuthenticated: false,
        isLoading: true,
        user: undefined,
    } as AuthState<User>);

    const getAccessTokenSilently = useCallback(async () => {
        return fetch(`${domain}/api/v2/access-token`)
            .then(response => response.text())
            .then(token => token)
    }, [domain])

    useEffect(() => {
        fetch(`${domain}/api/v2/me`)
            .then(response => response.json())
            .then(user => setState(state => ({ ...state, user })))
            .catch(error => setState(state => ({ ...state, error })))
    }, [setState, domain]);

    useEffect(() => {
        if (state.user && (state.isLoading || !state.isAuthenticated)) {
            setState(state => ({ ...state, isLoading: false, isAuthenticated: true }))
        }

        if (state.error && (state.isLoading || state.isAuthenticated)) {
            setState(state => ({ ...state, isLoading: false, isAuthenticated: false }))
        }
    }, [setState, state])

    const context = useMemo(() => {
        return ({
            ...state,
            getAccessTokenSilently,
            async getAccessTokenWithPopup() { },
            async getIdTokenClaims() { },
            async loginWithRedirect() { },
            async loginWithPopup() { },
            logout() { },
            async buildAuthorizeUrl() { },
            buildLogoutUrl() { },
            async handleRedirectCallback() { },
        } as any as Auth0ContextInterface<User>)
    }, [
        state,
        getAccessTokenSilently
    ])

    return (
        <DevAuthContext.Provider value={context}>
            {children}
        </DevAuthContext.Provider>
    )
}

export default DevAuth0Provider