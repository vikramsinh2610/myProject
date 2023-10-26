import React, {useState} from 'react'
import axios from "axios";
import {RegisterUserForm} from "../../@types/forms";
import FormLine from "../../components/FormLine";
import validateUserForm from "./_validator";

export default function Register() {

    const [user, setUser] = useState<RegisterUserForm>({})

    const [errors, setErrors] = useState({})

    function onFormSubmit(event) {
        event.preventDefault()
        const _err = validateUserForm(user)
        if (Object.keys(_err).length) {
            setErrors(_err)
            return
        }
        axios
            .post(process.env.API_URL + '/user/create', user, {
                // @ts-ignore
                headers: {'X-CSRF-Token': reactInit.csrfParam}
            })
            .then(response => {
                // @ts-ignore
                document.location = `/home`
            }).catch(error => {
            setErrors(error.response.data)
        })
    }

    return <section className='user-area ptb-100'>
        <div className='container'>

            <div className='user-form-content register-width'>
                <h3>Crea account</h3>

                <form className='user-form' onSubmit={onFormSubmit}>
                    <div className='row'>
                        <FormLine
                            className='col-md-6'
                            label='Nome'
                            name='name'
                            errors={errors}
                        >
                            <input 
                                className='form-control'
                                type='text'
                                name='name'
                                maxLength={50}
                                onChange={(event) => setUser(Object.assign({}, user, {name: event.target.value}))}
                            />
                        </FormLine>

                        <FormLine
                            className='col-md-6'
                            label='Cognome'
                            name='surname'
                            errors={errors}
                        >
                            <input 
                                className='form-control'
                                type='text'
                                name='surname'
                                onChange={(event) => setUser(Object.assign({}, user, {surname: event.target.value}))}
                            />
                        </FormLine>

                        <FormLine
                            className='col-md-12'
                            label='Email'
                            name='email'
                            errors={errors}
                        >
                            <input 
                                className='form-control'
                                type='email'
                                name='email'
                                onChange={(event) => setUser(Object.assign({}, user, {email: event.target.value}))}
                            />
                        </FormLine>

                        <FormLine
                            className='col-md-12'
                            label='Password'
                            name='password'
                            errors={errors}
                        >
                            <input 
                                className='form-control'
                                type='text'
                                name='password'
                                onChange={(event) => setUser(Object.assign({}, user, {password: event.target.value}))}
                            />
                        </FormLine>

                        <FormLine
                            className='col-md-12'
                            label='Ripeti password'
                            name='password2'
                            errors={errors}
                        >
                            <input 
                                className='form-control'
                                type='text'
                                name='password2'
                                onChange={(event) => setUser(Object.assign({}, user, {password2: event.target.value}))}
                            />
                        </FormLine>

                        <div className='col-12'>
                            <button className='default-btn register' type='submit'>
                                Registrati ora
                            </button>
                        </div>

                        <div className='col-12'>
                            <p className='create'>Hai già un account? <a href='/login'>Log in</a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
}
