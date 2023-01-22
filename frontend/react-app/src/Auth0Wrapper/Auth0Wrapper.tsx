import { FC, PropsWithChildren, useEffect, useState } from 'react';
import NotLogged from 'views/NotLogged';
import AuthLoading from 'views/AuthLoading';
import NoticesService from 'lib/services/notices/notices';
import { Auth0Context } from './AuthContext';
import DevAuth0Provider from './Auth0Provider';
import useAuth0 from './useAuth0';
import EnvService from 'services/EnvService';
import SessionStorageService from 'services/SessionStorageService';
import { SessionStorageField } from 'services/SessionStorageService/SessionStorageService';
import { Auth0Provider } from '@auth0/auth0-react';

type AuthConfig = {
    domain: string,
    clientId: string,
    audience: string,
}

const Auth0Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const authConfig: AuthConfig = {
        domain: EnvService.env.AUTH0_DOMAIN,
        clientId: EnvService.env.AUTH0_CLIENTID,
        audience: EnvService.env.AUTH0_AUDIENCE,
    }

    const ProviderComponent = EnvService.env.AUTH0_NODE_ENV === 'development'
        ? DevAuth0Provider
        : Auth0Provider

    return (
        <ProviderComponent
            domain={authConfig.domain}
            clientId={authConfig.clientId}
            redirectUri={window.location.origin}
            audience={authConfig.audience}
        >
            <Auth0StageTwo>
                {children}
            </Auth0StageTwo>
        </ProviderComponent>
    )
}

const Auth0StageTwo: FC<PropsWithChildren> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const auth0 = useAuth0();

    SessionStorageService.setItem(SessionStorageField.User, JSON.stringify(auth0.user || ""));
    const accessToken = SessionStorageService.getItem(SessionStorageField.AccessToken);

    useEffect(() => {
        async function fetchAccessToken() {
            try {
                const accessToken = await auth0.getAccessTokenSilently();
                if (accessToken) {
                    SessionStorageService.setItem(SessionStorageField.AccessToken, accessToken);
                } else {
                    NoticesService.newMessage('Failed to fetch access token.');
                }
            } catch (e) {
                NoticesService.newMessage(JSON.stringify(e));
            }
            setLoading(false);
        }
        fetchAccessToken();
    }, [auth0]);

    if (loading || auth0.isLoading) {
        return (<AuthLoading />);
    }

    if (!auth0.isAuthenticated || !auth0.user || !accessToken) {
        return (<NotLogged />);
    }

    return (
        <Auth0Context.Provider value={auth0}>
            {children}
        </Auth0Context.Provider>
    );
}

export default Auth0Wrapper
