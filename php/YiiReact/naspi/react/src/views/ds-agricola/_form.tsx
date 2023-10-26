import React, {FunctionComponent} from "react";
import {DsAgricolaFormProps} from "../../@types/forms";
import DsAgricolaFormAddress from "./_form_address";
import DsAgricolaFormDocument from "./_form_document";


type FormProps = {
    errors?: object;
    data: DsAgricolaFormProps;
    onDataChange?: any;
};

const DsAgricolaForm: FunctionComponent<FormProps> = ({
                                                     errors,
                                                     data,
                                                     onDataChange,
                                                 }) => {

    return (
        <div className="row">
            <DsAgricolaFormAddress errors={errors} data={data} onDataChange={onDataChange}/>
            <DsAgricolaFormDocument errors={errors} data={data} onDataChange={onDataChange}/>
        </div>
    );
};

export default DsAgricolaForm;
