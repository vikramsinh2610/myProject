<?php

namespace app\models;

use yii\db\ActiveRecord;

/**
 * This is the model class for table "client".
 *
 * @property int         $user_id
 * @property string      $fiscal_code
 * @property string      $address
 * @property string      $city
 * @property string      $cap
 * @property string      $province
 * @property string      $indt
 * @property string|null $updt
 *
 * @property User        $user
 */
class Client extends ActiveRecord {
    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'client';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['user_id', 'fiscal_code', 'mobile'], 'required'],
            [['user_id'], 'integer'],
            [['indt', 'updt'], 'safe'],
            [['fiscal_code'], 'string', 'max' => 16],
            [['user_id'], 'unique'],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(
            ), 'targetAttribute' => ['user_id' => 'id']],

            [['mobile'], 'match', 'pattern' => '/^(\+[0-9]{2,3})?([. 0-9]{6,17})$/'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'user_id' => 'User ID',
            'fiscal_code' => 'Fiscal Code',
            'mobile' => 'Mobile',
            'address' => 'Address',
            'city' => 'City',
            'cap' => 'Cap',
            'province' => 'Province',
            'indt' => 'Indt',
            'updt' => 'Updt',
        ];
    }

}
