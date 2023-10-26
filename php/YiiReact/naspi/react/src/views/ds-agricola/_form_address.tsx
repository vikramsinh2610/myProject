import React, { FunctionComponent, useState } from "react";
import FormLine from "../../components/FormLine";
import { DsAgricolaFormProps } from "../../@types/forms";
import { MARITAL_STATUS, PAYMENTS } from "../../contants/naspi";
import { DatePicker } from "react-widgets/cjs";
import moment from "moment";

type FormProps = {
    errors?: object;
    data: DsAgricolaFormProps;
    onDataChange?: any;
};

const DsAgricolaFormAddress: FunctionComponent<FormProps> = ({
    errors,
    data,
    onDataChange,
}) => {

    const [sameAddress, setSameAddress] = useState(true);
    return <>
        <div className="row">
            <FormLine
                className="col-md-12"
                label="Richiesta ANF"
                name="anf"
                errors={errors}
            >
                <div className='row'>
                    <div className='col-md-4'>
                        <label>
                            <input type='radio' value='1' name="anf" onChange={() =>
                                onDataChange({ anf: true})
                            } /> Si
                        </label>
                    </div>
                    <div className='col-md-4'>
                        <label>
                            <input type='radio' value='0' name="anf" onChange={() =>
                                onDataChange({ anf: false })
                            } /> No
                        </label>
                    </div>
                </div>
            </FormLine>
        </div>
        <div className="row">
            <FormLine
                className="col-md-6"
                label="STATO CIVILE"
                name="marital_status"
                errors={errors}
            >
                <select
                    id="marital_status"
                    className="form-control"
                    name="marital_status"
                    value={data.marital_status}
                    onChange={({ target }) =>
                        onDataChange({ marital_status: parseInt(target.value) })
                    }
                >
                    {MARITAL_STATUS.map((item: string, index: number) => {
                        return (
                            <option key={index} value={index}>
                                {item}
                            </option>
                        );
                    })}
                </select>
            </FormLine>
            <FormLine
                className="col-md-6"
                label={"DATA"}
                name="marital_date"
                errors={errors}
            >
                <DatePicker
                    includeTime={false}
                    value={data.marital_date ? moment(data.marital_date).toDate() : undefined}
                    onChange={(DateSelect) => {
                        onDataChange({
                            marital_date: moment(DateSelect).format("YYYY/MM/DD"),
                        });
                    }}
                    valueFormat="DD/MM/YYYY"
                />
            </FormLine>
            <h6>INDIRIZZO DI RESIDENZA</h6>
            <FormLine
                className="col-md-12"
                label="VIA/PIAZZA"
                name="address"
                errors={errors}
            >
                <input
                    value={data.address?.address}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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
                name="cap"
                errors={errors}
            >
                <input
                    value={data.address?.cap}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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
                name="city"
                errors={errors}
            >
                <input
                    value={data.address?.city}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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
                name="address"
                errors={errors}
            >
                <input
                    value={data.address?.province}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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
            <h6>INDIRIZZO DI DOMICILIO</h6>
            <p>
                <input type='checkbox' checked={sameAddress} onChange={() => setSameAddress(!sameAddress)} />
                <label className='ps-1' htmlFor='same_address'>Coincide con la residenza</label>
            </p>
        </div>
        <div className={`row ${sameAddress && 'hidden'}`}>
            <FormLine
                className="col-md-12"
                label="VIA/PIAZZA"
                name="home"
                errors={errors}
            >
                <input
                    value={data.home?.address}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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
                name="address"
                errors={errors}
            >
                <input
                    value={data.home?.cap}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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
                name="city"
                errors={errors}
            >
                <input
                    value={data.home?.city}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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
                name="address"
                errors={errors}
            >
                <input
                    value={data.home?.province}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({
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

        <div className="row">
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
                    onChange={({ target }) => onDataChange({ phone: target.value })}
                />
            </FormLine>
            <FormLine
                className="col-md-6"
                label={"DATA FINE ULTIMO RAPPORTO LAVORO"}
                name="last_work_date"
                errors={errors}
            >
                <DatePicker
                    name="last_work_date"
                    value={data.last_work_date ? moment(data.last_work_date).toDate() : undefined}
                    includeTime={false}
                    onChange={(DateSelect) => {
                        onDataChange({
                            last_work_date: moment(DateSelect).format("YYYY/MM/DD"),
                        });
                    }}
                    valueFormat="DD/MM/YYYY"
                />
            </FormLine>
        </div>
        <div className="row">
            <FormLine
                className="col-md-6"
                label="HAI SVOLTO ALTRE ATTIVITà LAVORATIVE NEL CORSO DELL'ANNO"
                name="more_works"
                errors={errors}
            >
                <div className='row'>
                    <div className='col-md-4'>
                        <label>
                            <input type='radio' value='0' name="more_works" onChange={() =>
                                onDataChange({ more_works: true })
                            } /> Si
                        </label>
                    </div>
                    <div className='col-md-4'>
                        <label>
                            <input type='radio' value='1' name="more_works" onChange={() =>
                                onDataChange({ more_works: false})
                            } /> NO
                        </label>
                    </div>
                </div>
            </FormLine>
            <FormLine
                className="col-md-6"
                label="SE SI INDICA QUALI"
                name="phone"
                errors={errors}
            >
                <input
                    value={data.phone}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({ phone: target.value })}
                />
            </FormLine>
            <FormLine
                className="col-md-6"
                label="MODALITà DI PAGAMENTO"
                name="payment_method"
                errors={errors}
            >
                <select
                    id="maritalpayment_method_status"
                    className="form-control"
                    name="payment_method"
                    value={data.payment_method}
                    onChange={({ target }) =>
                        onDataChange({ payment_method: parseInt(target.value) })
                    }
                >
                    {PAYMENTS.map((item: string, index: number) => {
                        return (
                            <option key={index} value={index}>
                                {item}
                            </option>
                        );
                    })}
                </select>
            </FormLine>
            <FormLine
                className="col-md-6"
                label="IBAN"
                name="iban"
                errors={errors}
            >
                <input
                    value={data.iban}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({ iban: target.value })}
                />
            </FormLine>
            <FormLine
                className="col-md-12"
                label="ALTRE INFO DA SEGNALARE "
                name="info"
                errors={errors}
            >
                <textarea
                    value={data.info}
                    className="form-control"
                    onChange={({ target }) => onDataChange({ info: target.value })}
                />
            </FormLine>
        </div>
    </>

};

export default DsAgricolaFormAddress;
