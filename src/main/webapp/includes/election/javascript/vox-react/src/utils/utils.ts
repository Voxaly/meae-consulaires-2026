/**
 * Copyright 2025 Voxaly Docaposte
 */

import DOMPurify from 'dompurify';

/**
 * VOXSA-2794 (VUL06) — Balises et attributs légitimement utilisés dans election-textes.properties
 * (mise en forme simple : liens, listes, gras/italique...). Toute balise/attribut hors de cette
 * liste blanche est neutralisé par DOMPurify avant affichage via dangerouslySetInnerHTML.
 */
const TEXTES_ALLOWED_TAGS = ['a', 'b', 'strong', 'i', 'span', 'div', 'p', 'br', 'ul', 'li', 'address'];
const TEXTES_ALLOWED_ATTR = ['class', 'href', 'target', 'rel', 'title'];

/**
 * Sanitise un texte issu de election-textes.properties avant affichage HTML (dangerouslySetInnerHTML).
 * VOXSA-2794 (VUL06) : empêche l'injection de code JavaScript (script, gestionnaires d'événements,
 * URI javascript:, etc.) tout en préservant la mise en forme légitime des textes.
 */
export const sanitizeText = (value: string): string =>
    DOMPurify.sanitize(value, {ALLOWED_TAGS: TEXTES_ALLOWED_TAGS, ALLOWED_ATTR: TEXTES_ALLOWED_ATTR});

/**
 * Méthode permettant d'afficher le contenu d'une clé de texte (election-textes.properties)
 * @param key
 * @param textes
 * @param args
 */
export const getText = (key: string, textes?: Record<string, string>, args?: (string | number | undefined)[]): string => {
    if (!textes || !textes[key]) return key;
    const raw = !args ? textes[key] : textes[key].replace(/\{(\w)\}/g, (m, key) => '' + (args[+key] ?? key));
    return sanitizeText(raw);
}

export function navigatorInfos() {
    const infos = [
        (navigator.cookieEnabled ? "cookie" : "nocookie"),
        (navigator.javaEnabled() ? "java" : "nojava"),
        navigator.appCodeName,
        navigator.appName,
        navigator.appVersion,
        navigator.platform,
        navigator.language,
        navigator.userAgent,
    ];
    return infos.join('|').replace(/;/g, ',');
}

export const scrollToTop = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
}

export const deleteLastCharIfDot = (str: string): string => {
    return str.slice(-1) === "." ? str.substring(0, str.length - 1) : str;
}