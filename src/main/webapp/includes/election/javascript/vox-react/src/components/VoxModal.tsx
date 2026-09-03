/**
 * Copyright 2025 Voxaly Docaposte
 */

import {ReactNode, useEffect} from "react";
import {createModal} from "@codegouvfr/react-dsfr/Modal";
import {ModalProps as ModalComponentProps} from "@codegouvfr/react-dsfr/Modal/Modal";
import {getText} from "../utils/utils";
import {useGlobal} from "../hooks/useGlobal";
import {ELECTION_STORAGE_KEY} from "../contexts/ElectionContext";

interface DSFRModalProps {
    id: string;
    isOpenedByDefault: boolean;
    open: () => void;
    close: () => void;
    Component: (props: ModalComponentProps) => ReactNode;
}

interface VoxModalProps {
    modalParams: ReturnType<typeof createModal>; // Utiliser les objets "logoutModal" ou "timeoutModal" en bas de ce fichier
    title: ModalComponentProps['title'];
    icon?: ModalComponentProps['iconId'];
    buttons?: ModalComponentProps['buttons'];
    children: ModalComponentProps['children'];
}

const VoxModal = (props: VoxModalProps) => {
    const {modalParams, title, icon, buttons, children} = props;

    return (
        <modalParams.Component title={title} iconId={icon} buttons={buttons}>
            {children}
        </modalParams.Component>
    );
};

interface VoxModalLogoutProps {
    /** Ouvre la modale dès son montage (cas du rafraîchissement pendant le délai de grâce) */
    openOnMount?: boolean;
}

export const VoxModalLogout = (props: VoxModalLogoutProps) => {
    const {openOnMount = false} = props;
    const {globalData} = useGlobal();

    // L'API DSFR instancie la modale de façon asynchrone après son montage dans le DOM :
    // appeler logoutModal.open() trop tôt plante (window.dsfr(element) vaut encore null).
    // On réessaie donc jusqu'à ce que l'instance DSFR soit disponible.
    useEffect(() => {
        if (!openOnMount) return;
        let cancelled = false;
        const tryOpen = () => {
            if (cancelled) return;
            const element = document.getElementById(logoutModal.id);
            const dsfrInstance = element && (window as any).dsfr?.(element);
            if (dsfrInstance?.modal) {
                dsfrInstance.modal.disclose();
            } else {
                window.setTimeout(tryOpen, 100);
            }
        };
        tryOpen();
        return () => {
            cancelled = true;
        };
    }, [openOnMount]);

    return (
        <VoxModal
            modalParams={logoutModal}
            title={getText('modale.deconnexion.titre', globalData?.header.textes)}
            buttons={[
                {
                    children: getText('modale.deconnexion.bouton.oui', globalData?.header.textes),
                    doClosesModal: true,
                    onClick: () => {
                        // sessionStorage survit à cette navigation complète (même onglet) : on
                        // purge l'élection mémorisée (VOXSA-2626) pour ne pas la retrouver lors
                        // d'une reconnexion ultérieure dans le même onglet.
                        sessionStorage.removeItem(ELECTION_STORAGE_KEY);
                        window.location.href = '/logout';
                    },
                },
                {
                    children: getText('modale.deconnexion.bouton.non', globalData?.header.textes),
                    doClosesModal: true,
                }
            ]}
        >
            <p>{getText('modale.deconnexion.description', globalData?.header.textes)}</p>
        </VoxModal>
    )
}


/**
 * Params de la modale de déconnexion
 */
export const logoutModal = createModal({
    id: "logout-modal",
    isOpenedByDefault: false,
});

/**
 * Params de la modale d'inactivité
 */
export const timeoutModal = createModal({
    id: "timeout-modal",
    isOpenedByDefault: false,
});

/**
 * Params de la modale de code de confirmation non reçu (page ConfirmationVote)
 */
export const activationCodeModal = createModal({
    id: "activation-code-modal",
    isOpenedByDefault: false,
})

export default VoxModal;