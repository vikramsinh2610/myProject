<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat class="bg-white text-primary p-centered-container">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationQuestion.title') }}</div>
        <div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5"
              v-model="form._id"
              type="text"
              :label="$t('configurationQuestion.id')"
              :error-message="$t('configurationQuestion.errorLabel')"
              :error="$v.form._id.$error"
              @blur="$v.form._id.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-ma-lg">
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.multiple"
              :label="$t('configurationQuestion.multiple')"
            />
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.dontCopy"
              :label="$t('configurationQuestion.dontCopy')"
            />
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.multipleObligatory"
              :label="$t('configurationQuestion.multipleObligatory')"
            />
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.multipleQuestion"
              :label="$t('configurationQuestion.multipleQuestion')"
            />
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.required"
              :label="$t('configurationQuestion.requiredQuestion')"
            />
          </div>

          <q-table
            :title="$t(`configurationQuestion.text`)"
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
                  v-if="col.field === '_id'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  v-model="props.row[col.field]"
                  :options="typeList"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="false"
                />
                <q-input
                  v-if="col.field === 'text'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="$v.tableData.$error"
                  @blur="$v.tableData.$touch"
                />
                <q-input
                  v-if="col.field === 'description'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  type="textarea"
                  rows="1"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="$v.tableData.$error"
                  @blur="$v.tableData.$touch"
                />
                <q-select
                  v-if="col.field === 'section'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  v-model="props.row[col.field]"
                  :options="sectionList"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="false"
                />
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

          <q-table
            :title="$t(`configurationQuestion.responses`)"
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableDataResponses"
            :columns="columnsResponses"
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
                  v-if="col.field === '_idValue'"
                  class="table-input"
                  v-model="props.row[col.field]"
                  :options="bucketList"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="false"
                />
                <q-select
                  v-if="col.field === '_type'"
                  class="table-input"
                  v-model="props.row[col.field]"
                  :options="responseTypeList"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="false"
                />
                <q-input
                  v-if="
                    col.field !== '_idValue' &&
                    col.field !== '_type' &&
                    col.field !== '_id' &&
                    col.field !== 'text'
                  "
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="false"
                />
                <q-input
                  v-if="col.field === '_id' || col.field === 'text'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                  :error="$v.tableDataResponses.$error"
                  @blur="$v.tableDataResponses.$touch"
                />
              </q-td>
              <q-td>
                <div class="row items-center" style="min-width: 100px">
                  <div class="column">
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-up"
                      @click.stop="moveRowUpResponse(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDownResponse(props.row)"
                    />
                  </div>
                  <q-btn
                    round
                    dense
                    flat
                    icon="fas fa-times"
                    @click.stop="removeRowResponse(props.row)"
                  />
                  <q-btn
                    round
                    dense
                    flat
                    icon="fas fa-copy"
                    @click.stop="duplicateRow(props.row)"
                  />
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
                @click="addRowResponse"
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
import { required, minLength } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';
import arrayMove from 'array-move';

