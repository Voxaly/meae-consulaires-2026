import {APIInstances, PREFIX_API} from "./config";
import axios, {AxiosResponse} from "axios";
import {CheckHashBallotError, RecepisseData} from "../models/pages/recepisse.model";

const URL_API = PREFIX_API + APIInstances.RECEPISSE;

export const getDataRecepisse = (): Promise<AxiosResponse<RecepisseData>> => {
    return axios.get(`${URL_API}/data`);
};

export const postCheckHashBallotError = (form: CheckHashBallotError): Promise<AxiosResponse<any>> => {
    return axios.post(`${PREFIX_API}/verification-hash-bulletin-erreur`, form);
};
