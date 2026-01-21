import {APIInstances, PREFIX_API} from "./config";
import {EtablissementLEC, SelectionLecData} from "../models/pages/selectionLec.model";
import axios, {AxiosResponse} from "axios";

const URL_API = PREFIX_API + APIInstances.SELECTION_LEC;

export const getDataSelectionLEC = (): Promise<AxiosResponse<SelectionLecData>> => {
    return axios.get(`${URL_API}/data`);
};

export const postSelectionLEC = async (form: EtablissementLEC): Promise<AxiosResponse<string>> => {
    return axios.post(URL_API, form);
};
