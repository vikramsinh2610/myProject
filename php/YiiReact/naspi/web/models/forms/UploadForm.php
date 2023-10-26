<?php

namespace app\models\forms;

use yii\base\Model;
use yii\web\UploadedFile;

class UploadForm extends Model {
    /**
     * @var UploadedFile
     */
    public $imageFile;

    public function rules() {
        return [
            [['imageFile'], 'file', 'skipOnEmpty' => false, 'extensions' => 'pdf, png, jpg'],
        ];
    }

    public function upload() {
        if ($this->validate()) {
            $this->imageFile->saveAs('uploadsTemp/' . $this->imageFile->baseName . '.' . $this->imageFile->extension);
            return true;
        } else {
            return false;
        }
    }
}