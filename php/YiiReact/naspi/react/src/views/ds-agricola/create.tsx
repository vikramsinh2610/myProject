import React, { FunctionComponent, useState } from 'react';
import { DsAgricolaFormProps } from '../../@types/forms';
import validateDsAgricolaForm from './_validator';
import axios from 'axios';
import DsAgricolaFormDocument from './_form_document';
import DsAgricolaFormAddress from './_form_address';

const CreateDsAgricola: FunctionComponent = () => {
    const [errors, setErrors] = useState<object>({});
    const [dsAgricola, setDsAgricola] = useState<DsAgricolaFormProps>({ marital_status: 0, payment_method: 0 });
    const [step, setStep] = useState<number>(0);

    function nextStep() {
        setStep(step + 1)
    }

    function prevStep() {
        setStep(step - 1)
    }

    return <section className='ds-agricola-area ptb-100'>
        <div className='container mx-auto user-area'>
            <div className='user-form-content register-width'>
                <h3>Nuova pratica Ds Agricola</h3>

                <form className='user-form'>

                    <div className="row">
                        {step == 0 && <DsAgricolaFormAddress
                            onDataChange={(data: object) => {
                                setDsAgricola(Object.assign({}, dsAgricola, data));
                            }}
                            errors={errors}
                            data={dsAgricola}
                        />}
                        {step == 1 && <DsAgricolaFormDocument
                            onDataChange={(data: object) => {
                                setDsAgricola(Object.assign({}, dsAgricola, data));
                            }}
                            errors={errors}
                            data={dsAgricola}
                        />}

                    </div>
                    <div className='row text-center'>
                        {Object.keys(errors).length > 0 && <div className='col-md-6 mx-auto'>
                            Pratica non valida, sono stati riscontrati i seguenti errori:
                            <ul className='text-left'>
                                {
                                    Object.values(errors).map(error => <li dangerouslySetInnerHTML={{ __html: error }} />)
                                }
                            </ul>
                        </div>}
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <button
                                type="button"
                                className='default-btn'
                                disabled={step == 0}
                                onClick={() => prevStep()}
                            >
                                INDIETRO
                            </button>
                        </div>
                        <div className="col-md-6">
                            {step != 1 ?
                                <button
                                    type="button"
                                    className='default-btn'
                                    onClick={() => nextStep()}
                                >
                                    AVANTI
                                </button>
                                :
                                <button
                                    type="button"
                                    className='default-btn default-success'
                                    onClick={() => {
                                        const _e = validateDsAgricolaForm(dsAgricola);
                                        setErrors(_e);
                                        if (Object.keys(_e).length) {
                                            return;
                                        }
                                        axios.post(`${process.env.API_URL}/naspi/create`, dsAgricola).then((response) => {
                                            console.log(response)
                                        }).catch((err) => {
                                            let api_erorrs = err.response.data.data;
                                            if (api_erorrs.address) {
                                                api_erorrs['address[address]'] = api_erorrs.address[0];
                                            }
                                            if (api_erorrs.city) {
                                                api_erorrs['address[city]'] = api_erorrs.city[0];
                                            }
                                            if (api_erorrs.cap) {
                                                api_erorrs['address[cap]'] = api_erorrs.cap[0];
                                            }
                                            if (api_erorrs.province) {
                                                api_erorrs['address[province]'] = api_erorrs.province[0];
                                            }

                                            if (api_erorrs.home_address) {
                                                api_erorrs['home[address]'] = api_erorrs.home_address[0];
                                            }
                                            if (api_erorrs.home_city) {
                                                api_erorrs['home[city]'] = api_erorrs.home_city[0];
                                            }
                                            if (api_erorrs.home_cap) {
                                                api_erorrs['home[cap]'] = api_erorrs.home_cap[0];
                                            }
                                            if (api_erorrs.home_province) {
                                                api_erorrs['home[province]'] = api_erorrs.home_province[0];
                                            }

                                            setErrors(api_erorrs);
                                        });
                                    }}
                                >
                                    SALVA
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
};

export default CreateDsAgricola;
