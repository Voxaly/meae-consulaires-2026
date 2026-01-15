import {Dispatch, SetStateAction} from "react";
import {AxiosError} from "axios";
import {Error} from "../models/error.model";
import {getText, scrollToTop} from "./utils";

export const errorHandler = (
    error: AxiosError<{ errors: Error[] }>,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
    textes: Record<string, string>,
) => {
    setErrors({});

    const errors = error?.response?.data.errors || [];

    errors.forEach((err: Error) => {
        setErrors({
            [err.field]: getText(err.message, textes, err.args ?? [])
        })
    })

    if (errors.some(element => element.field === "global")) {
        // On remonte en haut de page en cas d'erreur globale
        scrollToTop();
    } else {
        // On focus le 1er champ en erreur (RGAA)
        const targetedFieldId = errors[0].field || '';
        document.getElementById(targetedFieldId)?.focus();
    }
};