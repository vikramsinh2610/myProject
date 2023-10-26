import React, {FunctionComponent} from "react";

const NaspiThankYouMessage: FunctionComponent<any> = ({}) => {
    return (
        <div className="w-full">
            <div className="row justify-content-center text-center">
                <div className="col-md-7 p-4 bg-white">
                    <h1 className="my-0 py-2 text-main">GRAZIE ;)</h1>
                    <h3 className="my-0 py-2">La tua pratica è stata creata con successo</h3>
                    <h3 className="my-0 py-2">Verrai contattato in 24/48 ore dall'operatore
                    per chiarimenti o riceverai la conferma via email</h3>
                    <h3 className="my-0 py-3">Per qualsiasi info o supporto puoi contattarci 
                    tramite email <a href="mailto:naspionline@gmail.com">naspionline@gmail.com</a>
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default NaspiThankYouMessage;
