import React, { FunctionComponent, useState } from 'react';
import { NaspiAnticipataFormProps } from '../../@types/forms';
import validateNaspiAnticipataForm from './_validator';
import axios from 'axios';
import NaspiAnticipataFormDocument from './_form_document';
import NaspiAnticipataFormData from './_form_data';
import NaspiThankYouMessage from '../naspi/_thank_you_message';
import { GRADIENT_BACKGROUND } from '../../contants/common';

const CreateNaspiAnticipata: FunctionComponent = () => {
    const [errors, setErrors] = useState<object>({});
    const [naspi, setNaspiAnticipata] = useState<NaspiAnticipataFormProps>({ activity_type: 0, marital_status: 0 });
    const [step, setStep] = useState<number>(0);
    const [formSubmitted, setFormSubmitted] = useState<number>(0);

    function nextStep() {
        window.scrollTo(0, 0)
        setStep(step + 1)
    }

    function prevStep() {
        window.scrollTo(0, 0)
        setStep(step - 1)
    }

    if (formSubmitted) {
        return <section className='naspi-area ptb-100' style={GRADIENT_BACKGROUND}>
            <NaspiThankYouMessage />
        </section>
    }

    return <section className='naspi-area ptb-100'>
        <div className='container mx-auto user-area'>
            <div className='user-form-content register-width'>
                <h3>Nuova pratica Naspi Anticipata</h3>

                <form className='user-form'>

                    <div className="row">
                        {step == 0 && <NaspiAnticipataFormData
                            onDataChange={(data: object) => {
                                setNaspiAnticipata(Object.assign({}, naspi, data));
                                setErrors({})
                            }}
                            errors={errors}
                            data={naspi}
                        />}
                        {step == 1 && <NaspiAnticipataFormDocument
                            onDataChange={(data: object) => {
                                setNaspiAnticipata(Object.assign({}, naspi, data));
                                setErrors({})
                            }}
                            errors={errors}
                            data={naspi}
                        />}

                    </div>
                    {Object.keys(errors).length > 0 && <div className='col-md-6 mx-auto'>
                        Pratica non valida, sono stati riscontrati i seguenti errori:
                        <ul className='text-left'>
                            {
                                Object.values(errors).map(error => <li dangerouslySetInnerHTML={{ __html: error }} />)
                            }
                        </ul>
                    </div>}
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
                                        const _e = validateNaspiAnticipataForm(naspi);
                                        setErrors(_e);
                                        if (Object.keys(_e).length) {
                                            return;
                                        }
                                        axios.post(`${process.env.API_URL}/naspi/create`, naspi).then((response) => {
                                            console.log(response)
                                            if (response.data.data == 'Successo') {
                                                setFormSubmitted(1);
                                            }
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

export default CreateNaspiAnticipata;
