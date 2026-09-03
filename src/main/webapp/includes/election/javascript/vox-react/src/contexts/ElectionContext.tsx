/**
 * Copyright 2025 Voxaly Docaposte
 */

import {createContext, ReactNode, useState} from "react";

interface Election {
    id: number;
    name: string;
}

interface ElectionContextProps {
    election: Election | null;
    setElection: (election: Election | null) => void;
}

export const ElectionContext = createContext<ElectionContextProps>({
    election: null,
    setElection: () => {
    },
});

// VOXSA-2626 : l'élection en cours n'était conservée qu'en mémoire (useState), donc perdue à
// chaque rafraîchissement de page (F5). TunnelDeVote/Recepisse détectaient alors une élection
// nulle et redirigeaient vers le choix d'élection, ramenant l'électeur à l'étape 1 quelle que
// soit l'étape où il se trouvait. Le sessionStorage survit au rafraîchissement (mais pas à la
// fermeture de l'onglet/session), ce qui permet de restaurer l'élection au remontage du contexte.
export const ELECTION_STORAGE_KEY = 'vox-election-en-cours';
const STORAGE_KEY = ELECTION_STORAGE_KEY;

const readElectionFromStorage = (): Election | null => {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const writeElectionToStorage = (election: Election | null): void => {
    try {
        if (election) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(election));
        } else {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // Stockage indisponible (navigation privée restrictive, quota...) : on continue sans
        // persistance, l'électeur reviendra simplement au choix d'élection en cas de F5.
    }
};

export const ElectionProvider = ({children}: { children: ReactNode }) => {
    const [election, setElectionState] = useState<Election | null>(readElectionFromStorage);

    const setElection = (election: Election | null) => {
        writeElectionToStorage(election);
        setElectionState(election);
    };

    return (
        <ElectionContext.Provider value={{election, setElection}}>
            {children}
        </ElectionContext.Provider>
    )
}