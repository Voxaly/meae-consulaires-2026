import VoxMain from "../components/VoxMain";
import {getText} from "../utils/utils";
import {ChangeEvent, FormEvent, useState} from "react";
import {useGetSelectionLEC, usePostSelectionLEC} from "../hooks/useSelectionLEC";
import VoxAutocomplete from "../components/VoxAutocomplete/VoxAutocomplete";
import {EtablissementLEC} from "../models/pages/selectionLec.model";
import Button from "@codegouvfr/react-dsfr/Button";
import {errorHandler} from "../utils/error.util";
import {useNavigate} from "react-router-dom";
import {URL_CHOIX_ELECTION, URL_ERREUR} from "../config/const";
import {useGlobal} from "../hooks/useGlobal";
import useDocumentTitle from "../hooks/useDocumentTitle";

const SelectionLEC = () => {

    const navigate = useNavigate();

    const {globalData} = useGlobal();
    const {data, isLoading} = useGetSelectionLEC();

    const textes = data?.textes;

    useDocumentTitle(getText('selection-lec.titre-onglet', textes));

    // ----- FORMULAIRE ------ //

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [autocomplete, setAutocomplete] = useState<EtablissementLEC>({
        idEtablissement: 0,
        nomEtablissement: '',
    });

    const {mutate: postSelectionLEC, isPending} = usePostSelectionLEC({
        onError: (err) => {
            errorHandler(err, setErrors, {...data?.textes, ...globalData?.common.textes});
        },
        onSuccess: (data) => {
            if (data.data === "generic_vote") {
                navigate(URL_CHOIX_ELECTION);
            } else {
                navigate(URL_ERREUR);
            }
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        postSelectionLEC({
            form: {
                idEtablissement: autocomplete.idEtablissement,
                nomEtablissement: autocomplete.nomEtablissement,
            }
        })
    }

    // ----- AUTOCOMPLETE ------ //

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAutocomplete((prev) => ({...prev, nomEtablissement: value}));
        const hasMatch = data?.listeEtablissements.some(etab => etab.nomEtablissement.toLowerCase().includes(value.toLowerCase()));
        setIsDropdownOpen(hasMatch || false);
    }

    // ----- RENDER ------ //

    if (isLoading) return null;

    return (
        <VoxMain type={"colonne"}>
            <div className="fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v">
                <div className="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                    <div className="fr-col-12 fr-col-md-9 fr-col-lg-8">
                        <h1 className="fr-h4">
                            {getText('selection-lec.titre', textes)}
                        </h1>

                        <form onSubmit={(e) => handleSubmit(e)}>
                            <fieldset className="fr-fieldset fr-mb-0" aria-labelledby="lec-form-legend">
                                <div className="fr-fieldset__element">
                                    <VoxAutocomplete<EtablissementLEC>
                                        inputProps={{
                                            id: "nomEtablissement",
                                            errors,
                                            setErrors,
                                            texts: {
                                                label: getText('selection-lec.champ.label', textes),
                                                description: getText('selection-lec.champ.description', textes),
                                            },
                                            onChange: handleChange,
                                            nativeInputProps: {
                                                value: autocomplete.nomEtablissement,
                                                required: true,
                                                'aria-expanded': isDropdownOpen,
                                                autoComplete: 'off',
                                            }
                                        }}
                                        items={data?.listeEtablissements ?? []}
                                        renderedItems={(item) => item.nomEtablissement}
                                        onSelectItem={(item) => setAutocomplete({
                                            idEtablissement: item.idEtablissement,
                                            nomEtablissement: item.nomEtablissement,
                                        })}
                                        filterBy={(item) => item.nomEtablissement}
                                        isDropdownOpen={isDropdownOpen}
                                        setIsDropdownOpen={setIsDropdownOpen}
                                    />
                                </div>

                                {/* Bouton "Submit" */}
                                <div className="fr-fieldset__element">
                                    <ul className="fr-btns-group">
                                        <li>
                                            <Button
                                                id="submitBtn"
                                                className="fr-btn fr-mt-2v"
                                                disabled={isPending}
                                            >
                                                {getText('selection-lec.bouton', textes)}
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </VoxMain>
    );
};

export default SelectionLEC;