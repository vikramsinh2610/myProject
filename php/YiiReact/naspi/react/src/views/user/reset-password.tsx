import React, {useState} from 'react'
import axios from 'axios'

export default function ResetPassword() {

    const params = new URLSearchParams(location.search)

    const [message, setMessage] = useState<string | null>();
    const [error, setError] = useState<string | null>();
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [token, setToken] = useState<string>(params.get('token') || '');

    function onSavePassword(event) {
        event.preventDefault()

        if (password == '') {
            setMessage('Password non può essere vuota')
            setError(null)
            return
        } else if (password.length < 6) {
            setMessage('Password deve contenere almeno 6 caratteri')
            setError(null)
            return
        } else if (password != password2) {
            setMessage('Password non coindono')
            setError(null)
            return
        }

        axios.post(process.env.API_URL + '/user/reset-password', {
            token: token, password: password, password2: password2
        })
            .then(response => {
                setMessage('Password resettata con successo')
                setError(null)
                window.setTimeout(function () {
                    // Move to a new location or you can do something else
                    // @ts-ignore
                    window.location.href = process.env.BASE_PATH
                }, 5000)
            }).catch(error => {
            setMessage(null)
            setError(error.response.data.message)
        })
    }

    return <div className='login-box'>
        <div className='login-logo'>
            <a href={process.env.BASE_PATH}><b>Calendario Admin</b></a>
        </div>
        <div className='login-box-body'>
            <p className='login-box-msg'>
                Resetta password
            </p>
            <form id='login-form' onSubmit={onSavePassword}>
                <div className='form-group has-feedback'>
                    <input
                        type='password'
                        id='password'
                        className='form-control'
                        name='password'
                        placeholder='Password'
                        aria-required='true'
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}
                    />
                    <span className='fa fa-lock form-control-feedback'/>
                </div>
                <div className='form-group has-feedback'>
                    <input
                        type='password'
                        id='password2'
                        className='form-control'
                        name='password2'
                        placeholder='Ripeti password'
                        aria-required='true'
                        onChange={(event) => {
                            setPassword2(event.target.value)
                        }}
                    />
                    <span className='fa fa-lock form-control-feedback'/>
                    {message &&
                        <p className='alert alert-success alert-sm'>{message}</p>
                    }
                    {error &&
                        <p className='alert alert-danger alert-sm'>{error}</p>
                    }
                </div>
                <div className='row'>
                    {
                        !message ?
                            <div className='col-xs-12 text-center'>
                                <div
                                    className='btn btn-primary btn-flat'
                                    onClick={onSavePassword}
                                >
                                    SALVA PASSWORD
                                </div>
                            </div>
                            :
                            <div className='col-xs-12 text-center'>
                                <a
                                    href={process.env.BASE_PATH}
                                    className='btn btn-info btn-flat'
                                >
                                    VAI AL LOGIN
                                </a>
                            </div>
                    }
                </div>
            </form>
        </div>
    </div>

}
