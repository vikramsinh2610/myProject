import React, {FunctionComponent} from "react";
import FormLine from "../../components/FormLine";
import moment from "moment";
import {NaspiFormProps} from "../../@types/forms";
import {MARITAL_STATUS} from "../../contants/naspi";
import {Combobox, DatePicker} from "react-widgets";

type FormProps = {
    errors?: object;
    data: NaspiFormProps;
    onDataChange?: any;
};

const NaspiFormQuestion: FunctionComponent<FormProps> = ({
                                                             errors,
                                                             data,
                                                             onDataChange,
                                                         }) => {
    return (
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
                    onChange={({target}) =>
                        onDataChange({marital_status: parseInt(target.value)})
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
                    value={data.marital_date ? moment(data.marital_date).toDate() : null}
                    onChange={(DateSelect) => {
                        onDataChange({
                            marital_date: moment(DateSelect).format("YYYY/MM/DD"),
                        });
                    }}
                    valueDisplayFormat={{dateStyle: "short"}}
                />
            </FormLine>
            <FormLine className="col-md-6" label="IBAN" name="iban" errors={errors}>
                <input
                    value={data.iban}
                    type="text"
                    maxLength={30}
                    className="form-control"
                    onChange={({target}) => onDataChange({iban: target.value})}
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
                    valueDisplayFormat={{dateStyle: "short"}}
                />
            </FormLine>

            <FormLine
                className="col-md-4 inline-block"
                label="Hai P.Iva?"
                name="p_iva_checkbox"
                errors={errors}
            >
                <div className="form-check">
                    <input
                        type="checkbox"
                        className='form-check-input'
                        id="p_iva_checkbox"
                        name="p_iva_checkbox"
                        checked={data.p_iva_check}
                        onChange={({target}) => {
                            console.log("target", target);
                            onDataChange({p_iva_check: target.checked});
                        }}
                    />
                </div>
            </FormLine>
            <FormLine
                className="col-md-4"
                label="P. Iva"
                name="p_iva"
                errors={errors}
            >
                <input
                    value={data.p_iva}
                    disabled={!data.p_iva_check}
                    maxLength={15}
                    className="form-control
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                        invalid:border-pink-500 invalid:text-pink-600
                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    onChange={({target}) => onDataChange({p_iva: target.value})}
                />
            </FormLine>
            <FormLine
                className="col-md-4"
                label="REDDITO ANNUO ATTESO"
                name="income"
                errors={errors}
            >
                <input
                    value={data.income}
                    type="number"
                    min="0"
                    disabled={!data.p_iva_check}
                    className="form-control
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                        invalid:border-pink-500 invalid:text-pink-600
                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    onChange={({target}) => onDataChange({income: target.value})}
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
            onChange={({target}) => onDataChange({info: target.value})}
        />
            </FormLine>
        </div>
    );
};

export default NaspiFormQuestion;
