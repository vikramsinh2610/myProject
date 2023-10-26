<?php

use app\models\User;
use yii\helpers\Html;

/* @var $missingDocs array */
/* @var $user User */
/* @var $url string */

$this->registerCssFile("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

?>
<div>
    <div style="text-align: center;">
        <p style="margin-bottom: 25px;">
            Ciao <?= Html::encode($user->name) ?></br>
            la tua pratica è stata creata con successo!
        </p>
        <p style="margin-bottom: 25px;">
            Se hai caricato i documenti non ti resta che attendere la lavorazione.
        </p>
        <p style="margin-bottom: 25px;">
            Verrai contattato in 24/48 ore dall'operatore
            per chiarimenti o riceverai una email con mandato e
            consenso da firmare direttamente da cellulare
        </p>
        <p style="margin-bottom: 25px;">
            Altrimenti puoi allegare ora i documenti mancanti tramite email
        </p>
        <p style="margin-bottom: 25px;">
            Per qualsiasi info o supporto puoi contattarci
            tramite email o richiedere un ricontatto telefonico al
            tuo recapito !
        </p>
        <p style="margin-bottom: 25px; text-decoration: none; font-size: 22px; margin-top: 120px;">
        <a  
            href="https://www.naspi.online"
            style=" text-decoration: none; color:#fc8423;">
                <img style="vertical-align: middle; margin-right: 20px" src="data:image/png;base64,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">
                www.naspi.online
            </a>
        </p>
    </div>
</div>