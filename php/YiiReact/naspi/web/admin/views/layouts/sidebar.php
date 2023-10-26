<?php

use yii\widgets\Menu;

?>
<aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark bg-white"
       id="sidenav-main">
    <div class="sidenav-header">
        <i class="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
           aria-hidden="true" id="iconSidenav"></i>
        <a class="navbar-brand m-0" href="/"
           target="_blank">
            <span class="ms-1 font-weight-bold text-white">Naspi Online</span>
        </a>
    </div>
    <hr class="horizontal light mt-0 mb-2">
    <div class="w-auto" id="sidenav-collapse-main">
        <?= Menu::widget(
            [
                'items' => [
                    [
                        'label' => '<div class="text-white"><div class="nav-link text-white">
                                            <i class="ri-dashboard-line opacity-10"></i>
                                           <span class="nav-link-text ms-1">Dashboard</span></div></div>',
                        'url' => ['/admin/site/index'],
                    ],
                    [
                        'label' => '<div class="text-white"><div class="nav-link text-white">
                                            <i class="ri-folder-open-fill opacity-10"></i>
                                           <span class="nav-link-text ms-1">Pratiche</span></div></div>',
                        'url' => ['/admin/naspi/index'],
                    ],
                    [
                        'label' => '<div class="text-white"><div class="nav-link text-white">
                                            <i class="ri-user-search-fill opacity-10"></i>
                                           <span class="nav-link-text ms-1">Utenti</span></div></div>',
                        'url' => ['/admin/user/index'],
                    ],
                    [
                        'label' => 'Login',
                        'url' => ['/admin/site/login'],
                        'visible' => Yii::$app->user->isGuest
                    ],
                    [
                        'label' => \yii\helpers\Html::a(
                            '<div class="text-white"><div class="nav-link text-white">
                                    <i class="ri-logout-box-line opacity-10"></i>
                               <span class="nav-link-text ms-1">Logout</span></div></div>',
                            ['/admin/site/logout'],
                            ['data-method' => 'post']
                        )
                    ]
                ],
                'encodeLabels' => false,
                'options' => ['class' => 'navbar-nav'], // set this to nav-tab to get tab-styled navigation
            ]
        );
        ?>
    </div>
</aside>