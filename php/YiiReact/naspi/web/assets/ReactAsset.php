<?php

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Main application asset bundle.
 *
 * @author Daniele Gabrieli <daniele@deplot.xyz>
 * @since  2.0
 */
class ReactAsset extends AssetBundle {
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
    ];
    // public $js = [
    //     'js/bundle.min.js',
    //     'js/vendors.min.js',
    // ];

    public $js = [
        'js/bundle.js',
        'js/vendors.js',
    ];

    public $depends = [
        'app\assets\AppAsset',
    ];
}
