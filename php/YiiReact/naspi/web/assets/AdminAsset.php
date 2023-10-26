<?php

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Main application asset bundle.
 *
 * @author Daniele Gabrieli <daniele@deplot.xyz>
 * @since  2.0
 */
class AdminAsset extends AssetBundle {
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'admin_assets/css/material-dashboard.min.css',
        'admin_assets/css/admin.style.css',
        'css/remixicon.css',
    ];
    public $js = [
    ];
    public $depends = [
        'app\assets\AppAsset',
    ];
}
