<?php

/** @var yii\web\View $this */

/** @var string $content */

use app\assets\AppAsset;
use app\widgets\Alert;
use yii\bootstrap4\Html;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
    <!DOCTYPE html>
    <html lang="<?= Yii::$app->language ?>" class="h-100">
    <head>
        <meta charset="<?= Yii::$app->charset ?>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?= Html::csrfMetaTags() ?>
        <title><?= Html::encode($this->title) ?></title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Bootstrap Min CSS -->
        <link rel="stylesheet" href="/css/bootstrap.min.css">
        <!-- Owl Theme Default Min CSS -->
        <link rel="stylesheet" href="/css/owl.theme.default.min.css">
        <!-- Owl Carousel Min CSS -->
        <link rel="stylesheet" href="/css/owl.carousel.min.css">
        <!-- Remixicon CSS -->
        <link rel="stylesheet" href="/css/remixicon.css">
        <!-- Flaticon CSS -->
        <link rel="stylesheet" href="/css/flaticon.css">
        <!-- Meanmenu Min CSS -->
        <link rel="stylesheet" href="/css/meanmenu.min.css">
        <!-- Animate Min CSS -->
        <link rel="stylesheet" href="/css/animate.min.css">
        <!-- Magnific Popup Min CSS -->
        <link rel="stylesheet" href="/css/magnific-popup.min.css">
        <!-- Odometer Min CSS -->
        <link rel="stylesheet" href="/css/odometer.min.css">
        <!-- Style CSS -->
        <link rel="stylesheet" href="/css/style.css">
        <!-- Responsive CSS -->
        <link rel="stylesheet" href="/css/responsive.css">

        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
        <?php $this->head() ?>
    </head>
    <body>
    <?php $this->beginBody() ?>

    <?= $this->render(
        'header.php'
    ) ?>

    <!-- Start Contact Area -->
    <?= Alert::widget() ?>
    <?= $content ?>
    <!-- End Contact Area -->

    <?= $this->render(
        'footer.php'
    ) ?>

    <?= $this->render(
        'copyright.php'
    ) ?>

    <!-- Jquery Min JS -->
    <script src="/js/jquery.min.js"></script>
    <!-- Bootstrap Bundle Min JS -->
    <script src="/js/bootstrap.bundle.min.js"></script>
    <!-- Meanmenu Min JS -->
    <script src="/js/meanmenu.min.js"></script>
    <!-- Owl Carousel Min JS -->
    <script src="/js/owl.carousel.min.js"></script>
    <!-- Owl Carousel Thumbs Min JS -->
    <script src="/js/carousel-thumbs.min.js"></script>
    <!-- Wow Min JS -->
    <script src="/js/wow.min.js"></script>
    <!-- Magnific Popup Min JS -->
    <script src="/js/magnific-popup.min.js"></script>
    <!-- Appear Min JS -->
    <script src="/js/appear.min.js"></script>
    <!-- Odometer Min JS -->
    <script src="/js/odometer.min.js"></script>
    <!-- Progressbar Min JS -->
    <script src="/js/progressbar.min.js"></script>
    <!-- Jarallax Min JS -->
    <script src="/js/jarallax.min.js"></script>
    <!-- Ajaxchimp Min JS -->
    <script src="/js/ajaxchimp.min.js"></script>
    <!-- Custom JS -->
    <script src="/js/custom.js"></script>

    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>
