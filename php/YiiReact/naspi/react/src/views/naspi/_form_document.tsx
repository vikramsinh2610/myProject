import React, {FunctionComponent} from "react";
import {NaspiFormProps} from "../../@types/forms";
import DocumentUpload from "../../components/DocumentUpload";

type FormProps = {
    errors?: object;
    data: NaspiFormProps;
    onDataChange?: any;
};

const NaspiFormDocument: FunctionComponent<FormProps> = ({
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
                        label="FRONTE DOCUMENTO"
                        change={(event: any) => {
                            onDataChange({"identity-f": event})
                        }}
                    />
                    <DocumentUpload
                        name="identity-r"
                        className="col-6"
                        label="RETRO DOCUMENTO"
                        change={(event: any) => {
                            onDataChange({"identity-r": event})
                        }}
                    />
                </div>
                <div className="row">
                    <DocumentUpload
                        name="fiscality-f"
                        className="col-6"
                        label="FRONTE T. SANITARIA"
                        change={(event: any) => {
                            onDataChange({"fiscality-f": event})
                        }}
                    />
                    <DocumentUpload
                        name="fiscality-r"
                        className="col-6"
                        label="RETRO T. SANITARIA"
                        change={(event: any) => {
                            onDataChange({"fiscality-r": event})
                        }}
                    />
                </div>
                <div className="row">
                    <DocumentUpload
                        name="last-payment"
                        className="col-12"
                        label="ULTIMA BUSTA PAGA"
                        change={(event: any) => {
                            onDataChange({"last-payment": event})
                        }}
                    />
                </div>
                <div className="row">
                    <DocumentUpload
                        name="last-contract"
                        className="col-12"
                        label="ULTIMO CONTRATTO"
                        change={(event: any) => {
                            onDataChange({"last-contract": event})
                        }}
                    />
                </div>
                <div className="row">
                    <DocumentUpload
                        name="more"
                        className="col-12"
                        label="ALTRI DOCUMENTI"
                        change={(event: any) => {
                            onDataChange({"more": event})
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default NaspiFormDocument;
