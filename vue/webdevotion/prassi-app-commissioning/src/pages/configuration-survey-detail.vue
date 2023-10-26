<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat class="bg-white text-primary">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationSurvey.title') }}</div>
        <div>
          <div class="row justify-between q-my-xs">
            <q-select class="col-5" v-model="form.type" :options="typeList" />
            <q-input
              class="col-5"
              v-model="form.creationDate"
              readonly
              mask="##-##-####"
              :label="$t('configurationSurvey.date')"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="form.networkEnterDate"
                      mask="DD-MM-YYYY"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <q-table
            :title="$t(`configurationSurvey.questions`)"
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableData"
            :columns="columns"
            row-key="name"
          >
            <q-tr slot="header" slot-scope="props" :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <div>
                  {{ col.label }}
                </div>
              </q-th>
            </q-tr>

            <q-tr slot="body" slot-scope="props" :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <q-select
                  v-if="col.field === 'questionId'"
                  v-model="props.row[col.field]"
                  use-input
                  clearable
                  :options="questionsBaseList"
                  @filter="filterFn"
                />
                <q-item
                  v-if="col.field === 'questionLink'"
                  link
                  exact
                  :to="`/configuration/questions/${
                    props.row['questionId'] ? props.row['questionId'].value : ''
                  }`"
                >
                  <q-item-section>{{ $t('default.questionsLink') }}</q-item-section>
                </q-item>
              </q-td>
              <q-td>
                <div class="row items-center" style="min-width: 60px">
                  <div class="column">
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-up"
                      @click.stop="moveRowUp(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDown(props.row)"
                    />
                  </div>
                  <q-btn round dense flat icon="fas fa-times" @click.stop="removeRow(props.row)" />
                </div>
              </q-td>
            </q-tr>

            <!--eslint-disable-next-line vue/no-unused-vars-->
            <div slot="bottom" slot-scope="props" class="row fit">
              <q-btn
                rounded
                flat
                icon="fa fa-plus"
                class="p-btn-icon block"
                color="secondary"
                text-color="secondary"
                :label="$t('configurationProduct.addRow')"
                @click="addRow"
              />
            </div>
          </q-table>
        </div>
        <prassi-standard-button
          class="q-mb-lg"
          color="red"
          :loading="isFetching"
          :label="$t('configurationProduct.delete')"
          @click="cancel"
        />
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationProduct.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from 'quasar';
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';
import arrayMove from 'array-move';

export default {
  name: 'ConfigurationSurveyDetail',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      sectionList: [],
      typeList: [],
      bucketList: [],
      questionsBaseList: [],
      columns: [
        {
          name: 'questionId',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.idQuestion`),
          align: 'left',
          field: 'questionId',
          length: '250',
        },
        {
          name: 'questionLink',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.idQuestionLink`),
          align: 'left',
          field: 'questionLink',
          length: '250',
        },
      ],
      tableData: [
        {
          questionId: {
            label: 'void',
            value: 'void',
          },
        },
      ],
      form: {
        creationDate: date.formatDate(Date.now(), 'DD-MM-YYYY'),
        type: {
          label: 'Generico',
          value: 'default',
        },
        _id: this.$route.params.id ? this.$route.params.id : undefined,
      },
    };
  },
  computed: {
    ...mapState({
      questions: (state) => state.configuration.questions.items,
      survey: (state) => state.configuration.survey,
      types: (state) => state.configuration.types,
      isFetching: (state) => state.error.isFetching,
    }),
    questionList() {
      return this.questions.map((el) => ({
        label: el._id,
        value: el._id,
      }));
    },
  },
  mounted() {
    this.resetSurvey();
    if (this.$route.params.id !== 'new-survey') this.fetchSurvey(this.$route.params.id);
  },
  validations: {
    form: {
      type: {
        required,
      },
    },
  },
  watch: {
    types: {
      immediate: true,
      handler(types) {
        this.$utils.logobj('CONFIGURATION-SURVEY-DETAIL', 'types', types);
        this.typeList = types.map((el) => ({
          label: el.description,
          value: el._id,
        }));
      },
    },
    survey: {
      immediate: false,
      handler(survey) {
        this.$utils.logobj('CONFIGURATION-SURVEY-DETAIL', 'survey', survey);

        this.fetchAllQuestions().then(() => {
          if (!survey.questions) return;
          this.form._id = survey._id;
          this.form.creationDate = date.formatDate(survey.creationDate, 'DD-MM-YYYY');

          const type = this.types.find((el) => el._id === survey.type);
          this.$utils.logobj('CONFIGURATION-SURVEY-DETAIL', 'type', type);
          this.form.type = type
            ? {
                label: type.description,
                value: type._id,
              }
            : {
                label: 'Generico',
                value: 'default',
              };

          this.tableData = [];
          const ids = new Set(this.survey.questions.map((el) => el._id));
          this.questionsBaseList = this.questions
            .filter((el) => !ids.has(el._id))
            .map((el) => ({
              label: el._id,
              value: el._id,
            }));

          survey.questions.forEach((cb) => {
            const questionSelected = this.questionList.find((el) => cb._id === el.value);
            const rowOptions = {
              questionId: {
                label: questionSelected ? questionSelected.label : cb._id,
                value: cb._id,
              },
            };
            this.tableData.push(rowOptions);
          });

          if (this.tableData.length === 0 || this.$route.params.id === 'new-survey') {
            this.tableData = [
              {
                questionId: {
                  label: 'void',
                  value: 'void',
                },
              },
            ];
          }
        });
      },
    },
  },
  methods: {
    ...mapActions({
      fetchAllQuestions: 'configuration/fetchAllQuestions',
      fetchSurvey: 'configuration/fetchSurvey',
      saveSurvey: 'configuration/saveSurvey',
      deleteSurvey: 'configuration/deleteSurvey',
    }),
    ...mapMutations({
      resetSurvey: 'configuration/resetSurvey',
    }),
    filterFn(value, update) {
      const ids = new Set(this.tableData.map((el) => (el.questionId ? el.questionId.value : '')));

      const thisQuestionsBaseList = this.questions
        .filter((el) => !ids.has(el._id))
        .map((el) => ({
          label: el._id,
          value: el._id,
        }));

      if (value === '') {
        update(() => {
          this.questionsBaseList = thisQuestionsBaseList;
        });
        return;
      }

      update(() => {
        const needle = value.toLowerCase();
        this.questionsBaseList = thisQuestionsBaseList.filter((v) =>
          v.value.toLowerCase().includes(needle),
        );
      });
    },
    computeCurrencySymbol(symbol) {
      switch (symbol) {
        case 'currency':
          return '€';
        case 'percentage':
          return '%';
        default:
          return '';
      }
    },
    addRow() {
      const rowBonus = {
        questionId: { label: 'void', value: 'void' },
        text: '',
      };
      this.tableData.push(rowBonus);
    },
    removeRow(row) {
      const position = this.tableData.indexOf(row);
      if (this.tableData.length > 1) {
        this.tableData.splice(position, 1);
      }
    },
    moveRowUp(row) {
      const position = this.tableData.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableData, position, position - 1);
      }
    },
    moveRowDown(row) {
      const position = this.tableData.indexOf(row);
      if (position < this.tableData.length - 1) {
        arrayMove.mutate(this.tableData, position, position + 1);
      }
    },
    submit() {
      this.$v.form.$touch();
      const voidQuestion = this.tableData.find((el) => el.questionId.value === 'void');
      if (!this.$v.form.$error && !voidQuestion) {
        this.$utils.logobj('CONFIGURATION-SURVEY-DETAIL', 'submit survey conf', this.form);

        const changedQuestions = [];
        this.tableData.forEach((row) => {
          const questionRowSelected = this.questions.find((el) => row.questionId.value === el._id);
          changedQuestions.push(questionRowSelected);
        });

        delete this.survey._id;
        const changedSurvey = {
          ...this.survey,
          ...(this.form._id ? { _id: this.form._id } : {}),
          type: this.form.type.value,
          questions: changedQuestions,
        };
        this.$utils.logobj('CONFIGURATION-QUESTIONS-DETAIL', 'submit survey', this.form._id);
        this.$utils.logobj('CONFIGURATION-QUESTIONS-DETAIL', 'submit survey', changedSurvey);
        this.saveSurvey({ body: changedSurvey }).then(() => {
          this.$q.notify({
            message: this.$t('configurationSurvey.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.$router.replace('/configuration/surveys');
        });
      } else {
        this.$q.notify(this.$t('configurationSurvey.cantSave'));
      }
    },
    cancel() {
      this.$utils.logobj('CONFIGURATION-QUESTIONS-DETAIL', 'delete survey', this.form._id);
      this.$q
        .dialog({
          title: this.$t('default.titleDeleteDialog'),
          message: this.$t('default.msgDeleteDialog'),
          ok: this.$t('attachment.okDeleteDialog'),
        })
        .onOk(() => {
          this.deleteSurvey(this.form._id).then(() => {
            this.$q.notify({
              message: this.$t('configurationSurvey.deleteOk'),
              color: 'secondary',
              timeout: 300,
            });
            this.$router.push('/configuration/surveys');
          });
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 660px
  max-width 1100px
.q-card
  border-radius 2px
  border solid 2px $card-border
  min-height 280px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
</style>
