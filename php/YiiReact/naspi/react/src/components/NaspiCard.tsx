import React, { FunctionComponent } from 'react'
import { Naspi } from "../@types/model";
import { STATUS, TYPE } from '../contants/naspi';
import moment from 'moment';

type NaspiCardProps = {
    naspi: null | Naspi
}

const NaspiCard: FunctionComponent<NaspiCardProps> = ({ naspi }) => {

    return <>
        <h3 className='text-center'>Le tue pratiche Naspi</h3>

        {!naspi ?
            <div className='text-center my-8'>
                <p className='my-4'>NON HAI NESSUNA PRATICA APERTA - INSERISCILA ORA</p>
                <a className='default-btn mx-2' href='/naspi/nuova-domanda'>
                    <span>NASPI</span>
                </a>
                <a className='default-btn mx-2' href='/ds-agricola/nuova-domanda'>
                    <span>DS Agricola</span>
                </a>
            </div>
            :
            <div className='card document'>
                <div className='card-header'>
                    <div className='row'>
                        <div className="col-6">
                            <h3>{TYPE[naspi.type]}</h3>
                        </div>
                        <div className="col-6 text-end">
                            <span className="badge bg-primary">
                                {STATUS[naspi.status]}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='card-body'>
                    <div className="row">
                        <div className="col-4 single-shop mb-0 ">
                            <a className='default-btn' href='/contatti'>
                                <span>CONTATTACI</span>
                            </a>
                        </div>
                        <div className="col-8">
                            <p className="text-secondary text-end fs-6 fw-bold">{moment(naspi.indt).format("DD/MM/YYYY")}</p>
                            {naspi.type === 0 && <div className='float-end'>
                                Aggiungi
                                <a className='ms-2' href={`/naspi-com/${naspi.id}/variazione-domanda`}>
                                    <span> NASPI COM</span>
                                </a>
                            </div>
                            }
                        </div>
                    </div>

                </div>
            </div>
        }
    </>
}

export default NaspiCard;