import axios, {AxiosResponse} from "axios";
import {IdentificationData, IdentificationFIN, IdentificationForm} from "../models/pages/identification.model";
import {APIInstances, PREFIX_API} from "./config";

const URL_API = PREFIX_API + APIInstances.IDENTIFICATION;

export const getDataIdentification = (): Promise<AxiosResponse<IdentificationData>> => {
    return axios.get(`${URL_API}/data`);
};

export const postIdentificationForm = async (form: IdentificationForm): Promise<AxiosResponse<"generic_vote">> => {
    return axios.post(URL_API, form);
};

export const postIdentificationFIN = async (data: { pk: string }): Promise<AxiosResponse<IdentificationFIN>> => {
    return axios.post(`/pages/generatenonce`, data, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
};

export const getOpenIdConnectLoginURL = (): Promise<AxiosResponse<string>> => {
    return axios.get(`/pages/openid_connect_login`);
}