import React from "react";
import VoxMain from "../components/VoxMain";
import {getText} from "../utils/utils";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {useGetMentionsLegales} from "../hooks/useMentionsLegales";

const MentionsLegales = () => {

    const {data, isLoading} = useGetMentionsLegales();
    const textes = data?.textes;

    const HtmlText = ({ textKey, textes }: { textKey: string; textes: any }) => {
        const content = getText(textKey, textes);
        return <span dangerouslySetInnerHTML={{ __html: content }} />;
    };

    useDocumentTitle(getText('mentions-legales.titre-onglet', textes));

    if (isLoading) return null;

    return (
        <VoxMain type={"docs"}>
            <h1>{getText('mentions-legales.titre', textes)}</h1>

            {/* Bloc 1 */}
            <h2 className="fr-mt-6w"><HtmlText textKey="mentions-legales.bloc1.titre" textes={textes} /></h2>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc1.section1.titre" textes={textes} /></h3>
                <p><HtmlText textKey="mentions-legales.bloc1.section1.texte1" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section1.texte2" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section1.texte3" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section1.texte4" textes={textes} /></p>
            </div>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc1.section2.titre" textes={textes} /></h3>
                <p><HtmlText textKey="mentions-legales.bloc1.section2.texte1" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section2.texte2" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section2.texte3" textes={textes} /></p>
            </div>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc1.section3.titre" textes={textes} /></h3>
                <p><HtmlText textKey="mentions-legales.bloc1.section3.texte1" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section3.texte2" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section3.texte3" textes={textes} /></p>
            </div>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc1.section4.titre" textes={textes} /></h3>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte1" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte2" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte3" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc1.section4.sous-titre1" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte4" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc1.section4.sous-titre2" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte5" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte6" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte7" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc1.section4.texte8" textes={textes} /></p>
            </div>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc1.section5.titre" textes={textes} /></h3>
                <p><HtmlText textKey="mentions-legales.bloc1.section5.texte1" textes={textes} /></p>
            </div>
            {/* Bloc 2 */}
            <h2 className="fr-mt-6w"><HtmlText textKey="mentions-legales.bloc2.titre" textes={textes} /></h2>
            <div className="fr-mt-4w">
                <p><HtmlText textKey="mentions-legales.bloc2.intro.texte1" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.intro.texte2" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.intro.texte3" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.intro.texte4" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.intro.texte5" textes={textes} /></p>
            </div>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc2.section1.titre" textes={textes} /></h3>
                <h4><HtmlText textKey="mentions-legales.bloc2.section1.sous-titre1" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section1.texte1" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section1.sous-titre2" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section1.texte2" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section1.sous-titre3" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section1.texte3" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section1.sous-titre4" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section1.texte4" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section1.sous-titre5" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section1.texte5" textes={textes} /></p>
            </div>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc2.section2.titre" textes={textes} /></h3>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre1" textes={textes} /></h4>
                <h5><HtmlText textKey="mentions-legales.bloc2.section2.sous-sous-titre1" textes={textes} /></h5>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte1" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte2" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte3" textes={textes} /></p>
                <ul><HtmlText textKey="mentions-legales.bloc2.section2.texte4.liste" textes={textes} /></ul>
                <h5><HtmlText textKey="mentions-legales.bloc2.section2.sous-sous-titre2" textes={textes} /></h5>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte5" textes={textes} /></p>
                <ul><HtmlText textKey="mentions-legales.bloc2.section2.texte6.liste" textes={textes} /></ul>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte7" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre2" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte8" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre3" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte9" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte10" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte11" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte12" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte13" textes={textes} /></p>
                <ul><HtmlText textKey="mentions-legales.bloc2.section2.texte14.liste" textes={textes} /></ul>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte15" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte16" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte17" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre4" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte18" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre5" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte18" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte19" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte20" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte21" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte22" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte23" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte24" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte25" textes={textes} /></p>
                <ul><HtmlText textKey="mentions-legales.bloc2.section2.texte26.liste" textes={textes} /></ul>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte27" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte28" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte29" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte30" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre6" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte31" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre7" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte32" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte33" textes={textes} /></p>
                <ul><HtmlText textKey="mentions-legales.bloc2.section2.texte34.liste" textes={textes} /></ul>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte35" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre8" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte36" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section2.sous-titre9" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte37" textes={textes} /></p>
                <ul><HtmlText textKey="mentions-legales.bloc2.section2.texte38.liste" textes={textes} /></ul>
                <p><HtmlText textKey="mentions-legales.bloc2.section2.texte39" textes={textes} /></p>
            </div>
            <div className="fr-mt-4w">
                <h3><HtmlText textKey="mentions-legales.bloc2.section3.titre" textes={textes} /></h3>
                <p><HtmlText textKey="mentions-legales.bloc2.section3.texte1" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section3.texte2" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section3.texte3" textes={textes} /></p>
                <h4><HtmlText textKey="mentions-legales.bloc2.section3.sous-titre1" textes={textes} /></h4>
                <p><HtmlText textKey="mentions-legales.bloc2.section3.texte4" textes={textes} /></p>
                <p><HtmlText textKey="mentions-legales.bloc2.section3.texte5" textes={textes} /></p>
                <div className="fr-table fr-table--bordered">
                    <div className="fr-table__wrapper">
                        <div className="fr-table__container">
                            <div className="fr-table__content">
                                <table>
                                    <thead>
                                    <tr>
                                        <th scope="col"><HtmlText textKey="mentions-legales.tableau.cookies.entete.cellule1" textes={textes} /></th>
                                        <th scope="col"><HtmlText textKey="mentions-legales.tableau.cookies.entete.cellule2" textes={textes} /></th>
                                        <th scope="col"><HtmlText textKey="mentions-legales.tableau.cookies.entete.cellule3" textes={textes} /></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td><HtmlText textKey="mentions-legales.tableau.cookies.ligne1.cellule1" textes={textes} /></td>
                                        <td><HtmlText textKey="mentions-legales.tableau.cookies.ligne1.cellule2" textes={textes} /></td>
                                        <td><HtmlText textKey="mentions-legales.tableau.cookies.ligne1.cellule3" textes={textes} /></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VoxMain>
    )
}

export default MentionsLegales;