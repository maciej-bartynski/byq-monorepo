import { Auth0ContextInterface, useAuth0 as useProdAuth0, User } from "@auth0/auth0-react";
import { useContext, useMemo } from "react";
import EnvService from "services/EnvService";
import { DevAuthContext } from "./Auth0Provider";

const isDev = process.env.NODE_ENV === 'development';

const useDevAuth0 = (): Auth0ContextInterface<User> => {
    const {
        error,
        isAuthenticated,
        isLoading,
        user,
        getAccessTokenSilently,
        getAccessTokenWithPopup,
        getIdTokenClaims,
        loginWithRedirect,
        loginWithPopup,
        logout,
        buildAuthorizeUrl,
        buildLogoutUrl,
        handleRedirectCallback
    } = useContext(DevAuthContext);

    return useMemo(() => ({
        error,
        isAuthenticated,
        isLoading,
        user,
        getAccessTokenSilently,
        getAccessTokenWithPopup,
        getIdTokenClaims,
        loginWithRedirect,
        loginWithPopup,
        logout,
        buildAuthorizeUrl,
        buildLogoutUrl,
        handleRedirectCallback
    }), [
        error,
        isAuthenticated,
        isLoading,
        user,
        getAccessTokenSilently,
        getAccessTokenWithPopup,
        getIdTokenClaims,
        loginWithRedirect,
        loginWithPopup,
        logout,
        buildAuthorizeUrl,
        buildLogoutUrl,
        handleRedirectCallback
    ])
}

const useAuth0 = () => {
    const hook = EnvService.env.AUTH0_NODE_ENV === 'development'
        ? useDevAuth0
        : useProdAuth0;

    return hook()
}

export default useAuth0;
