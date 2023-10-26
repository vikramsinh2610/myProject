import {NaspiComFormProps} from '../../@types/forms';


const validateNaspiForm = (naspicom: NaspiComFormProps) => {
    let errors = {}

    if (naspicom.event == null) {
        errors['event'] = '<label class="font-weight-bold text-warning">evento</label> selezionato non è corretto'
    }
    if (!naspicom.variation) {
        errors['variation'] = '<label class="font-weight-bold text-warning">variazione</label> selezionato non è corretto'
    }
    if (!naspicom.contract) {
        errors['contract'] = '<label class="font-weight-bold text-warning">contract</label> selezionato non è corretto'
    }
    return errors
}

export default validateNaspiForm    
