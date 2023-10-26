<?php

use app\models\Naspi;
use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $naspi Naspi */
/* @var $url string */

$this->registerCssFile("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

?>
<div>
    <div style="text-align: center;">
        <p style="margin-bottom: 0;">Ciao
            <?= Html::encode($naspi->name) ?>
        </p>
        <p style="margin-bottom: 25px;">la tua pratica è stata inviata con successo !</p>
    </div>
    <div style="text-align: center; width: 600px; margin:  0 auto;">
        <p style="margin-bottom: 25px;">Puoi scaricare ora la ricevuta :</p>
        <div style="text-align: center; width: 600px; float:right; padding: 20px;font-size: 16px; margin-right: -110px; margin-top: 30px;  margin-bottom: 30px;  background: rgb(2,0,36);background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,186,37,1) 0%, rgba(254,244,224,1) 100%);
">
            <p style="margin-bottom: 0;margin-top: 0;color: #000;">(<a href="<?= Html::encode($url) ?>"
                                                                       style="color: #000; text-decoration: none;">
                    RICEVUTA</a> )</p>
        </div>
        <div style="text-align: center; width: 600px;float: left;">
            <p style="color: #fc8423;margin-bottom: 25px; font-weight: bold;">Non dimenticare per qualsiasi evento
                da
                comunicare
                HAI DISPONIBILE NASPI COM nel sito web !</p>
            <p style="margin-bottom: 0;color: #ffba25; font-weight: bold;">EVENTI DA COMUNICARE
            </p>
            <p style="margin-top: 0;">Informazioni integrative alla domanda<br/>
                Nuova attività lavorativa di tipo autonomo (entro 30g)<br/>
                Nuova attività lavorativa di tipo subordinato<br/>
                Espatrio<br/>
                Maternità<br/>
                Malattia<br/>
                Ricovero ospedaliero<br/>
                Presentazione domanda di pensione<br/>
                Servizio civile
            </p>
            <p style="margin-bottom: 25px;">Per qualsiasi info o supporto puoi contattarci tramite email
                <a href="" style="color: #fc8423; text-decoration: none; font-style: italic;">
                    naspionline@gmail.com </a>
                o richiedere un ricontatto telefonico al tuo recapito !
            </p>
        </div>
    </div>
</div>
<p
        style="margin-bottom: 25px; text-decoration: none; font-size: 22px; margin-top: 20px; text-align: center; font-weight: bold; font-family: 'Roboto', sans-serif;">
    Arrivederci alla
    prossima NASPI ;) </p>