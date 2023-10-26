<?php


namespace app\models\views;

use yii\db\ActiveRecord;

/**
 * This is the model class for table "v_naspi".
 *
 * @property int         $id
 * @property int         $client_id
 * @property string      $name
 * @property string      $surname
 * @property string      $email
 * @property string      $mobile
 * @property string      $fiscal_code
 * @property string      $address
 * @property string      $city
 * @property string      $cap
 * @property string      $province
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
 * @property string|null $code_file_rear
 * @property string      $pay_file
 * @property string|null $work_file
 * @property string|null $more_file
 * @property string      $indt
 * @property string      $inuser
 * @property string      $updt
 * @property string      $upuser
 */
class Naspi extends ActiveRecord
{

    public static function primaryKey()
    {
        return ['id'];
    }

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'v_naspi';
    }

    /**
     * Gets list of status
     *
     * @return self
     */
    public static function findIdentity($id): self
    {
        return self::findOne(['id' => $id]);
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'client_id', 'name', 'surname', 'email', 'fiscal_code', 'address', 'city', 'cap', 'province', 'home_address', 'home_city', 'home_cap', 'home_province', 'marital_status', 'document_file_front', 'code_file_front', 'pay_file', 'inuser', 'updt', 'upuser'], 'required'],
            [['id', 'client_id', 'status', 'marital_status', 'income'], 'integer'],
            [['marital_date', 'last_work_date', 'indt', 'updt'], 'safe'],
            [['info'], 'string'],
            [['name', 'surname', 'email', 'city', 'home_city'], 'string', 'max' => 50],
            [['fiscal_code'], 'string', 'max' => 11],
            [['address', 'home_address', 'document_file_front', 'document_file_rear', 'code_file_front', 'code_file_rear', 'pay_file', 'work_file', 'more_file'], 'string', 'max' => 100],
            [['cap', 'home_cap'], 'string', 'max' => 5],
            [['province', 'home_province'], 'string', 'max' => 2],
            [['iban'], 'string', 'max' => 30],
            [['vat'], 'string', 'max' => 15],
            [['mobile', 'inuser', 'upuser'], 'string', 'max' => 25],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'client_id' => 'Client ID',
            'name' => 'Nome',
            'city' => 'City',
            'surname' => 'Cognome',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'fiscal_code' => 'Fiscal Code',
            'address' => 'Address',
            'city' => 'Città',
            'cap' => 'Cap',
            'province' => 'Provincia',
            'status' => 'Stato',
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
            'indt' => 'Data ins.',
            'inuser' => 'Ins. da',
            'updt' => 'Data agg.',
            'upuser' => 'Agg. da',
        ];
    }
}