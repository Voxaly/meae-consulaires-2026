/**
 * Copyright 2025 Voxaly Docaposte
 */

/**
 * Codes d'erreur représentatifs côté navigateur pour le parcours électeur (SI VOTE).
 * Miroir front de com.a2a.election.erreur.CodeErreurElecteur côté serveur : un code unique
 * par cause permet de corréler le message affiché à l'électeur avec son origine exacte,
 * y compris pour les erreurs qui ne remontent jamais au serveur (chiffrement, signature
 * du bulletin côté navigateur).
 */
export enum CodeErreurElecteur {
    BULLETIN_CONSTRUCTION_MOTEUR_CRYPTO = "VOTE_ERR_0023",
    BULLETIN_CONSTRUCTION_CLE_SESSION = "VOTE_ERR_0024",
    BULLETIN_CONSTRUCTION_SIGNATURE = "VOTE_ERR_0025",
    BULLETIN_CONSTRUCTION_INCONNUE = "VOTE_ERR_0026",
}

/**
 * Logge l'erreur avec son code représentatif pour permettre la corrélation a posteriori,
 * même en l'absence de remontée serveur (cf. incident MEAE sur la construction du bulletin).
 */
export function logErreurElecteur(code: CodeErreurElecteur, error: unknown): void {
    // eslint-disable-next-line no-console
    console.error(`[${code}] erreur électeur`, error);
}
