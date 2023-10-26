import {RegisterUserForm} from '../../@types/forms';


export default function validateUserForm(user: RegisterUserForm) {
    let errors = {}

    if (!user.name || user.name === '') {
        errors['name'] = 'Nome non può essere vuoto'
    }

    if (!user.surname || user.surname === '') {
        errors['surname'] = 'Cognome non può essere vuoto'
    }

    if (!user.email || user.email === '') {
        errors['email'] = 'Email non può essere vuota'
    }

    if (!user.password || user.password === '') {
        errors['password'] = 'Password non può essere vuoto'
    }

    if (!user.password2 || user.password2 !== user.password) {
        errors['password2'] = 'Le password non coincidono'
    }

    return errors
}