import React, {FunctionComponent, useState} from 'react';
import {NaspiComFormProps} from '../../@types/forms';
import validateNaspiForm from './_validator';
import axios from 'axios';
import NaspiThankYouMessage from './_thank_you_message';
import {useParams} from "react-router";
import NaspiComForm from "./_form";
import {GRADIENT_BACKGROUND} from "../../contants/common";

const CreateNaspiCom: FunctionComponent = () => {

    const {id} = useParams();

    const [errors, setErrors] = useState<object>({});
    const [naspicom, setNaspicom] = useState<NaspiComFormProps>({});
    const [formSubmitted, setFormSubmitted] = useState<number>(0);

    return <section className='naspi-area ptb-100' style={GRADIENT_BACKGROUND}>
        {formSubmitted == 0 && <>
            <div className='col-md-6 mx-auto user-area'>
                <div className='user-form-content register-width'>
                    <h3>Nuova pratica Naspi Com</h3>
                    <form className='user-form  mx-auto'>
                        <NaspiComForm data={naspicom}
                                      onDataChange={(data: object) => {
                                          setNaspicom(Object.assign({}, naspicom, data));
                                      }}
                                      errors={errors}/>
                        <div className='row text-center'>
                            {Object.keys(errors).length > 0 && <div className='col-md-6 mx-auto'>
                                Pratica non valida, sono stati riscontrati i seguenti errori:
                                <ul className='text-left'>
                                    {
                                        Object.values(errors).map(error => <li
                                            dangerouslySetInnerHTML={{__html: error}}/>)
                                    }
                                </ul>
                            </div>}
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button
                                    type="button"
                                    className='default-btn default-success'
                                    onClick={() => {
                                        const _e = validateNaspiForm(naspicom);
                                        if (Object.keys(_e).length) {
                                            console.log(_e);
                                            setErrors(_e);
                                            return;
                                        }
                                        axios.post(`${process.env.API_URL}/naspi/add-variation?id=${id}`, naspicom).then((response) => {
                                            if (response.data.data == 'Successo') {
                                                setFormSubmitted(1);
                                            }
                                        }).catch((err) => {
                                            let api_erorrs = err.response.data.data;
                                            console.log(api_erorrs);
                                        });
                                    }}
                                >
                                    SALVA
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>}
        {formSubmitted == 1 && <NaspiThankYouMessage/>}
    </section>
};

export default CreateNaspiCom;
