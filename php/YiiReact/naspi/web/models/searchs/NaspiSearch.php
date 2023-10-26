<?php

namespace app\models\searchs;

use app\models\views\Naspi;
use yii\base\Model;
use yii\data\ActiveDataProvider;

/**
 * NaspiSearch represents the model behind the search form of `app\models\views\Naspi`.
 */
class NaspiSearch extends Naspi {
    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['id', 'client_id', 'status', 'marital_status', 'income'], 'integer'],
            [['name', 'surname', 'email', 'fiscal_code', 'address', 'city', 'cap', 'province', 'home_address', 'home_city', 'home_cap', 'home_province', 'marital_date', 'iban', 'last_work_date', 'vat', 'info', 'document_file_front', 'document_file_rear', 'code_file_front', 'code_file_rear', 'pay_file', 'work_file', 'more_file', 'indt', 'inuser', 'updt', 'upuser'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function scenarios() {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params) {
        $query = Naspi::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
                                                   'query' => $query,
                                                   'sort' => ['defaultOrder' => ['id' => SORT_DESC]],

                                               ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
                                   'id' => $this->id,
                                   'client_id' => $this->client_id,
                                   'status' => $this->status,
                                   'marital_status' => $this->marital_status,
                                   'marital_date' => $this->marital_date,
                                   'last_work_date' => $this->last_work_date,
                                   'income' => $this->income,
                                   'indt' => $this->indt,
                                   'updt' => $this->updt,
                               ]);

        $query->andFilterWhere(['like', 'name', $this->name])
            ->andFilterWhere(['like', 'surname', $this->surname])
            ->andFilterWhere(['like', 'email', $this->email])
            ->andFilterWhere(['like', 'fiscal_code', $this->fiscal_code])
            ->andFilterWhere(['like', 'address', $this->address])
            ->andFilterWhere(['like', 'city', $this->city])
            ->andFilterWhere(['like', 'cap', $this->cap])
            ->andFilterWhere(['like', 'province', $this->province])
            ->andFilterWhere(['like', 'home_address', $this->home_address])
            ->andFilterWhere(['like', 'home_city', $this->home_city])
            ->andFilterWhere(['like', 'home_cap', $this->home_cap])
            ->andFilterWhere(['like', 'home_province', $this->home_province])
            ->andFilterWhere(['like', 'iban', $this->iban])
            ->andFilterWhere(['like', 'vat', $this->vat])
            ->andFilterWhere(['like', 'info', $this->info])
            ->andFilterWhere(['like', 'document_file_front', $this->document_file_front])
            ->andFilterWhere(['like', 'document_file_rear', $this->document_file_rear])
            ->andFilterWhere(['like', 'code_file_front', $this->code_file_front])
            ->andFilterWhere(['like', 'code_file_rear', $this->code_file_rear])
            ->andFilterWhere(['like', 'pay_file', $this->pay_file])
            ->andFilterWhere(['like', 'work_file', $this->work_file])
            ->andFilterWhere(['like', 'more_file', $this->more_file])
            ->andFilterWhere(['like', 'inuser', $this->inuser])
            ->andFilterWhere(['like', 'upuser', $this->upuser]);

        return $dataProvider;
    }
}
