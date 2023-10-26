import {NaspiAnticipataFormProps} from '../../@types/forms';


const validateNaspiAnticipataForm = (naspi: NaspiAnticipataFormProps) => {
    let errors = {}


    if (!naspi.phone) {
        errors['phone'] = 'Inserisci Telefono'
    }
    if (!naspi.email) {
        errors['email'] = 'Inserisci Email'
    }

    if (naspi.marital_status === 0) {
        errors['marital_status'] = 'Seleziona lo Stato Civile dal menù'
    }

    if (!([0, 1, 5].includes(naspi.marital_status)) && !naspi.marital_date) {
        errors['marital_date'] = 'Seleziona la data dal menù'
    }

    if (!naspi.protocol) {
        errors['protocol'] = 'Inserisci il numero protocollo pratica Naspi'
    }    
    if (!naspi.protocol_date) {
        errors['protocol_date'] = 'Inserisci Data di presentazione'
    }
    
    // if (!naspi.iban) {
    //     errors['iban'] = 'Inserisci IBAN'
    // }

    return errors
}

export default validateNaspiAnticipataForm    
