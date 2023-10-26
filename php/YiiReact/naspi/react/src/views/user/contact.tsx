import React, {useState} from 'react'
import axios from "axios";
import {GRADIENT_BACKGROUND} from "../../contants/common";

export default function Contact() {

    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [subject, setSubject] = useState<string>();
    const [message, setMessage] = useState<string>();

    const [showTanks, setShowThanks] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);

    function onSendForm(event) {
        setSending(true)
        event.preventDefault()
        axios.post(process.env.API_URL + '/user/contact', {
            name, email, phone, subject, message
        })
            .then(response => {
                setSending(false)
                setShowThanks(true)
            }).catch(error => {
            setSending(false)
        })
    }

    return <>
        <div className="page-title-area bg-naspi">
            <div className="container">
                <div className="page-title-content">
                    <h2>Contattaci</h2>
                    <ul>
                        <li>
                            <a href="/">
                                Home
                            </a>
                        </li>
                        <li className="active">Contattaci</li>
                    </ul>
                </div>
            </div>
        </div>
        {showTanks ?
            <div className='ptb-100' style={GRADIENT_BACKGROUND}>
                <div className="w-full">
                    <div className="row justify-content-center text-center">
                        <div className="col-md-7 p-4 bg-white">
                            <h1 className="my-0 py-2 text-main">GRAZIE ;)</h1>
                            <h3 className="my-0 py-2">Il tuo messaggio è stato inviato con successo</h3>
                            <h3 className="my-0 py-2">Verrai contattato in 24/48 ore dall'operatore</h3>
                        </div>
                    </div>
                </div>
            </div>
            :
            <>
                <div className="mt-30 mb-30">
                    <div className="container">
                        <h2>Contattaci</h2>
                        <p>Non esitare a chiedere un appuntamento telefonico o eventuali richieste via email !</p>
                    </div>
                </div>
                <div className="main-contact-area pt-40 pb-40">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="contact-form">
                                    <form id="contactForm" onSubmit={onSendForm}>
                                        <div className="row">
                                            <div className="col-lg-6 col-sm-6">
                                                <div className="form-group">
                                                    <input type="text" name="name" id="name" className="form-control"
                                                           required
                                                           data-error="Inserisci il tuo nome"
                                                           placeholder="Nome e Cognome"
                                                           onChange={(event) => setName(event.target.value)}
                                                    />
                                                    <div className="help-block with-errors"></div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-sm-6">
                                                <div className="form-group">
                                                    <input type="email" name="email" id="email" className="form-control"
                                                           required
                                                           data-error="Inserisci la tua email"
                                                           placeholder="Indirizzo Email"
                                                           onChange={(event) => setEmail(event.target.value)}
                                                    />
                                                    <div className="help-block with-errors"></div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-sm-6">
                                                <div className="form-group">
                                                    <input type="text" name="phone_number" id="phone_number" required
                                                           data-error="Inserisci il tuo telefono"
                                                           className="form-control"
                                                           placeholder="Telefono"
                                                           onChange={(event) => setPhone(event.target.value)}
                                                    />
                                                    <div className="help-block with-errors"></div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-sm-6">
                                                <div className="form-group">
                                                    <input type="text" name="msg_subject" id="msg_subject"
                                                           className="form-control"
                                                           required
                                                           data-error="Inserisci l'oggetto" placeholder="Oggetto"
                                                           onChange={(event) => setSubject(event.target.value)}
                                                    />
                                                    <div className="help-block with-errors"></div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-group">
                                                <textarea
                                                    name="message" className="form-control" id="message"
                                                    cols={30} rows={6}
                                                    required data-error="Scrivi il tuo messaggio"
                                                    placeholder="Messaggio"
                                                    onChange={(event) => setMessage(event.target.value)}
                                                />
                                                    <div className="help-block with-errors"></div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12">
                                                <button type="submit" className="default-btn">
                                                    <span>Invia messaggio</span>
                                                </button>
                                                <div id="msgSubmit" className="h3 text-center hidden"></div>
                                                <div className="clearfix"></div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="contact-info">

                                    <ul className="address">
                                        <li>
                                            <span>Email</span>
                                            <a href="mailto:naspionline@gmail.com">naspionline@gmail.com</a>
                                        </li>
                                        <li className="location">
                                            <span>Orari di apertura</span>
                                            lun-ven 9:00-12:30 / 14:30-18:00
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
        <div className="map-area">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11147.368222895459!2d9.665072528803224!3d45.694141586135004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47815111bc62ae73%3A0xd32fcb8f0be5a4d1!2sBergamo%2C%20Province%20of%20Bergamo!5e0!3m2!1sen!2sit!4v1664039150926!5m2!1sen!2sit"
                width="600" height="450" style={{border: 0}} allowFullScreen={false} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </>
}
