<?php

namespace app\models;

use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "naspi_com".
 *
 * @property int         $id
 * @property int         $naspi_id
 * @property string      $variation
 * @property int         $event
 * @property string      $contract_file
 * @property string|null $more_file
 * @property string      $indt
 * @property string      $inuser
 * @property string      $updt
 * @property string      $upuser
 */
class NaspiCom extends ActiveRecord {
    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'naspi_com';
    }

    /**
     * Gets query for [[naspi_com]].
     *
     * @return ActiveQuery
     */
    public static function findByNaspiCom($id) {
        return self::find()->where(['id' => $id])->all();
    }

    /**
     * Gets list of status
     *
     * @return self
     */
    public static function findIdentity($id): self {
        return self::findOne(['id' => $id]);
    }


    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['naspi_id', 'variation', 'inuser', 'event'], 'required'],
            [['contract_file'], 'string'],
            [['indt', 'updt'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'naspi_id' => 'Naspi ID',
            'variation' => 'Variation',
            'event' => 'Event',
            'contract_file' => 'Contract_file',
            'more_file' => 'More_file'
        ];
    }
}