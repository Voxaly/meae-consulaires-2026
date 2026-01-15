import {Outlet} from "react-router-dom";
import VoxHeader from "./VoxHeader";
import VoxFooter from "./VoxFooter";
import {useGlobal} from "../hooks/useGlobal";
import AutoScrollToTop from "./AutoScrollToTop";
import VoxSkipLinks from "./VoxSkipLinks";

/**
 * Layout pour les pages de documentation (Mentions légales, Accessibilité, Données personnelles)
 * Ces pages doivent être accessibles indépendamment de l'état du scrutin
 */
const DocumentationLayout = () => {
    const {globalData, isLoading} = useGlobal();

    if (isLoading || !globalData) return null;

    return (
        <>
            <AutoScrollToTop/>
            <VoxSkipLinks/>
            <div className="vox-flex-wrapper">
                <VoxHeader/>
                <Outlet/>
                <VoxFooter textes={globalData.footer.textes}/>
            </div>
        </>
    );
};

export default DocumentationLayout;
