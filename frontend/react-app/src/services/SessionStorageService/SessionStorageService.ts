export enum SessionStorageField {
    AccessToken = 'access_token',
    User = 'user',
}

type Storage = {
    [key in SessionStorageField]: string
}

class SessionStorageService {
    private static _instance: SessionStorageService | null = null;
    public static storage: Storage = {
        'access_token': "",
        'user': ""
    };
    private constructor(){}
    public static get instance() {
        if (!this._instance) {
            this._instance = new SessionStorageService();
            Object.keys(SessionStorageField).forEach((key) => {
                SessionStorageService.storage[key as SessionStorageField] = sessionStorage.getItem(key) || "";
            })
            return this._instance;
        }
        return this._instance;
    }
    static setItem(key: SessionStorageField, value: string){
        sessionStorage.setItem(key, value);
        SessionStorageService.storage[key] = value;
    }
    static getItem(key: SessionStorageField){
        return SessionStorageService.storage[key]
    }
    static removeItem(key: SessionStorageField){
        sessionStorage.removeItem(key)
        delete SessionStorageService.storage[key];
    }
}

export default SessionStorageService;