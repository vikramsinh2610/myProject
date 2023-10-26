<?php

namespace app\models\views;

use yii\db\ActiveRecord;

/**
 * This is the model class for view "user_profile".
 *
 * @property int         $id
 * @property string      $username
 * @property string      $name
 * @property string      $surname
 * @property string      $email
 * @property string      $mobile
 * @property int         $group
 * @property int         $status
 * @property string      $indt
 * @property string|null $updt
 * @property string      $fiscal_code
 */
class UserProfile extends ActiveRecord {

    public static function primaryKey() {
        return ['id'];
    }

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'user_profile';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [

        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'User ID',
            'username' => 'Username',
            'name' => 'Name',
            'surname' => 'Surname',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'group' => 'Group',
            'status' => 'Status',
            'indt' => 'Indt',
            'updt' => 'Updt',
            'fiscal_code' => 'Fiscal Code',
        ];
    }

}
