type ENV = {
    AUTH0_DOMAIN: string,
    AUTH0_CLIENTID: string,
    AUTH0_AUDIENCE: string,
    AUTH0_NODE_ENV: string,
}

class EnvService {
    private static _instance: EnvService | null = null;

    public static application: Function | null = null;

    public static env: ENV = {
        AUTH0_DOMAIN: "",
        AUTH0_CLIENTID: "",
        AUTH0_AUDIENCE: "",
        AUTH0_NODE_ENV: "",
    }

    private constructor() {
        const run = async () => {
            await this.hydrateEnv();
            if (EnvService.application) EnvService.application();
            else throw new Error(`EnvService: application is not defined.`);
        };
        run();
    }

    private async hydrateEnv() {
        return fetch('/env/env.json')
            .then(response => response.json())
            .then(data => {
                EnvService.env = data;
            })
            .catch(err => {
                throw new Error(`Failed to fetch ENV: ${err}`);
            })
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new EnvService();
            return this._instance;
        }
        return this._instance;
    }
}

export default EnvService;