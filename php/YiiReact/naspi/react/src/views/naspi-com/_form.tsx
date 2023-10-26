import React, {FunctionComponent} from "react";
import {NaspiComFormProps} from "../../@types/forms";
import DocumentUpload from "../../components/DocumentUpload";
import FormLine from "../../components/FormLine";
import {NASPI_COM_VARIATIONS} from "../../contants/naspi";


type FormProps = {
    errors?: object;
    data: NaspiComFormProps;
    onDataChange?: any;
};

const NaspiComForm: FunctionComponent<FormProps> = ({
                                                        errors,
                                                        data,
                                                        onDataChange,
                                                    }) => {

    return <div className="row">
        <FormLine
            className="col-md-12"
            label="EVENTO DA COMUNICARE"
            name="event"
            errors={errors}
        >
            <div className='row'>
                <div className='col-md-4'>
                    <label>
                        <input type='radio' value='0' name="event" onChange={({target}) =>
                            onDataChange({event: parseInt(target.value)})
                        }/> Nuovo evento
                    </label>
                </div>
                <div className='col-md-4'>
                    <label>
                        <input type='radio' value='1' name="event" onChange={({target}) =>
                            onDataChange({event: parseInt(target.value)})
                        }/> Attiva
                    </label>
                </div>
                <div className='col-md-4'>
                    <label>
                        <input type='radio' value='-1' name="event" onChange={({target}) =>
                            onDataChange({event: parseInt(target.value)})
                        }/> Sospendi
                    </label>
                </div>
            </div>
        </FormLine>
        <FormLine
            className="col-md-12"
            label=""
            name="variation"
            errors={errors}
        >
            <select
                id="variation"
                className="form-control"
                name="variation"
                value={data.variation}
                onChange={({target}) =>
                    onDataChange({variation: parseInt(target.value)})
                }
            >
                {NASPI_COM_VARIATIONS.map((item: string, index: number) => {
                    return (
                        <option key={index} value={index}>
                            {item}
                        </option>
                    );
                })}
            </select>
        </FormLine>
        <DocumentUpload
            name="contract"
            className="form-group col-md-12"
            label="CONTRATTO"
            change={(event: any) => {
                onDataChange({"contract": event})
            }}
        />
        <DocumentUpload
            name="more"
            className="form-group col-md-12"
            label="ALTRI DOCUMENTI"
            change={(event: any) => {
                onDataChange({"more": event})
            }}
        />
    </div>;
};

export default NaspiComForm;
