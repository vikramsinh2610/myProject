<?php

/** @var yii\web\View $this */

/** @var string $content */

use app\assets\AdminAsset;
use app\widgets\Alert;
use yii\helpers\Html;

AdminAsset::register($this);
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
    <?php $this->head() ?>
</head>
<body class="g-sidenav-show  bg-gray-200">
<?php $this->beginBody() ?>

<?= Alert::widget() ?>
<?= $content ?>

</div>
<!-- End Contact Area -->

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
