import React, {FunctionComponent} from "react";
import {NaspiAnticipataFormProps} from "../../@types/forms";
import NaspiAnticipataFormData from "./_form_data";
import NaspiAnticipataFormDocument from "./_form_document";


type FormProps = {
    errors?: object;
    data: NaspiAnticipataFormProps;
    onDataChange?: any;
};

const NaspiAnticipataForm: FunctionComponent<FormProps> = ({
                                                     errors,
                                                     data,
                                                     onDataChange,
                                                 }) => {

    return (
        <div className="row">
            <NaspiAnticipataFormData errors={errors} data={data} onDataChange={onDataChange}/>
            <NaspiAnticipataFormDocument errors={errors} data={data} onDataChange={onDataChange}/>
        </div>
    );
};

export default NaspiAnticipataForm;
