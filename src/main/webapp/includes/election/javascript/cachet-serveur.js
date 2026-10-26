/**
 * Copyright 2025 Voxaly Docaposte
 */

// VOXSA-1969 : externalisation des scripts inline de cachet_serveur.jsp.
// copyToClipboard() est exposée globalement (compatibilité si un onclick ou un autre
// script du bundle webpack l'invoque). Le scroll conditionnel lit l'attribut
// data-scroll-to-result (booléen serveur) plutôt que d'injecter la valeur en JS inline.
function copyToClipboard(keySelected) {
    var keyValue;
    if (keySelected === 'publicKey') {
        keyValue = $('#publicKey');
    } else {
        keyValue = $('#cachetElectronique');
    }

    if (typeof (keyValue) !== 'undefined') {
        keyValue.select();
        document.execCommand("copy");
    }
}
window.copyToClipboard = copyToClipboard;

$(document).ready(function () {
    var config = document.getElementById('cachet-serveur-config');
    var shouldScroll = config && config.dataset.scrollToResult === 'true';
    if (shouldScroll) {
        var scrollToElement = $("#resultatControleCachet");
        $(window).scrollTop(scrollToElement.offset().top);
    }
});
