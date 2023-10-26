import React, {FunctionComponent} from "react";
import {NaspiFormProps} from "../../@types/forms";
import NaspiFormAddress from "./_form_address";
import NaspiFormQuestion from "./_form_question";
import NaspiFormDocument from "./_form_document";


type FormProps = {
    errors?: object;
    data: NaspiFormProps;
    onDataChange?: any;
};

const NaspiForm: FunctionComponent<FormProps> = ({
                                                     errors,
                                                     data,
                                                     onDataChange,
                                                 }) => {

    return (
        <div className="row">
            <NaspiFormAddress errors={errors} data={data} onDataChange={onDataChange}/>
            <NaspiFormQuestion errors={errors} data={data} onDataChange={onDataChange}/>
            <NaspiFormDocument errors={errors} data={data} onDataChange={onDataChange}/>
        </div>
    );
};

export default NaspiForm;
