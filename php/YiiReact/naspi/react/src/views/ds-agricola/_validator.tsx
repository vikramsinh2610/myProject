import {DsAgricolaFormProps} from '../../@types/forms';


const validateDsAgricolaForm = (naspi: DsAgricolaFormProps) => {
    let errors = {}

    if (naspi.marital_status === 0) {
        errors['marital_status'] = 'Seleziona lo Stato Civile dal menù'
    }

    if (!([0, 1, 5].includes(naspi.marital_status)) && !naspi.marital_date) {
        errors['marital_date'] = 'Seleziona la data dal menù'
    }

    if (!naspi.last_work_date) {
        errors['last_work_date'] = 'Seleziona la data dal menù'
    }
    if (!naspi.iban) {
        errors['iban'] = 'Inserisci IBAN'
    }

    if (!naspi.phone) {
        errors['phone'] = 'Inserisci Telefono'
    }

    if(!naspi.anf){
        errors['anf'] = "Inserisci la Richiesta ANF"
    }

    return errors
}

export default validateDsAgricolaForm    