export default {
  name: 'ConfigurationSurveyQuestionsDetail',
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
      responseTypeList: [
        { label: 'Selezione', value: 'selection' },
        { label: 'Testo libero', value: 'free-text' },
        { label: 'Data', value: 'date' },
        { label: 'Percentuale', value: 'percentage' },
        { label: 'Euro', value: 'euro' },
        { label: 'Numero', value: 'number' },
        { label: 'Allegati', value: 'attachment' },
        { label: 'Codice fiscale', value: 'fiscal-code' },
        { label: 'Partita iva', value: 'vat' },
        { label: 'Regime di tassazione', value: 'tax-regime' },
        { label: 'Livello', value: 'level' },
        { label: 'Ruolo Proposto', value: 'offer-role' },
        { label: 'IBAN', value: 'iban' },
        { label: 'Anagrafica', value: 'person' },
      ],
      columns: [
        {
          name: '_id',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.idText`),
          align: 'left',
          field: '_id',
          length: '250',
        },
        {
          name: 'text',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.text`),
          align: 'left',
          field: 'text',
          length: '400',
        },
        {
          name: 'description',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.description`),
          align: 'left',
          field: 'description',
          length: '400',
        },
        {
          name: 'section',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.section`),
          align: 'left',
          field: 'section',
          length: '250',
        },
      ],
      columnsResponses: [
        {
          name: '_id',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.idResponse`),
          align: 'left',
          field: '_id',
          length: '150',
        },
        {
          name: 'text',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.textResponse`),
          align: 'left',
          field: 'text',
          length: '150',
        },
        {
          name: '_type',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.typeResponse`),
          align: 'left',
          field: '_type',
          length: '100',
        },
        {
          name: 'typeText',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.typeText`),
          align: 'left',
          field: 'typeText',
          length: '100',
        },
        {
          name: 'relatedUserField',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.relatedUserField`),
          align: 'left',
          field: 'relatedUserField',
          length: '100',
        },
        {
          name: '_idValue',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.idValue`),
          align: 'left',
          field: '_idValue',
          length: '100',
        },
        {
          name: 'points',
          currency: 'number',
          required: true,
          label: this.$t(`configurationQuestion.points`),
          align: 'left',
          field: 'points',
          length: '50',
        },
        {
          name: 'reason',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.reason`),
          align: 'left',
          field: 'reason',
          length: '150',
        },
        {
          name: 'conditionedQuestionId',
          currency: 'text',
          required: true,
          label: this.$t(`configurationQuestion.conditionedQuestionId`),
          align: 'left',
          field: 'conditionedQuestionId',
          length: '100',
        },
      ],
      tableData: [],
      tableDataResponses: [],
      form: {
        multiple: false,
        multipleObligatory: false,
        multipleQuestion: false,
        dontCopy: false,
        required: false,
        _id: this.$route.params.id,
      },
    };
  },
  computed: {
    ...mapState({
      question: (state) => state.configuration.question,
      sections: (state) => state.configuration.sections,
      buckets: (state) => state.configuration.buckets,
      types: (state) => state.configuration.types,
      isFetching: (state) => state.error.isFetching,
    }),
    isFieldNotEmpty(field) {
      return field !== undefined && field.length > 1;
    },
  },
  mounted() {
    this.resetQuestion();
    if (this.$route.params.id !== 'new-question') this.fetchQuestion(this.$route.params.id);
  },
  validations: {
    form: {
      _id: {
        required,
        minLength: minLength(3),
      },
    },
    tableData: {
      $each: {
        text: {
          required,
          minLength: minLength(3),
        },
      },
    },
    tableDataResponses: {
      $each: {
        _id: {
          required,
          minLength: minLength(3),
        },
        text: {
          required,
          minLength: minLength(3),
        },
      },
    },
  },
  watch: {
    'form._id': {
      handler() {
        this.form._id = this.form._id.toLowerCase();
      },
    },
    sections: {
      immediate: true,
      handler(sections) {
        this.sectionList = sections.map((el) => ({
          label: el.description,
          value: el._id,
        }));
      },
    },
    types: {
      immediate: true,
      handler(types) {
        this.typeList = types.map((el) => ({
          label: el.description,
          value: el._id,
        }));
      },
    },
    buckets: {
      immediate: true,
      handler(buckets) {
        this.bucketList = buckets.map((el) => ({
          label: el.description,
          value: el._id,
        }));
      },
    },
    question: {
      immediate: true,
      // eslint-disable-next-line sonarjs/cognitive-complexity
      handler(question) {
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'question', question);
        if (!question.texts || !question.responses) return;

        this.form._id = question._id;
        this.form.multiple = question.multiple;
        this.form.multipleObligatory = question.multipleObligatory;
        this.form.multipleQuestion = question.multipleQuestion;
        this.form.dontCopy = question.dontCopy;
        this.form.required = question.required ?? false;

        this.tableData = [];
        question.texts.forEach((cb) => {
          const type = this.types.find((el) => el._id === cb._id);
          const section = this.sections.find((el) => el._id === cb.section) || {
            label: 'Altro',
            value: 'other',
          };
          const rowColumn = {
            _id: { label: type ? type.description : 'Non trovato', value: cb._id },
            text: cb.text,
            description: cb.description,
            section: {
              value: cb.section,
              label: section ? section.description : 'Non trovata',
            },
          };
          this.tableData.push(rowColumn);
        });

        this.tableDataResponses = [];
        question.responses.forEach((response) => {
          response.values.forEach((value) => {
            const bucket = this.buckets.find((el) => el._id === value._id);
            const responseType = this.responseTypeList.find((el) => el.value === response.type) || {
              label: 'Selezione',
              value: 'selection',
            };
            const rowColumn = {
              _id: response._id,
              text: response.text,
              _type: {
                label: responseType.label,
                value: responseType.value,
              },
              typeText: response.typeText ? response.typeText : undefined,
              typeValue: response.typeValue ? response.typeValue : undefined,
              relatedUserField: response.relatedUserField ? response.relatedUserField : undefined,
              _idValue: { label: bucket ? bucket.description : 'Non trovato', value: value._id },
              points: value.points,
              reason: value.reason,
              conditionedQuestionId: value.conditionedQuestionId,
            };
            this.tableDataResponses.push(rowColumn);
          });
        });
      },
    },
  },
  methods: {
    ...mapActions({
      fetchQuestion: 'configuration/fetchQuestion',
      saveQuestion: 'configuration/saveQuestion',
      deleteQuestion: 'configuration/deleteQuestion',
    }),
    ...mapMutations({
      resetQuestion: 'configuration/resetQuestion',
    }),
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
        _id: { label: 'Generico', value: 'default' },
        text: '',
        description: '',
        section: { label: 'Altro', value: 'other' },
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
    duplicateRow(row) {
      this.$utils.logobj('QUESTIONS-DETAIL', 'duplicateRow', row);
      this.tableDataResponses.push({ ...row });
    },
    addRowResponse() {
      const rowBonus = {
        _id: 'default',
        text: '',
        _type: { label: 'Selezione', value: 'selection' },
        typeText: '',
        typeValue: undefined,
        _idValue: { label: 'Generico', value: 'default' },
        points: 0,
        reason: '',
        conditionedQuestionId: '',
      };
      this.tableDataResponses.push(rowBonus);
    },
    removeRowResponse(row) {
      const position = this.tableDataResponses.indexOf(row);
      if (this.tableDataResponses.length > 1) {
        this.tableDataResponses.splice(position, 1);
      }
    },
    moveRowUpResponse(row) {
      const position = this.tableDataResponses.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataResponses, position, position - 1);
      }
    },
    moveRowDownResponse(row) {
      const position = this.tableDataResponses.indexOf(row);
      if (position < this.tableDataResponses.length - 1) {
        arrayMove.mutate(this.tableDataResponses, position, position + 1);
      }
    },
    submit() {
      this.$v.form.$touch();
      this.$v.tableData.$touch();
      this.$v.tableDataResponses.$touch();
      if (!this.$v.form.$error && !this.$v.tableData.$error && !this.$v.tableDataResponses.$error) {
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'submit product conf', this.form);

        const changedTexts = [];
        this.tableData.forEach((row) => {
          const rowText = {
            _id: row._id.value,
            text: row.text,
            description: row.description,
            section: row.section.value,
          };
          changedTexts.push(rowText);
        });

        const changedResponses = [];
        const responsesMap = new Map();
        this.tableDataResponses.forEach((row) => {
          let thisResponse = responsesMap.get(row._id);
          if (!thisResponse) {
            thisResponse = {
              _id: row._id,
              text: row.text,
              type: row._type.value,
              typeText: row.typeText,
              typeValue: row.typeValue,
              relatedUserField: row.relatedUserField,
              selected: false,
              values: [],
            };
            responsesMap.set(row._id, thisResponse);
            changedResponses.push(thisResponse);
          }
          const rowValue = {
            _id: row._idValue.value,
            points: Math.trunc(row.points),
            reason: row.reason,
            conditionedQuestionId: row.conditionedQuestionId,
          };
          thisResponse.values.push(rowValue);
        });
        this.$utils.logobj('QUESTIONS-DETAIL', 'submit question all response', changedResponses);

        const changedQuestion = {
          ...this.question,
          _id: this.form._id,
          multiple: this.form.multiple,
          multipleObligatory: this.form.multipleObligatory,
          multipleQuestion: this.form.multipleQuestion,
          dontCopy: this.form.dontCopy,
          required: this.form.required,
          texts: changedTexts,
          responses: changedResponses,
        };
        this.saveQuestion({ body: changedQuestion }).then(() => {
          this.$q.notify({
            message: this.$t('configurationQuestion.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
        });
      } else {
        this.$q.notify(this.$t('configurationQuestion.cantSave'));
      }
    },
    cancel() {
      this.$utils.logobj('CONFIGURATION-QUESTIONS-DETAIL', 'delete question', this.form._id);
      this.$q
        .dialog({
          title: this.$t('default.titleDeleteDialog'),
          message: this.$t('default.msgDeleteDialog'),
          ok: this.$t('default.okDeleteDialog'),
        })
        .onOk(() => {
          this.deleteQuestion(this.form._id).then(() => {
            this.$q.notify({
              message: this.$t('configurationQuestion.deleteOk'),
              color: 'secondary',
              timeout: 300,
            });
            this.$router.push('/configuration/questions');
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
