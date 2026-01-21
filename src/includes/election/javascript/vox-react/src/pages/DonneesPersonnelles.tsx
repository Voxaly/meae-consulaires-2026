import React from "react";
import VoxMain from "../components/VoxMain";
import { getText } from "../utils/utils";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useGetDonneesPersonnelles } from "../hooks/useDonneesPersonnelles";

const DonneesPersonnelles = () => {
    const { data, isLoading } = useGetDonneesPersonnelles();
    const textes = data?.textes;

    const HtmlText = ({ textKey, textes }: { textKey: string; textes: any }) => {
        const content = getText(textKey, textes);
        return <span dangerouslySetInnerHTML={{ __html: content }} />;
    };

    useDocumentTitle(getText('donnees-perso.titre-onglet', textes));

    if (isLoading) return null;

    return (
        <VoxMain type="docs">
            <h1>{getText("donnees-perso.titre", textes)}</h1>

            {/* BLOC 1 */}
            <h2 className="fr-mt-6w">{getText("donnees-perso.bloc1.titre", textes)}</h2>

            {/* BLOC 1 - INTRO */}
            <div className="fr-mt-4w">
                <p><HtmlText textKey="donnees-perso.bloc1.intro.texte1" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.intro.texte2" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.intro.texte3" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.intro.texte4" textes={textes} /></p>
                <ul><HtmlText textKey="donnees-perso.bloc1.intro.texte5.liste" textes={textes} /></ul>
            </div>

            {/* BLOC 1 - SECTION 1 */}
            <div className="fr-mt-4w">
                <h3>{getText("donnees-perso.bloc1.section1.titre", textes)}</h3>
                <h4>{getText("donnees-perso.bloc1.section1.sous-titre1", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section1.texte1" textes={textes} /></p>
                <h4>{getText("donnees-perso.bloc1.section1.sous-titre2", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section1.texte2" textes={textes} /></p>
                <h4>{getText("donnees-perso.bloc1.section1.sous-titre3", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section1.texte3" textes={textes} /></p>
            </div>

            {/* BLOC 1 - SECTION 2 */}
            <div className="fr-mt-4w">
                <h3>{getText("donnees-perso.bloc1.section2.titre", textes)}</h3>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.intro" textes={textes} /></p>
                <h4>{getText("donnees-perso.bloc1.section2.sous-titre1", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte1" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte2" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte3" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte4" textes={textes} /></p>
                <ul><HtmlText textKey="donnees-perso.bloc1.section2.texte5.liste" textes={textes} /></ul>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte6" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte7" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte8" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte9" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte10" textes={textes} /></p>
                <h4>{getText("donnees-perso.bloc1.section2.sous-titre2", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte11" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte12" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte13" textes={textes} /></p>
                {/* Tableau 1 */}
                <div className="fr-table fr-table--bordered">
                    <table>
                        <thead>
                        <tr>
                            <th>{getText("donnees-perso.bloc1.section2.tableau1.entete.cellule1", textes)}</th>
                            <th>{getText("donnees-perso.bloc1.section2.tableau1.entete.cellule2", textes)}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><HtmlText textKey="donnees-perso.bloc1.section2.tableau1.ligne1.cellule1" textes={textes} /></td>
                            <td><HtmlText textKey="donnees-perso.bloc1.section2.tableau1.ligne1.cellule2" textes={textes} /></td>
                        </tr>
                        <tr>
                            <td><HtmlText textKey="donnees-perso.bloc1.section2.tableau1.ligne2.cellule1" textes={textes} /></td>
                            <td><HtmlText textKey="donnees-perso.bloc1.section2.tableau1.ligne2.cellule2" textes={textes} /></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h4>{getText("donnees-perso.bloc1.section2.sous-titre3", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte14" textes={textes} /></p>
                <ul><HtmlText textKey="donnees-perso.bloc1.section2.texte15.liste" textes={textes} /></ul>
                <h4>{getText("donnees-perso.bloc1.section2.sous-titre4", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte16" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte17" textes={textes} /></p>
                <h4>{getText("donnees-perso.bloc1.section2.sous-titre5", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte18" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section2.texte19" textes={textes} /></p>
                {/* Tableau 2 */}
                <div className="fr-table fr-table--bordered">
                    <table>
                        <thead>
                        <tr>
                            <th>{getText("donnees-perso.bloc1.section2.tableau2.entete.cellule1", textes)}</th>
                            <th>{getText("donnees-perso.bloc1.section2.tableau2.entete.cellule2", textes)}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{getText("donnees-perso.bloc1.section2.tableau2.ligne1.cellule1", textes)}</td>
                            <td>{getText("donnees-perso.bloc1.section2.tableau2.ligne1.cellule2", textes)}</td>
                        </tr>
                        <tr>
                            <td>{getText("donnees-perso.bloc1.section2.tableau2.ligne2.cellule1", textes)}</td>
                            <td>{getText("donnees-perso.bloc1.section2.tableau2.ligne2.cellule2", textes)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BLOC 1 - SECTION 3 */}
            <div className="fr-mt-4w">
                <h3>{getText("donnees-perso.bloc1.section3.titre", textes)}</h3>
                <h4>{getText("donnees-perso.bloc1.section3.sous-titre1", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section3.texte1" textes={textes} /></p>
                <h4>{getText("donnees-perso.bloc1.section3.sous-titre2", textes)}</h4>
                <p><HtmlText textKey="donnees-perso.bloc1.section3.texte2" textes={textes} /></p>
                <ul><HtmlText textKey="donnees-perso.bloc1.section3.texte3.liste" textes={textes} /></ul>
                <p><HtmlText textKey="donnees-perso.bloc1.section3.texte4" textes={textes} /></p>
            </div>

            {/* BLOC 1 - SECTION 4 */}
            <div className="fr-mt-4w">
                <h3>{getText("donnees-perso.bloc1.section4.titre", textes)}</h3>
                <p><HtmlText textKey="donnees-perso.bloc1.section4.texte1" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section4.texte2" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc1.section4.texte3" textes={textes} /></p>
            </div>

            {/* BLOC 2 */}
            <div className="fr-mt-4w">
                <h2>{getText("donnees-perso.bloc2.titre", textes)}</h2>
                <p><HtmlText textKey="donnees-perso.bloc2.texte1" textes={textes} /></p>
                <p><HtmlText textKey="donnees-perso.bloc2.texte2" textes={textes} /></p>
                {/* Tableau 1 */}
                <div className="fr-table fr-table--bordered">
                    <table>
                        <thead>
                        <tr>
                            <th>{getText("donnees-perso.bloc2.tableau1.entete.cellule1", textes)}</th>
                            <th>{getText("donnees-perso.bloc2.tableau1.entete.cellule2", textes)}</th>
                            <th>{getText("donnees-perso.bloc2.tableau1.entete.cellule3", textes)}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{getText("donnees-perso.bloc2.tableau1.ligne1.cellule1", textes)}</td>
                            <td>{getText("donnees-perso.bloc2.tableau1.ligne1.cellule2", textes)}</td>
                            <td>{getText("donnees-perso.bloc2.tableau1.ligne1.cellule3", textes)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </VoxMain>
    );
};

export default DonneesPersonnelles;