import React from "react";
import VoxMain from "../components/VoxMain";
import { getText } from "../utils/utils";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useGetAccessibilite } from "../hooks/useAccessibilite";

const Accessibilite = () => {
    const { data, isLoading } = useGetAccessibilite();
    const textes = data?.textes;

    const HtmlText = ({ textKey, textes }: { textKey: string; textes: any }) => {
        const content = getText(textKey, textes);
        return <span dangerouslySetInnerHTML={{ __html: content }} />;
    };

    useDocumentTitle(getText('accessibilite.titre-onglet', textes));

    if (isLoading) return null;

    return (
        <VoxMain type="docs">
            <h1>{getText("accessibilite.titre", textes)}</h1>

            {/* INTRODUCTION */}
            <p className="fr-mt-6w"><HtmlText textKey="accessibilite.intro.texte1" textes={textes} /></p>
            <p><HtmlText textKey="accessibilite.intro.texte2" textes={textes} /></p>

            {/* BLOC 1 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc1.titre", textes)}</h2>
            <p><HtmlText textKey="accessibilite.bloc1.texte1" textes={textes} /></p>

            {/* BLOC 2 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc2.titre", textes)}</h2>
            <p><HtmlText textKey="accessibilite.bloc2.texte1" textes={textes} /></p>
            <p><HtmlText textKey="accessibilite.bloc2.texte2" textes={textes} /></p>
            <ul><HtmlText textKey="accessibilite.bloc2.texte3.liste" textes={textes} /></ul>

            {/* BLOC 3 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc3.titre", textes)}</h2>
            <p><HtmlText textKey="accessibilite.bloc3.texte1" textes={textes} /></p>
            <h3>{getText("accessibilite.bloc3.sous-titre1", textes)}</h3>
            <ol><HtmlText textKey="accessibilite.bloc3.texte2.liste" textes={textes} /></ol>

            {/* BLOC 4 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc4.titre", textes)}</h2>
            <p><HtmlText textKey="accessibilite.bloc4.texte1" textes={textes} /></p>
            <p><HtmlText textKey="accessibilite.bloc4.texte2" textes={textes} /></p>
            <ul><HtmlText textKey="accessibilite.bloc4.texte3.liste" textes={textes} /></ul>

            {/* BLOC 5 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc5.titre", textes)}</h2>
            <p><HtmlText textKey="accessibilite.bloc5.texte1" textes={textes} /></p>
            <ul><HtmlText textKey="accessibilite.bloc5.texte2.liste" textes={textes} /></ul>

            {/* BLOC 6 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc6.titre", textes)}</h2>
            <ul><HtmlText textKey="accessibilite.bloc6.texte1.liste" textes={textes} /></ul>

            {/* BLOC 7 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc7.titre", textes)}</h2>
            <ul><HtmlText textKey="accessibilite.bloc7.texte1.liste" textes={textes} /></ul>

            {/* BLOC 8 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc8.titre", textes)}</h2>
            <p><HtmlText textKey="accessibilite.bloc8.texte1" textes={textes} /></p>
            <p><HtmlText textKey="accessibilite.bloc8.texte2" textes={textes} /></p>
            <p><HtmlText textKey="accessibilite.bloc8.texte3" textes={textes} /></p>
            <ul><HtmlText textKey="accessibilite.bloc8.texte4.liste" textes={textes} /></ul>

            {/* BLOC 9 */}
            <h2 className="fr-mt-6w">{getText("accessibilite.bloc9.titre", textes)}</h2>
            <p><HtmlText textKey="accessibilite.bloc9.texte1" textes={textes} /></p>
            <ul><HtmlText textKey="accessibilite.bloc9.texte2.liste" textes={textes} /></ul>
        </VoxMain>
    );
};

export default Accessibilite;