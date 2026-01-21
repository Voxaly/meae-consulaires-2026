import {useNavigate} from 'react-router-dom'
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {URL_ERREUR} from "../config/const";
import {LoaderContext} from "../contexts/LoaderContext";

const AxiosInterceptor = ({children}: any) => {
    const navigate = useNavigate();
    const loader = useContext(LoaderContext);
    const [redirect, setRedirect] = useState("");

    // Fonction gérant les résultats de requêtes SANS erreurs
    const resInterceptor = (response: any) => {
        if (response.status === 302) {
            return Promise.reject("A redirection has been asked");
        } else {
            setRedirect("");
            return response;
        }
    };

    // Fonction gérant les résultats de requêtes AVEC erreurs
    const errInterceptor = (error: any) => {
        if (error.response.status === 303) {
            if (error.response.data.redirection) {
                setRedirect(error.response.data.redirection)
            }
        }
        // Gestion du 401 (blocage après 5 tentatives échouées)
        if (error.response.status === 401) {
            if (error.response.data.redirect) {
                setRedirect(error.response.data.redirect)
            }
        }
        if (error.response.status === 404 || error.response.status === 500) {
            setRedirect(URL_ERREUR);
        }
        return Promise.reject(error);
    };

    useEffect(() => {
        if (redirect !== "") {
            if (redirect.endsWith("erreur")) {
                navigate(URL_ERREUR);
            } else {
                navigate(redirect);
            }
        }
    }, [redirect, navigate]);

    axios.interceptors.response.use(resInterceptor, errInterceptor);

    axios.interceptors.request.use(
        function (successfulReq) {
            // All status between 200 and 302 are considered as ok
            successfulReq.validateStatus = (status) => status >= 200 && status <= 302;
            // On lance le loader lorsqu'une requête http GET est effectuée
            if (successfulReq.method === "get") loader.setLoading(true);
            return successfulReq;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    return children;
};

export default AxiosInterceptor;
