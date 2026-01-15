export interface EtablissementLEC {
    idEtablissement: number;
    nomEtablissement: string;
}

export interface SelectionLecData {
    listeEtablissements: EtablissementLEC[];
    textes: Record<string, string>;
}