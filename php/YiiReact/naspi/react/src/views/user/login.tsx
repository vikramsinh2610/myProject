import React, {useState} from 'react'
import axios from 'axios';

export default function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(0)

    const [error, setError] = useState({data: [], error: {}})

    function onFormSubmit(event) {
        event.preventDefault()
        axios
            .post(process.env.API_URL + '/user/login', {username, password, rememberMe}, {
                // @ts-ignore
                headers: {'X-CSRF-Token': reactInit.csrfParam}
            })
            .then(response => {
                // @ts-ignore
                document.location = `/home`
            }).catch(error => {
            setError(error.response.data)
        })
    }

    return <section className='user-area ptb-100'>
        <div className='container'>
            <div className='user-form-content log-in-width'>
                <h3>Registrati o accedi</h3>

                <form className='user-form' method='post' onSubmit={onFormSubmit}>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Email</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    name='username'
                                    onChange={(event) => setUsername(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Password</label>
                                <input
                                    className='form-control'
                                    type='password'
                                    name='password'
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className='col-12'>
                            <div className='login-action'>
                            <span className='log-rem'>
                                <input
                                    id='remember-2'
                                    type='checkbox'
                                    onChange={(event) => setRememberMe(parseInt(event.target.value))}
                                />
                                <label htmlFor='remember-2'>Rimani collegato</label>
                            </span>
                                <span className='forgot-login'>
                                <a href='/recupera-password'>Hai dimenticato password?</a>
                            </span>
                            </div>
                        </div>

                        <div className='col-12'>
                            <button className='default-btn' type='submit'>
                                Log in
                            </button>
                        </div>

                        <div className='col-12'>
                            <p className='create'>Non hai un account? <a href='/registrati'>crea ora</a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
}
