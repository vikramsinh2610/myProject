<?php

use yii\bootstrap4\Nav;

?>
<!-- Start Header Area -->
<header class="header-area">
    <!-- Start Navbar Area -->
    <div class="navbar-area">
        <div class="mobile-responsive-nav">
            <div class="container">
                <div class="mobile-responsive-menu">
                    <div class="logo">
                        <a href="/">
                            <img src="/images/logo.png" alt="logo">
                        </a>
                    </div>

                    <div class="others-options-for-mobile-devices">
                        <div class="my-account dropdown open">
                            <?= \yii\helpers\Html::a(
                                '<i class="flaticon-user"></i>',
                                ['/site/login']
                            ) ?>
                            <?php if (!Yii::$app->user->isGuest) : ?>
                                <ul class="dropdown-menu">
                                    <li class="nav-item">
                                        <?= \yii\helpers\Html::a(
                                            'Log out',
                                            ['/site/logout'],
                                            ['data-method' => 'post', 'class' => 'nav-link']
                                        ) ?>
                                    </li>
                                </ul>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="desktop-nav">
            <div class="container">
                <nav class="navbar navbar-expand-md navbar-light">
                    <a class="navbar-brand" href="/">
                        <img src="/images/logo.png" alt="logo">
                    </a>

                    <div class="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
                        <?= Nav::widget([
                                            'items' => [
                                                [
                                                    'label' => 'Home',
                                                    'url' => ['/site/index']
                                                ], [
                                                    'label' => 'Pratiche Naspi',
                                                    'items' => [
                                                        [
                                                            'label' => 'Naspi',
                                                            'url' => ['/pratiche/naspi']
                                                        ], [
                                                            'label' => 'Naspi Anticipata',
                                                            'url' => ['/pratiche/naspi-anticipata']
                                                        ], [
                                                            'label' => 'DS Agricola',
                                                            'url' => ['/pratiche/ds-agricola']
                                                        ],
                                                    ]
                                                ], [
                                                    'label' => 'Contatti',
                                                    'url' => ['/site/contatti']
                                                ],
                                            ],
                                            'options' => ['class' => 'navbar-nav m-auto'],
                                        ]);
                        ?>

                        <div class="others-options">
                            <div class="my-account dropdown open">
                                <?= \yii\helpers\Html::a(
                                    '<i class="flaticon-user"></i>',
                                    ['/site/login']
                                ) ?>
                                <?php if (!Yii::$app->user->isGuest) : ?>
                                    <ul class="dropdown-menu">
                                        <li class="nav-item">
                                            <?= \yii\helpers\Html::a(
                                                'Log out',
                                                ['/site/logout'],
                                                ['data-method' => 'post', 'class' => 'nav-link']
                                            ) ?>
                                        </li>
                                    </ul>
                                <?php endif; ?>
                            </div>

                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
    <!-- End Navbar Area -->
</header>
<!-- End Header Area -->
