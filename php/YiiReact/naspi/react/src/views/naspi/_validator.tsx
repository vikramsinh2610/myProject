import {NaspiFormProps} from '../../@types/forms';


const validateNaspiForm = (naspi: NaspiFormProps) => {
    let errors = {}

    if (naspi.marital_status === 0) {
        errors['marital_status'] = '<label class="font-weight-bold text-warning">Stato Civile</label> selezionato non è corretto'
    }

    if (!([0, 1, 5].includes(naspi.marital_status)) && !naspi.marital_date) {
        errors['marital_date'] = '<label class="font-weight-bold text-warning">Data</label> vuota o non valida'
    }

    if (!naspi.last_work_date) {
        errors['last_work_date'] = '<label class="font-weight-bold text-warning">Data fine rapporto</label> vuota o non valida'
    }
    if (!naspi.iban) {
        errors['iban'] = '<label class="font-weight-bold text-warning">IBAN</label> vuoto o non valido'
    }

    if (naspi.p_iva_check && !naspi.income) {
        errors['income'] = '<label class="font-weight-bold text-warning">Reddito annuo</label> vuoto o non valido'
    }

    if (naspi.p_iva_check && !naspi.p_iva) {
        errors['p_iva'] = '<label class="font-weight-bold text-warning">Partita Iva</label> vuota o non valida'
    }

    const phonenum: any = naspi.phone;
    const PHONE_REGEX = new RegExp(/^(\+[0-9]{2,3})?([. 0-9]{6,17})$/);
    if (phonenum && !PHONE_REGEX.test(phonenum)) {
        errors['phone'] = '<label class="font-weight-bold text-warning">Telefono</label> non valido'
    }
    if (!naspi.fiscal_code) {
        errors['fiscal_code'] = '<label class="font-weight-bold text-warning">Codice Fiscale</label> non valido'
    }

    if (!naspi.address?.address) {
        errors['address'] = '<label class="font-weight-bold text-warning">Indirizzo di residenza</label> vuoto o non valido'
    }
    if (!naspi.address?.city) {
        errors['address'] = '<label class="font-weight-bold text-warning">Indirizzo di residenza</label> vuoto o non valido'
    }
    if (!naspi.address?.cap) {
        errors['address'] = '<label class="font-weight-bold text-warning">Indirizzo di residenza</label> vuoto o non valido'
    }
    if (naspi.address?.province && naspi.address?.province.length !== 2) {
        errors['address'] = '<label class="font-weight-bold text-warning">Indirizzo di residenza</label> vuoto o non valido'
    }

    if (!naspi.same_address) {
        if (!naspi.home?.address) {
            errors['home'] = '<label class="font-weight-bold text-warning">Indirizzo di domicilio</label> vuoto o non valido'
        }
        if (!naspi.home?.city) {
            errors['home'] = '<label class="font-weight-bold text-warning">Indirizzo di domicilio</label> vuoto o non valido'
        }
        if (!naspi.home?.cap) {
            errors['home'] = '<label class="font-weight-bold text-warning">Indirizzo di domicilio</label> vuoto o non valido'
        }
        if (!naspi.home?.province) {
            errors['home'] = '<label class="font-weight-bold text-warning">Indirizzo di domicilio</label> vuoto o non valido'
        }
        if (naspi.home?.province && naspi.home?.province.length !== 2) {
            errors['home'] = '<label class="font-weight-bold text-warning">Indirizzo di domicilio</label> vuoto o non valido'
        }
    }

    return errors
}

export default validateNaspiForm    
