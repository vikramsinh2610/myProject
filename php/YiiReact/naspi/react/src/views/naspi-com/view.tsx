import React, { FunctionComponent, useState, } from 'react';
import { NaspiFormProps } from '../../@types/forms';
import NaspiForm from './_form';
import validateNaspiForm from './_validator';
import Loader from '../../components/Loader';
import { useParams } from "react-router";

const ViewNaspi: FunctionComponent = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<object>({});
    const [naspi, setNaspi] = useState<NaspiFormProps>({
        marital_status: 0,
    });
    const [showAllSubscription, setShowAllSubscription] = useState(false);
    const [showSubscription, setShowSubscription] = useState(false);

    // useEffect(() => {
    //     axios.get(`${process.env.API_URL}/naspi/${naspiId}/view`)
    //         .then(response => {
    //             setLoading(false)
    //         })
    // }, [])

    if (loading) {
        return <Loader />
    }

    return <section className='naspi-area ptb-100'>
        <div className='container'>
            <h3 className='pull-left'>Form</h3>

            <NaspiForm
                onDataChange={(data: object) => {
                    setNaspi(Object.assign({}, naspi, data));
                }}
                errors={errors}
                data={naspi}
            />
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                onClick={() => {
                    const _e = validateNaspiForm(naspi);
                    if (Object.keys(_e).length) {
                        console.log(_e)
                        setErrors(_e);
                        return;
                    }
                }}
            >
                SALVA
            </button>
        </div>
    </section>
};

export default ViewNaspi;
