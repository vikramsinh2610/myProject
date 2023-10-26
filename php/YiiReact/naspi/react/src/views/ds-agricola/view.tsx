import React, {FunctionComponent, useState,} from 'react';
import {DsAgricolaFormProps} from '../../@types/forms';
import DsAgricolaForm from './_form';
import validateDsAgricolaForm from './_validator';
import Loader from '../../components/Loader';
import {useParams} from "react-router";

const ViewDsAgricola: FunctionComponent = () => {

    const {id} = useParams();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<object>({});
    const [naspi, setDsAgricola] = useState<DsAgricolaFormProps>({
        marital_status: 0, payment_method: 0
    });
    const [showAllSubscription, setShowAllSubscription] = useState(false);
    const [showSubscription, setShowSubscription] = useState(false);

    // useEffect(() => {
    //     axios.get(`${process.env.API_URL}/DsAgricola/${id}/view`)
    //         .then(response => {
    //             setLoading(false)
    //         })
    // }, [])

    if (loading) {
        return <Loader/>
    }

    return <section className='naspi-area ptb-100'>
        <div className='container'>
            <h3 className='pull-left'>Form</h3>

            <DsAgricolaForm
                onDataChange={(data: object) => {
                    setDsAgricola(Object.assign({}, naspi, data));
                }}
                errors={errors}
                data={naspi}
            />
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                onClick={() => {
                    const _e = validateDsAgricolaForm(naspi);
                    setErrors(_e);
                    if (Object.keys(_e).length) {
                        return;
                    }
                }}
            >
                SALVA
            </button>
        </div>
    </section>
};

export default ViewDsAgricola;
