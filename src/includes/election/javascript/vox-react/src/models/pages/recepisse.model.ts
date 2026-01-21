import {ElectionCard} from "./choixElection.model";

export interface RecepisseData {
    textes: Record<string, string>;
    signatureElectronique: string;
    ordreEmargement: string;
    dateEmargement: string;
    timestampEmargement: number;
    afficheSaisieEmailPourAR: boolean;
    suiviElections: ElectionCard[];
    nbElectionsRestantes: number;
    electionsRestantes: boolean;
    cachetBulletin: string;
    cachetIconeBase64: string;
    clientIconeBase64: string;
    voteIconeBase64: string;
}

export interface CheckHashBallotError {
    hashClient: string,
    hashServer: string,
    dateErreur: string,
}