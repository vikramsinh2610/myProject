<?php

namespace app\models\searchs;

use app\models\User;
use yii\base\Model;
use yii\data\ActiveDataProvider;

/**
 * UserSearch represents the model behind the search form of `app\models\User`.
 */
class UserSearch extends User {
    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['id', 'group', 'reset_count', 'status'], 'integer'],
            [['username', 'password', 'email', 'auth_key', 'last_reset', 'password_reset_token', 'indt', 'updt'], 'safe'],
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
        $query = User::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider(
            [
                'query' => $query,
            ]
        );

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere(
            [
                'id' => $this->id,
                'group' => $this->group,
                'last_reset' => $this->last_reset,
                'reset_count' => $this->reset_count,
                'indt' => $this->indt,
                'updt' => $this->updt,
            ]
        );

        if (isset($this->status)) {
            $query->andFilterWhere(['status' => $this->status]);
        } else {
            $query->andFilterWhere(['>', 'status', self::STATUS_DELETED]);
        }

        $query->andFilterWhere(['like', 'username', $this->username])
            ->andFilterWhere(['like', 'password', $this->password])
            ->andFilterWhere(['like', 'email', $this->email])
            ->andFilterWhere(['like', 'auth_key', $this->auth_key])
            ->andFilterWhere(['like', 'password_reset_token', $this->password_reset_token]);

        return $dataProvider;
    }
}
