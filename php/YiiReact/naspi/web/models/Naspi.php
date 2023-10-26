<?php

namespace app\models;

use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "naspi".
 *
 * @property int         $id
 * @property int         $client_id
 * @property int         $status
 * @property string      $home_address
 * @property string      $home_city
 * @property string      $home_cap
 * @property string      $home_province
 * @property int         $marital_status
 * @property string|null $marital_date
 * @property string|null $iban
 * @property string|null $last_work_date
 * @property string|null $vat
 * @property int|null    $income
 * @property string|null $info
 * @property string      $document_file_front
 * @property string|null $document_file_rear
 * @property string      $code_file_front
 * @property string|null $anf
 * @property string|null $more_works
 * @property int|null    $payment_method
 * @property string|null $code_file_rear
 * @property string      $pay_file
 * @property string|null $work_file
 * @property string|null $more_file
 * @property string      $indt
 * @property string      $inuser
 * @property string      $updt
 * @property string      $upuser
 * @property int|null    $activity_type
 * @property string|null $activity_date
 * @property string|null $activity_name
 * @property string|null $protocol_date
 * @property string|null $protocol
 *
 * @property Client      $client
 */
class Naspi extends ActiveRecord {

    const STATUS_NEW = 1;               #-> Blue
    const STATUS_IN_PROGRESS = 2;       #-> Arancio
    const STATUS_TO_SIGN = 3;           #-> Rosso
    const STATUS_WAITING_RECIEPT = 4;   #-> Verde
    const STATUS_COMPLETED = 5;         #-> Grigio

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'naspi';
    }

    /**
     * Gets list of status
     *
     * @return array
     */
    public static function getStatusList() {
        return [
            self::STATUS_NEW => "NUOVA",
            self::STATUS_IN_PROGRESS => "IN LAVORAZIONE",
            self::STATUS_TO_SIGN => "DA FIRMARE",
            self::STATUS_COMPLETED => "COMPLETATA"
        ];
    }

    /**
     * Gets list of status
     *
     * @return self
     */
    public static function findIdentity($id): ?self {
        return self::findOne(['id' => $id]);
    }

    /**
     * Gets list of status
     *
     * @return self
     */
    public static function findByUserId($userId): ?self {
        return self::find()
            ->where(['client_id' => $userId])
            ->andFilterWhere(['!=', 'status', Naspi::STATUS_COMPLETED])
            ->one();
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            /** [['id', 'client_id', 'home_address', 'home_city', 'home_cap', 'home_province', 'marital_status', 'document_file_front', 'code_file_front', 'pay_file', 'inuser', 'updt', 'upuser'], 'required'], */
            [['id', 'client_id', 'status', 'marital_status', 'income','payment_method','anf','more_works','activity_type'], 'integer'],
            [['marital_date', 'last_work_date', 'indt', 'updt','activity_date','protocol_date'], 'safe'],
            [['info','protocol','activity_name'], 'string'],
            [['address', 'home_address', 'document_file_front', 'document_file_rear', 'code_file_front', 'code_file_rear', 'pay_file', 'work_file', 'more_file'], 'string', 'max' => 100],
            [['address', 'home_address'], 'string', 'min' => 4],
            [['inuser', 'upuser', 'city', 'home_city'], 'string', 'max' => 50],
            // [['cap', 'home_cap'], 'digit', 'max' => 5],
            [['cap', 'home_cap'], 'only5Digits'],
            [['province', 'home_province'], 'string', 'max' => 2, 'min' => 2],
            [['iban'], 'string', 'max' => 30],
            [['vat'], 'string', 'max' => 15],
            [['id'], 'unique'],
            [['client_id'], 'exist', 'skipOnError' => true, 'targetClass' => Client::className(
            ), 'targetAttribute' => ['client_id' => 'user_id']],

            [['document_file_front'], 'default', 'value' => 'x'],
            [['document_file_rear'], 'default', 'value' => 'x'],
            [['code_file_front'], 'default', 'value' => 'x'],
            [['code_file_rear'], 'default', 'value' => 'x'],
            [['pay_file'], 'default', 'value' => 'x'],
            [['work_file'], 'default', 'value' => 'x'],
            [['more_file'], 'default', 'value' => 'x'],
            [['inuser'], 'default', 'value' => 'x'],
            [['upuser'], 'default', 'value' => 'x'],
        ];
    }

    public function only5Digits($attribute) {
        if (!preg_match('/^[0-9]{5}$/', $this->$attribute)) {
            $this->addError($attribute, 'Cap must contain exactly 5 digits.');
        }
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'client_id' => 'Client ID',
            'status' => 'Status',
            'city' => 'City',
            'home_address' => 'Home Address',
            'home_city' => 'Home City',
            'home_cap' => 'Home Cap',
            'home_province' => 'Home Province',
            'marital_status' => 'Marital Status',
            'marital_date' => 'Marital Date',
            'iban' => 'Iban',
            'last_work_date' => 'Last Work Date',
            'vat' => 'Vat',
            'income' => 'Income',
            'info' => 'Info',
            'document_file_front' => 'Document File Front',
            'document_file_rear' => 'Document File Rear',
            'code_file_front' => 'Code File Front',
            'code_file_rear' => 'Code File Rear',
            'pay_file' => 'Pay File',
            'work_file' => 'Work File',
            'more_file' => 'More File',
            'indt' => 'Indt',
            'inuser' => 'Inuser',
            'updt' => 'Updt',
            'upuser' => 'Upuser',
        ];
    }

    /**
     * Gets query for [[Client]].
     *
     * @return ActiveQuery
     */
    public function getClient() {
        return $this->hasOne(Client::className(), ['user_id' => 'client_id']);
    }

    /**
     * Set status
     *
     * @return self
     */
    public function setStatus(int $status): self {
        $this->status = $status;
        $this->updt = date('Y-m-d');
        $this->upuser = Yii::$app->getUser()->getIdentity()->username;
        return $this;
    }
}