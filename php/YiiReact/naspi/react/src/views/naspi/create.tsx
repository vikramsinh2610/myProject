import React, { FunctionComponent, useState } from 'react';
import { NaspiFormProps } from '../../@types/forms';
import validateNaspiForm from './_validator';
import axios from 'axios';
import NaspiFormDocument from './_form_document';
import NaspiFormQuestion from './_form_question';
import NaspiFormAddress from './_form_address';
import NaspiThankYouMessage from './_thank_you_message';
import { GRADIENT_BACKGROUND } from "../../contants/common";

const CreateNaspi: FunctionComponent = () => {
    const [errors, setErrors] = useState<object>({});
    const [naspi, setNaspi] = useState<NaspiFormProps>({ p_iva_check: false, marital_status: 0, same_address: true });
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

    return <section className='naspi-area ptb-100' style={GRADIENT_BACKGROUND}>
        <div className='container mx-auto user-area'>
            <div className='user-form-content register-width'>
                <h3>Nuova pratica Naspi </h3>
                <form className='user-form'>
                    <div className="row">
                        {step == 0 && <NaspiFormAddress
                            onDataChange={(data: object) => {
                                setNaspi(Object.assign({}, naspi, data));
                                setErrors({})
                            }}
                            errors={errors}
                            data={naspi}
                        />}
                        {step == 1 && <NaspiFormQuestion
                            onDataChange={(data: object) => {
                                setNaspi(Object.assign({}, naspi, data));
                            }}
                            errors={errors}
                            data={naspi}
                        />}
                        {step == 2 && <NaspiFormDocument
                            onDataChange={(data: object) => {
                                setNaspi(Object.assign({}, naspi, data));
                            }}
                            errors={errors}
                            data={naspi}
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
                                {step != 2 ?
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
                                            const _e = validateNaspiForm(naspi);
                                            if (Object.keys(_e).length) {
                                                console.log(_e);
                                                setErrors(_e);
                                                return;
                                            }
                                            axios.post(`${process.env.API_URL}/naspi/create`, naspi).then((response) => {
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
                    </div>
                </form>
            </div>
        </div>
    </section>
};

export default CreateNaspi;
