export interface LoginModel {
    Username: string;
    Password: string;
}

export interface LoginTicket {
    Username: string;
    Menus: Menu[];
    Functions: Function[];
    LoginResult: string;
    Bearer: string;
}

export interface Menu {
}

export interface Function {
}
