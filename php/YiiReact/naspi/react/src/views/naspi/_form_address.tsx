import React, {FunctionComponent} from "react";
import FormLine from "../../components/FormLine";
import {NaspiFormProps} from "../../@types/forms";

type FormProps = {
    errors?: object;
    data: NaspiFormProps;
    onDataChange?: any;
};

const NaspiFormAddress: FunctionComponent<FormProps> = ({
                                                            errors,
                                                            data,
                                                            onDataChange,
                                                        }) => {

    return <>
        <div className="row">
            <h6>PROFILO</h6>
            <FormLine
                className="col-md-6"
                label="TELEFONO"
                name="phone"
                errors={errors}
            >
                <input
                    value={data.phone}
                    type="text"
                    className="form-control"
                    onChange={({target}) => onDataChange({phone: target.value})}
                />
            </FormLine>
            <FormLine
                className="col-md-6"
                label="CODICE FISCALE"
                name="fiscal_code"
                errors={errors}
            >
                <input
                    value={data.fiscal_code}
                    type="text"
                    className="form-control"
                    maxLength={16}
                    onChange={({target}) => onDataChange({fiscal_code: target.value})}
                />
            </FormLine>
            <h6>INDIRIZZO DI RESIDENZA</h6>
            <FormLine
                className="col-md-12"
                label="VIA/PIAZZA"
                name="address[address]"
                errors={errors}
            >
                <input
                    value={data.address?.address}
                    type="text"
                    className="form-control"
                    onChange={({target}) => onDataChange({
                        address: {
                            address: target.value,
                            cap: data.address?.cap,
                            city: data.address?.city,
                            province: data.address?.province
                        }
                    })}
                />
            </FormLine>

            <FormLine
                className="col-md-3"
                label="CAP"
                name="address[cap]"
                errors={errors}
            >
                <input
                    value={data.address?.cap}
                    type="text"
                    maxLength={5}
                    className="form-control"
                    onChange={({target}) => onDataChange({
                        address: {
                            cap: target.value,
                            address: data.address?.address,
                            city: data.address?.city,
                            province: data.address?.province
                        }
                    })}
                />
            </FormLine>

            <FormLine
                className="col-md-6"
                label="CITTA'"
                name="address[city]"
                errors={errors}
            >
                <input
                    value={data.address?.city}
                    type="text"
                    className="form-control"
                    maxLength={50}
                    onChange={({target}) => onDataChange({
                        address: {
                            city: target.value,
                            cap: data.address?.cap,
                            address: data.address?.address,
                            province: data.address?.province
                        }
                    })}
                />
            </FormLine>

            <FormLine
                className="col-md-3"
                label="PROV."
                name="address[province]"
                errors={errors}
            >
                <input
                    value={data.address?.province}
                    type="text"
                    maxLength={2}
                    className="form-control"
                    onChange={({target}) => onDataChange({
                        address: {
                            province: target.value,
                            cap: data.address?.cap,
                            city: data.address?.city,
                            address: data.address?.address
                        }
                    })}
                />
            </FormLine>
        </div>
        <div className={`row mb-30`}>
            <div className='col-12'>
                <h6>INDIRIZZO DI DOMICILIO</h6>
                <p className='form-check'>
                    <input
                        id='same_address'
                        className='form-check-input'
                        type='checkbox'
                        name="same_address"
                        checked={data.same_address}
                        onChange={(e) => {
                            onDataChange({same_address: e.target.checked});
                        }}/>
                    <label className='ps-1' htmlFor='same_address'>Coincide con la residenza</label>
                </p>
            </div>
        </div>
        <div className={data.same_address ? 'hidden' : 'row'}>
            <FormLine
                className="col-md-12"
                label="VIA/PIAZZA"
                name="home[address]"
                errors={errors}
            >
                <input
                    value={data.home?.address}
                    type="text"
                    className="form-control"
                    onChange={({target}) => onDataChange({
                        home: {
                            address: target.value,
                            cap: data.home?.cap,
                            city: data.home?.city,
                            province: data.home?.province
                        }
                    })}
                />
            </FormLine>

            <FormLine
                className="col-md-3"
                label="CAP"
                name="home[cap]"
                errors={errors}
            >
                <input
                    value={data.home?.cap}
                    type="text"
                    maxLength={5}
                    className="form-control"
                    onChange={({target}) => onDataChange({
                        home: {
                            cap: target.value,
                            address: data.home?.address,
                            city: data.home?.city,
                            province: data.home?.province
                        }
                    })}
                />
            </FormLine>

            <FormLine
                className="col-md-6"
                label="CITTA'"
                name="home[city]"
                errors={errors}
            >
                <input
                    value={data.home?.city}
                    type="text"
                    maxLength={50}
                    className="form-control"
                    onChange={({target}) => onDataChange({
                        home: {
                            city: target.value,
                            cap: data.home?.cap,
                            address: data.home?.address,
                            province: data.home?.province
                        }
                    })}
                />
            </FormLine>

            <FormLine
                className="col-md-3"
                label="PROV."
                name="home[province]"
                errors={errors}
            >
                <input
                    value={data.home?.province}
                    type="text"
                    maxLength={2}
                    className="form-control"
                    onChange={({target}) => onDataChange({
                        home: {
                            province: target.value,
                            cap: data.home?.cap,
                            city: data.home?.city,
                            address: data.home?.address
                        }
                    })}
                />
            </FormLine>
        </div>
    </>

};

export default NaspiFormAddress;
