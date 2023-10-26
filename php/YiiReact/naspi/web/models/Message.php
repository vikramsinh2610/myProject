<?php

namespace app\models;

use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "message".
 *
 * @property int    $id
 * @property int    $naspi_id
 * @property int    $direction
 * @property string $content
 */
class Message extends ActiveRecord {
    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'message';
    }

    /**
     * Gets query for [[Naspi]].
     *
     * @return ActiveQuery
     */
    public static function findByNaspi($id) {
        return self::find()->where(['naspi_id' => $id])->all();
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['naspi_id', 'content'], 'required'],
            [['naspi_id', 'direction'], 'integer'],
            [['content'], 'string', 'max' => 150],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'naspi_id' => 'Naspi ID',
            'direction' => 'Direction',
            'content' => 'Content',
        ];
    }
}
