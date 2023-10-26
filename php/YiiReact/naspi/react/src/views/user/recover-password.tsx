import React, {useState} from 'react'
import axios from 'axios'

export default function RecoverPassword() {

    const [message, setMessage] = useState<string | null>();
    const [error, setError] = useState<string | null>('');
    const [username, setUsername] = useState<string>('');


    function onResetPassword(event) {
        event.preventDefault()
        axios.get(process.env.API_URL + '/user/recover-password', {
            params: {
                username
            }
        })
            .then(response => {
                setMessage('Ti abbiamo inviato una e-mail al tuo indirizzo in cui troverai le istruzioni per impostare una nuova password')
                setError(null)
            }).catch(error => {
            setMessage(null)
            setError(error.response.data.message)
        })
    }

    return <section className='user-area ptb-100'>
        <div className='container text-center'>
            <h3 className='mb-2'>Recupera password</h3>
            <div className='user-form-content log-in-width'>
                <form id='login-form' className='mt-2' onSubmit={onResetPassword}>
                    <div className='form-group has-feedback'>
                        <input
                            type='text'
                            id='username'
                            className='form-control'
                            name='username'
                            placeholder='Username'
                            aria-required='true'
                            onChange={(event) => {
                                setUsername(event.target.value)
                            }}
                        />
                        <span className='fa fa-envelope form-control-feedback'/>
                        {message &&
                            <p className='alert alert-success alert-sm'>{message}</p>
                        }
                        {error &&
                            <p className='alert alert-danger alert-sm'>{error}</p>
                        }
                    </div>
                    <div className='row mt-2'>
                        <div className='col-xs-12 text-center'>
                            <div
                                className='btn btn-primary btn-flat'
                                onClick={onResetPassword}
                            >
                                RECUPERA PASSWORD
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    </section>


}
