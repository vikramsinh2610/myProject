<?php

/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */

/** @var app\models\ContactForm $model */

use yii\bootstrap4\ActiveForm;

?>
<!-- Start Page Title Area -->
<div class="page-title-area bg-8">
    <div class="container">
        <div class="page-title-content">
            <h2>Contattaci</h2>
            <ul>
                <li>
                    <a href="/">
                        Home
                    </a>
                </li>
                <li class="active">Contattaci</li>
            </ul>
        </div>
    </div>
</div>
<!-- End Page Title Area -->

<section class="mt-30 mb-30">
    <div class="container">
        <h2>Contattaci</h2>
        <p>Non esitare a chiedere un appuntamento telefonico o eventuali richieste via email !</p>
    </div>
</section>

<!-- Start Contact Area -->
<section class="main-contact-area pt-40 pb-40">
    <div class="container">
        <div class="row">
            <div class="col-lg-8">
                <div class="contact-form">
                    <!-- <form id="contactForm" method="post"> -->
                    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>
                    <div class="row">
                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="text" name="name" id="name" class="form-control" required
                                    data-error="Inserisci il tuo nome" placeholder="Nome e Cognome">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>

                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="email" name="email" id="email" class="form-control" required
                                    data-error="Inserisci la tua email" placeholder="Indirizzo Email">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>

                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="text" name="phone_number" id="phone_number" required
                                    data-error="Inserisci il tuo telefono" class="form-control" placeholder="Telefono">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>

                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="text" name="msg_subject" id="msg_subject" class="form-control" required
                                    data-error="Inserisci l'oggetto" placeholder="Oggetto">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-group">
                                <textarea name="message" class="form-control" id="message" cols="30" rows="6" required
                                    data-error="Scrivi il tuo messaggio" placeholder="Messaggio"></textarea>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>

                        <div class="col-lg-12 col-md-12">
                            <button type="submit" class="default-btn">
                                <span>Invia messaggio</span>
                            </button>
                            <div id="msgSubmit" class="h3 text-center hidden"></div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <!-- </form> -->
                    <?php ActiveForm::end(); ?>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="contact-info">

                    <ul class="address">
                        <li>
                            <span>Email</span>
                            <a href="mailto:naspionline@gmail.com">naspionline@gmail.com</a>
                        </li>
                        <li class="location">
                            <span>Orari di apertura</span>
                            lun-ven 9:00-12:30 / 14:30-18:00
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End Contact Area -->

<!-- Start Map Area -->
<div class="map-area">
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11147.368222895459!2d9.665072528803224!3d45.694141586135004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47815111bc62ae73%3A0xd32fcb8f0be5a4d1!2sBergamo%2C%20Province%20of%20Bergamo!5e0!3m2!1sen!2sit!4v1664039150926!5m2!1sen!2sit"
        width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
<!-- End Map Area -->