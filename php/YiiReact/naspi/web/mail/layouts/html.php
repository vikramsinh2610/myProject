<?php

use yii\helpers\Html;

/** @var \yii\web\View $this view component instance */
/** @var \yii\mail\MessageInterface $message the message being composed */
/** @var string $content main view render result */
?>
<?php $this->beginPage() ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=<?= Yii::$app->charset ?>" />
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>

<body style="background: linear-gradient(to bottom,#e1f7fa, rgba(255,0,0,0), #fff1d3);">
    <div
        style="text-align: center; width: 100%; max-width: 600px; margin:  0 auto;padding: 80px; display: inline-block; position: relative; color:#373171;
font-family: 'Roboto', sans-serif; font-size: 24px; font-weight: bold; background-color: #fff; box-shadow: 0px 0px 15px 0px #eee;"
">
        <div style="width: 100%; margin:0 auto; text-align: center; margin-bottom: 50px;">
            <div style="width: 150px; height: 60px; margin:0 auto; text-align: center;
                background-image: url(https://naspi.online/images/logo.png);
                background-size: cover;"
            >
            </div>
        </div>
        <?php $this->beginBody() ?>
        <?= $content ?>
        <?php $this->endBody() ?>
    </div>
</body>

</html>
<?php $this->endPage() ?>