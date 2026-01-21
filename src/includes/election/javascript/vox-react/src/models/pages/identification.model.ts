import {Error} from "../error.model";

export interface IdentificationData {
    textes: Record<string, string>;
    dateDebut: "string";
    dateFin: "string";
    tempsRestant: "string";
    oid: string;
    jsConfigCryptoTemoinJSON: string;
    temoin: string;
    error: Partial<Error>;
}

export interface IdentificationForm {
    autToken: string;
    login: string;
    password: string;
    defi: string;
    captchaId: string;
    captchaDefi: string;
    calendar: string;
    temoin: string;
    clientInfos: string;
    monologin: boolean;
    cookiesEnabled: boolean;
    javascriptEnabled: boolean;
}

export interface IdentificationFIN {
    success: boolean;
    message: string;
}