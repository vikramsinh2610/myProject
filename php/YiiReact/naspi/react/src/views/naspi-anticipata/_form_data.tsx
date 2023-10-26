import React, { FunctionComponent, useState } from "react";
import FormLine from "../../components/FormLine";
import { NaspiAnticipataFormProps } from "../../@types/forms";
import { DatePicker } from "react-widgets/cjs";
import { ACTIVITY_TYPE, MARITAL_STATUS } from "../../contants/naspi";
import moment from "moment";

type FormProps = {
    errors?: object;
    data: NaspiAnticipataFormProps;
    onDataChange?: any;
};

const NaspiAnticipataFormData: FunctionComponent<FormProps> = ({
    errors,
    data,
    onDataChange,
}) => {

    const [sameAddress, setSameAddress] = useState(true);
    return <>
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
                    name="marital_date"
                    value={data.marital_date ? moment(data.marital_date).toDate() : undefined}
                    includeTime={false}
                    onChange={(DateSelect) => {
                        onDataChange({
                            marital_date: moment(DateSelect).format("YYYY/MM/DD"),
                        });
                    }}
                    valueFormat="DD/MM/YYYY"
                />
            </FormLine>
        </div>
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
                    onChange={({ target }) => onDataChange({ phone: target.value })}
                />
            </FormLine>
            <FormLine
                className="col-md-6"
                label="EMAIL"
                name="email"
                errors={errors}
            >
                <input
                    value={data.email}
                    type="text"
                    className="form-control"
                    onChange={({ target }) => onDataChange({ email: target.value })}
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
        <h6>PROTOCOLLO DOMANDA NASPI</h6>
        <div className="row">
            <FormLine
                className="col-md-6"
                label="N PROTOCOLLO"
                name="protocol"
                errors={errors}
            >
                <input
                    id="protocol"
                    className="form-control"
                    name="protocol"
                    value={data.protocol}
                    onChange={({ target }) =>
                        onDataChange({ protocol: target.value })
                    }
                />
            </FormLine>
            <FormLine
                className="col-md-6"
                label={"DATA FINE ULTIMO RAPPORTO LAVORO"}
                name="protocol_date"
                errors={errors}
            >
                <DatePicker
                    name="last_work_date"
                    value={data.protocol_date ? moment(data.protocol_date).toDate() : undefined}
                    includeTime={false}
                    onChange={(DateSelect) => {
                        onDataChange({
                            protocol_date: moment(DateSelect).format("YYYY/MM/DD"),
                        });
                    }}
                    valueFormat="DD/MM/YYYY"
                />
            </FormLine>
        </div>
        <h6>ATTIVITA</h6>
        <div className="row">
        <FormLine
                className="col-md-6"
                label="TIPO ATTIVITà INTRAPRESA"
                name="activity_type"
                errors={errors}
            >
                <select
                    id="activity_type"
                    className="form-control"
                    name="activity_type"
                    value={data.activity_type}
                    onChange={({ target }) =>
                        onDataChange({ activity_type: parseInt(target.value) })
                    }
                >
                    {ACTIVITY_TYPE.map((item: string, index: number) => {
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
                label="DENOMINAZIONE"
                name="activity_name"
                errors={errors}
            >
                <input
                    id="protocol"
                    className="form-control"
                    name="activity_name"
                    value={data.activity_name}
                    onChange={({ target }) =>
                        onDataChange({ activity_name: target.value })
                    }
                />
            </FormLine>
            <FormLine
                className="col-md-6"
                label={"DATA INIZIO ATTIVITà"}
                name="activity_date"
                errors={errors}
            >
                <DatePicker
                    name="last_work_date"
                    value={data.activity_date ? moment(data.activity_date).toDate() : undefined}
                    includeTime={false}
                    onChange={(DateSelect) => {
                        onDataChange({
                            activity_date: moment(DateSelect).format("YYYY/MM/DD"),
                        });
                    }}
                    valueFormat="DD/MM/YYYY"
                />
            </FormLine>
        </div>
    </>

};

export default NaspiAnticipataFormData;
