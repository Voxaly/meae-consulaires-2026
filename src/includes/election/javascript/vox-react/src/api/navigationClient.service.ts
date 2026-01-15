import axios, {AxiosResponse} from "axios";
import {APIInstances, PREFIX_API} from "./config";
import {CheckCodeActivationForm, NavigationClientData, SubmitVoteForm} from "../models/pages/navigationClient.model";

const URL_API = PREFIX_API + APIInstances.NAVIGATION_CLIENT;

export const getDataNavigationClient = async (idElection: number): Promise<AxiosResponse<NavigationClientData>> => {
    return axios.get(`${URL_API}/data`, {params: {idElection}});
};

export const postActivationCode = async (): Promise<AxiosResponse<"ok" | "ko">> => {
    return axios.post(`${PREFIX_API}/envoiCodeActivationVote`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
};

export const postCheckActivationCode = async (form: CheckCodeActivationForm): Promise<AxiosResponse<"OK" | "KO">> => {
    return axios.post(`${PREFIX_API}/controleCodeActivationVote`, form);
};

export const postVote = async (form: SubmitVoteForm): Promise<AxiosResponse<"accuse-reception">> => {
    return axios.post(`${URL_API}/vote`, form);
};