import React, { FunctionComponent } from "react";
import { DsAgricolaFormProps } from "../../@types/forms";
import DocumentUpload from "../../components/DocumentUpload";

type FormProps = {
    errors?: object;
    data: DsAgricolaFormProps;
    onDataChange?: any;
};

const DsAgricolaFormDocument: FunctionComponent<FormProps> = ({
    errors,
    data,
    onDataChange,
}) => {
    return (
        <div className="row">
            <div className="col-md-8 mx-auto">
                <div className="row">
                    <DocumentUpload
                        name="identity-f"
                        className="col-6"
                        label="DOCUMENTO"
                    />
                    <DocumentUpload
                        name="identity-r"
                        className="col-6"
                        label="DOCUMENTO"
                    />
                </div>
                <div className="row">
                    <DocumentUpload
                        name="fiscality-f"
                        className="col-6"
                        label="T. SANITARIA"
                    />
                    <DocumentUpload
                        name="fiscality-r"
                        className="col-6"
                        label="T. SANITARIA"
                    />
                </div>
                <div className="row">
                    <DocumentUpload
                        name="last-payment"
                        className="col-12"
                        label="ULTIMA BUSTA PAGA"
                    />
                </div>
                <div className="row">
                    <DocumentUpload
                        name="last-contract"
                        className="col-12"
                        label="CERTIFICAZIONE UNICA"
                    />
                </div>
                <div className="row">
                    <DocumentUpload name="more" className="col-12" label="ALTRI DOCUMENTI" />
                </div>
            </div>
        </div>
    );
};

export default DsAgricolaFormDocument;
