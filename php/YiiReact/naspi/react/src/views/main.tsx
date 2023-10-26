import React, {FunctionComponent, useEffect, useState,} from 'react';
import axios from 'axios';
import {Naspi, User} from '../@types/model';
import Loader from '../components/Loader';
import NaspiCard from "../components/NaspiCard";
import UserProfile from "../components/UserProfile";
import {GRADIENT_BACKGROUND} from "../contants/common";


const MainPage: FunctionComponent = () => {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<object>({});
    const [naspi, setNaspi] = useState<null | Naspi>(null);
    const [user, setUser] = useState<null | User>(null);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/user/me`)
            .then(response => {
                setLoading(false);
                setUser(response.data.data.user);
                if(!response.data.data.naspi || Array.isArray(response.data.data.naspi)){
                    setNaspi(null);
                } else {
                    setNaspi(response.data.data.naspi);
                }
            })
    }, [])

    if (loading) {
        return <Loader/>
    }

    return <section className='naspi-area ptb-100' style={GRADIENT_BACKGROUND}>
        <div className='container'>
            <div className='row'>
                <div className='col-md-4 mt-30'>
                    <UserProfile user={user}/>
                </div>
                <div className='col-md-8 mt-30'>
                    <NaspiCard naspi={naspi}/>
                </div>
            </div>
        </div>
    </section>

};

export default MainPage;
