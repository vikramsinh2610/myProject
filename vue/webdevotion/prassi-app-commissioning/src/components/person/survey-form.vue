<template>
  <div class="fill-available row">
    <div class="row no-wrap col-12 q-mr-sm">
      <div style="position: absolute; z-index: 300; background: #fff; display: none">
        {{ JSON.stringify(form, null, 2) }}
      </div>

      <q-stepper
        vertical
        header-nav
        style="width: 260px"
        active-color="secondary"
        v-model="currentSection"
        class="no-shadow q-mr-sm min-w-260"
      >
        <q-step
          v-for="section in groupedSections"
          :key="section._id"
          :name="section._id"
          :title="section.description"
          :class="{
            hidden: !sectionHasActiveQuestions(section),
            [sectionCompletionStatus(section).color]: true,
          }"
          :icon="sectionCompletionStatus(section).icon"
        >
        </q-step>

        <q-step
          v-for="section in signatureSections"
          :key="section._id"
          :name="section._id"
          :title="section.description"
          :class="{
            [signatureSectionCompletionStatus(section).color]: true,
          }"
          :icon="signatureSectionCompletionStatus(section).icon"
        >
        </q-step>
      </q-stepper>

      <q-card inline flat color="white" class="text-primary col q-card q-card--flat no-shadow">
        <q-card-section
          v-for="section in groupedSections"
          :key="section._id"
          :class="{ hidden: currentSection !== section._id }"
        >
          <div class="p-pc-title-section">{{ section.description }}</div>

          <div
            v-for="q in section.questions"
            :key="q._id"
            :class="{ hidden: !isQuestionActive(q), 'question-row': true }"
          >
            <label class="field-title"> {{ q.formField.label }}{{ q.required ? ' *' : '' }} </label>

            <div v-if="q.formField.type === 'option-group'" class="option-group-resize">
              <q-option-group
                v-model="form[q._id]"
                :options="q.formField.options"
                :type="q.formField.multiple ? 'checkbox' : 'radio'"
                :disabled="readonly"
                :required="q.required"
                size="30px"
                color="primary"
              />

              <div v-if="q.formField.additionalText.active" style="margin-top: 0.5em">
                <q-input
                  v-if="responseIncludes(form[q._id], q.formField.additionalText.targetValue)"
                  outlined
                  v-model="form[q.formField.additionalText.targetValue]"
                  :readonly="readonly"
                  :required="q.required"
                  :rules="[validateSpecialChars]"
                />
              </div>
            </div>

            <div v-if="q.formField.type === 'field-group'">
              <div v-for="res in q.formField.fields" :key="res._id">
                <div
                  v-if="
                    [
                      'free-text',
                      'offer-role',
                      'tax-regime',
                      'fiscal-code',
                      'vat',
                      'level',
                      'iban',
                    ].includes(res.type)
                  "
                >
                  <q-input
                    outlined
                    v-model="form[res._id]"
                    :label="res.text"
                    :readonly="readonly"
                    :required="q.required"
                    :error="$v.form[res._id].$error"
                    @blur="$v.form[res._id].$touch"
                  />
                </div>

                <div v-else-if="res.type === 'date'">
                  <q-input
                    class="p-pc-date"
                    v-model="form[q._id]"
                    mask="##-##-####"
                    :label="res.text"
                    :readonly="readonly"
                    :required="q.required"
                    :error="myError(q, $v.form)"
                    @blur="myTouch(q, $v.form)"
                  >
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy2"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="form[q._id]"
                            mask="DD-MM-YYYY"
                            :readonly="readonly"
                            :required="q.required"
                            @input="() => $refs.qDateProxy2.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div v-else-if="res.type === 'number'">
                  <q-input
                    outlined
                    v-model="form[res._id]"
                    type="number"
                    :label="res.text"
                    :readonly="readonly"
                    :required="q.required"
                    :error="$v.form[res._id].$error"
                    @blur="$v.form[res._id].$touch()"
                  />
                </div>

                <div v-else-if="res.type === 'euro'">
                  <q-input
                    outlined
                    v-model="form[res._id]"
                    type="number"
                    :label="res.text"
                    :readonly="readonly"
                    :required="q.required"
                  />
                </div>

                <div v-else-if="res.type === 'percentage'">
                  <q-input
                    outlined
                    v-model="form[res._id]"
                    type="number"
                    :label="res.text"
                    :readonly="readonly"
                    :required="q.required"
                  />
                </div>

                <div v-else-if="res.type === 'selection'">
                  <q-checkbox
                    v-model="form[res._id]"
                    :label="res.text"
                    :disabled="readonly"
                    :required="q.required"
                  />
                </div>

                <div v-else-if="res.type === 'attachment'">
                  <div v-if="!readonly" style="margin-bottom: 2em">
                    <q-uploader
                      class="full-width"
                      ref="uploader"
                      auto-expand
                      hide-upload-button
                      method="PUT"
                      accept=".pdf"
                      :auto-upload="true"
                      :required="q.required"
                      :multiple="false"
                      :label="res.text"
                      :headers="[{ name: 'content-type', value: 'application/pdf' }]"
                      :factory="(file) => getSignedUrl(res, file)"
                      :send-raw="true"
                      @uploaded="(file) => uploaded(res, file)"
                    />
                  </div>

                  <div v-if="(form[res._id] || []).length">
                    <div v-for="attachment in form[res._id] || []" :key="attachment.attachmentId">
                      <prassi-body-list
                        menu
                        menu-delete
                        menu-icon="fa fa-eye"
                        :blocks="attachmentBlock(attachment)"
                        @menuClick="downloadAttachment(attachment.attachmentId)"
                        @deleteClick="removeAttachment(res._id, attachment.attachmentId)"
                      />
                    </div>
                  </div>
                  <div v-else>
                    {{ $t('survey.noAttachment') }}
                  </div>
                </div>

                <div v-else-if="res.type === 'person'">
                  {{ /* :person-id="form[res._id]" all'inizio l'anagrafica poteva essere creata dal form */ }}
                  <div :class="readonly ? 'person-readonly' : ''">
                    <anagrafica-form
                      ref="anagrafica"
                      :person-id="customerId"
                      :required="q.required"
                    />
                  </div>
                </div>

                <div v-else-if="res.type === 'extra-selection'">
                  <q-select
                    use-input
                    fill-input
                    hide-selected
                    input-debounce="0"
                    emit-value
                    v-model="form[res._id]"
                    :label="res.text"
                    :readonly="readonly"
                    :required="q.required"
                    :error="$v.form[res._id].$error"
                    @blur="$v.form[res._id].$touch"
                    :options="res.options"
                    @filter="res.filterFn"
                  />
                </div>

                <div v-else style="color: red; font-weight: bold">
                  Missing field: {{ res.text }} – {{ res.type }}
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; margin-top: 1.5em">
            <prassi-standard-button
              v-if="!isLastSection() && !readonly"
              class="q-mb-lg"
              label="Successivo"
              @click="goToNextSection()"
            />

            <prassi-standard-button
              class="q-mb-lg"
              label="Salva e Chiudi"
              @click="submitSurveyClick"
            />
          </div>
        </q-card-section>

        <div v-if="!isSurveyFilled">
          <p v-if="currentSection.startsWith('sign')" style="margin: 2em 1em">
            Completa il survey per visualizzare la sezione firma digitale.
          </p>
        </div>
        <div v-else>
          <q-card-section key="sign-result" v-if="currentSection == 'sign-result'">
            <inquiry-result
              :form="getQuestionsForCalculatingResults()"
              :store-products-for-survey="survey._id"
            />

            <div style="display: flex; margin-top: 1.5em">
              <prassi-standard-button
                class="q-mb-lg"
                label="Successivo"
                @click="() => (currentSection = 'signature-form')"
              />

              <prassi-standard-button
                class="q-mb-lg"
                label="Salva e Chiudi"
                @click="submitSurveyClick"
              />
            </div>
          </q-card-section>

          <q-card-section key="signature-form" v-if="currentSection == 'signature-form'">
            <inquiry-signature-form :next-callback="() => (currentSection = 'sign-promoter')" />
          </q-card-section>

          <q-card-section key="sign-promoter" v-if="currentSection == 'sign-promoter'">
            <inquiry-sign
              type="promoter"
              :next-callback="() => (currentSection = 'sign-customer')"
            />
          </q-card-section>

          <q-card-section key="sign-customer" v-if="currentSection == 'sign-customer'">
            <inquiry-sign
              type="customer"
              :next-callback="() => (currentSection = 'sign-download')"
            />
          </q-card-section>

          <q-card-section key="sign-download" v-if="currentSection == 'sign-download'">
            <inquiry-download-pdf :next-callback="() => (currentSection = 'signature-promoter')" />
          </q-card-section>
        </div>
        <q-inner-loading :showing="isFetching">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import download from 'getfile-rename-js';
import { required } from 'vuelidate/lib/validators';

import PrassiBodyList from '../base/prassi-body-list';
import AnagraficaForm from './anagrafica-form';
import InquirySign from './inquiry-sign';
import InquirySignatureForm from './inquiry-signature-form';
import InquiryDownloadPdf from './inquiry-download-pdf';
// eslint-disable-next-line import/no-duplicates
import { QUESTION_IDS } from './inquiry-result';
// eslint-disable-next-line import/no-duplicates
import InquiryResult from './inquiry-result';

export default {
  name: 'SurveyForm',

  components: {
    AnagraficaForm,
    InquiryResult,
    InquirySign,
    InquirySignatureForm,
    InquiryDownloadPdf,
    PrassiBodyList,
  },

  data() {
    return {
      form: {},
      groupedSections: [],
      conditionedQuestions: {},
      currentSection: undefined, // section._id
      uploads: {},
      touched: new Set(), // sections that have been touched and should be marked as incomplete
      sectionStatus: {}, // [section._id -> complete | incomplete | empty], updated on click to next section
      isNewSurvey: false,
      signatureSections: [],
    };
  },

  props: {
    sections: {
      type: Array,
      default: () => [],
    },
    survey: {
      type: Object,
      default: undefined,
    },
    saveSurvey: {
      type: Function,
      default: () => {
        throw new Error('`saveSurvey` prop missing');
      },
    },
    submitSurvey: {
      type: Function,
      default: () => {
        throw new Error('`submitSurvey` prop missing');
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    customerId: {
      type: String,
      default: '',
    },
  },

  /* eslint-disable sonarjs/cognitive-complexity */
  async mounted() {
    await this.fetchSurveyExtraQuestions();

    const res = {};
    const conditionedQuestions = {}; // child -> { parent, value }
    const sectionsOrder = []; // section ids, used for sorting

    this.sections.forEach((section) => {
      res[section._id] = { ...section, questions: [] };
    });

    this.survey.questions.forEach((q) => {
      const sectionId = q.texts[0].section;

      // some sections don't exist... set them up as "N/A"
      // should we skip these?
      if (!res[sectionId]) {
        res[sectionId] = {
          _id: sectionId,
          description: `N/A (${sectionId})`,
          questions: [],
        };
      }

      if (!sectionsOrder.includes(sectionId)) {
        sectionsOrder.push(sectionId);
      }

      res[sectionId].questions.push({
        ...q,
        label: q.texts[0].text,
        formField: this.generateFormField(q),
      });

      q.responses.forEach((response) => {
        response.values.forEach((v) => {
          // if (v.conditionedQuestionId) {
          //   conditionedQuestions[v.conditionedQuestionId] = {
          //     parent: q._id,
          //     value: response._id,
          //   };
          // }

          if (v.conditionedQuestionId) {
            const conditionedQuestionIdArray = v.conditionedQuestionId.split(',');
            conditionedQuestionIdArray.forEach((qId) => {
              conditionedQuestions[qId] = {
                parent: q._id,
                value: response._id,
              };
            });
          }
        });
      });
    });

    /* eslint-disable no-unused-vars */
    const sections = Object.entries(res).filter(([_, section]) => section.questions.length > 0);
    const form = {};

    // Init checkbox type questions so that option group component behaves correctly
    // Populate fields that already have a value (when we're dealing with a survey-result)
    /* eslint-disable sonarjs/cognitive-complexity */
    sections.forEach(([_, section]) => {
      section.questions.forEach((q) => {
        if (q.formField.type === 'option-group') {
          const values = [];

          q.formField.options.forEach((option) => {
            if (option.selected) {
              values.push(option.value);
            }

            // for fields with an input type, ie. "altro, specificare"
            if (option.typeValue) {
              form[option.value] = option.typeValue;
            }
          });

          form[q._id] = q.formField.multiple ? values : values[0];
        }

        if (q.formField.type === 'field-group') {
          q.formField.fields.forEach((field) => {
            let value = field.typeValue;

            if (field.type === 'date') {
              if (!value) return;

              value = moment(value).format('DD-MM-YYYY');
              form[q._id] = value;
              return;
            }

            if (field.type === 'selection') {
              form[field._id] = field.selected;
              return;
            }

            form[field._id] = value || '';
          });
        }
      });
    });

    const groupedSections = {};
    let currentSection;
    sectionsOrder.forEach((sectionId) => {
      const [_id, target] = sections.find(([id, section]) => id === sectionId);

      if (!currentSection) currentSection = sectionId;

      groupedSections[sectionId] = target;
    });

    // Set Component state
    this.groupedSections = groupedSections;
    this.currentSection = currentSection;
    this.conditionedQuestions = conditionedQuestions;

    // Make sure form fields are reactive, otherwise validation won't work
    Object.entries(form).forEach(([id, field]) => {
      this.$set(this.form, id, field);
    });

    // if the survey is already saved, force the computation of section status
    // so that icons for steps are shown correctly (warning, success etc.)
    // and the `isSurveyFilled` property is also updated
    this.isNewSurvey = !this.survey.idSurvey;
    this.$nextTick(() => {
      this.computeSectionCompletion(!this.isNewSurvey);
    });

    // Init signature sections
    if (this.isInquriySurvey) {
      this.signatureSections = [
        { description: 'RISULTATO SURVEY', _id: 'sign-result' },
        { description: 'RACCOLTA DATI PER FIRMA DIGITALE', _id: 'signature-form' },
        { description: 'FIRMA DIGITALE (Consulente)', _id: 'sign-promoter' },
        { description: 'FIRMA DIGITALE (Cliente)', _id: 'sign-customer' },
        { description: 'DOWNLOAD PDF FIRMATO', _id: 'sign-download' },
      ];
    }
  },

  validations() {
    const rules = {};
    if (!this.form) return {};

    Object.entries(this.groupedSections).forEach(([_, section]) => {
      section.questions.forEach((q) => {
        const active = this.isQuestionActive(q);

        if (q.formField.type === 'field-group') {
          q.formField.fields.forEach((field) => {
            if (!active) {
              rules[field._id] = {};
              return;
            }

            const validations = this.validationsFor(q._id, field.type);

            if (q.required) {
              validations.required = required;
            }

            if (field.type === 'date') {
              rules[q._id] = validations;
            } else {
              rules[field._id] = validations;
            }
          });
        }
      });
    });

    return { form: rules };
  },

  computed: {
    ...mapState({
      signature: (state) => state.surveys.signature,
      extraQuestions: (state) => state.surveys.extraQuestions,
      isFetching: (state) => state.error.isFetching,
    }),

    isInquriySurvey() {
      return ['inquiry', 'company-inquiry'].includes(this.survey.type);
      // && this.survey.state !== undefined
    },

    isSurveyFilled() {
      return Object.values(this.sectionStatus).every((status) => status === 'complete');
    },
  },

  methods: {
    ...mapActions({
      fetchSurveyExtraQuestions: 'surveys/fetchSurveyExtraQuestions',
    }),

    myTouch(q, myForm) {
      if (myForm[q._id]) {
        myForm[q._id].$touch();
      }
    },

    myError(q, myForm) {
      return myForm[q._id] ? myForm[q._id].$error : true;
    },

    generateFormField(question) {
      const first = question.responses[0];
      const label = question.texts[0].text;

      if (first.type === 'selection') {
        const additionalText = { active: false };

        const options = question.responses.map((res) => {
          if (res.type === 'free-text') {
            additionalText.active = true;
            additionalText.targetValue = res._id;
          }

          return {
            label: res.text,
            value: res._id,
            selected: res.selected,
            typeValue: res.typeValue,
          };
        });

        return {
          type: 'option-group',
          label,
          multiple: question.multiple,
          options,
          additionalText,
        };
      }

      // If there is an extra question, use the options from the database.
      // This is used for "stato civile" e "settore di attivita" for example.
      const extra = this.getExtraQuestion(question._id);
      if (extra) {
        const toOption = (o) => ({ label: o.value, value: o.value });

        question.responses = question.responses.map((res) => {
          const option = {
            ...res,
            type: 'extra-selection',
            options: extra.options.map((o) => toOption(o)),
          };

          option.filterFn = function (value, update, abort) {
            update(() => {
              const needle = value.toLowerCase();
              option.options = extra.options
                .filter((o) => o.value.toLowerCase().includes(needle))
                .map((o) => toOption(o));
            });
          };

          return option;
        });
      }

      return { type: 'field-group', label, fields: question.responses };
    },

    pickSection(section) {
      this.currentSection = section;
      // this.computeSectionCompletion();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },

    isLastSection() {
      if (this.isInquriySurvey) {
        // if it's inquiry, there's always going to be a next section
        return false;
      }

      const sections = Object.entries(this.groupedSections).reverse();

      /* eslint-disable no-restricted-syntax */
      for (const [id, section] of sections) {
        if (this.sectionHasActiveQuestions(section)) {
          return id === this.currentSection;
        }
      }

      return false;
    },

    async goToNextSection() {
      const data = await this.surveyData();
      await this.saveSurvey(data);

      this.touched.add(this.currentSection);

      const sections = Object.entries(this.groupedSections);
      let pickNext = false;

      /* eslint-disable no-restricted-syntax */
      for (const [id, section] of sections) {
        if (pickNext && this.sectionHasActiveQuestions(section)) {
          this.pickSection(section._id);
          return;
        }

        if (id === this.currentSection) {
          pickNext = true;
        }
      }

      if (pickNext && this.isInquriySurvey) {
        // if we're still here and the survey is inquiry, then go to correct next section
        const next = 'sign-result';
        this.pickSection(next);
      }
    },

    isQuestionActive(question) {
      const check = this.conditionedQuestions[question._id];
      if (!check) return true;

      // The parent must also be visible
      if (!this.isQuestionActive({ _id: check.parent })) return false;

      const parentValue = this.form[check.parent];

      if (Array.isArray(parentValue)) {
        return parentValue.includes(check.value);
      }

      return check.value === parentValue;
    },

    sectionHasActiveQuestions(section) {
      return section.questions.some((q) => this.isQuestionActive(q));
    },

    validationsFor(questionId, type) {
      if (type === 'fiscal-code') {
        return { checkFiscalCode: this.$utils.checkFiscalCode };
      }

      if (type === 'vat') {
        return { checkVatNumber: this.$utils.checkVatNumber };
      }

      if (type === 'iban') {
        return { checkIban: this.$utils.checkIban };
      }

      if (questionId === '04-ad-carico') {
        return { checkNotNegative: this.$utils.checkNotNegative };
      }

      if (questionId === 'first-pension-payment') {
        return { checkPastDate: this.$utils.checkPastDate };
      }

      return {};
    },

    computeSectionCompletion(force) {
      // reset status first
      this.$v.form.$touch();
      const sectionStatus = {};

      Object.values(this.groupedSections).forEach((section) => {
        if (!this.sectionHasActiveQuestions(section)) {
          sectionStatus[section._id] = 'complete';

          // IMPORTANT
          // if a section has no active questions
          // we RESET all fields contained in that section
          // so that if an answer is taken into account when calculating
          // the results of the survey, it doesn't have a value.
          // When re-activating the section, all fields will be blank.
          // That's ok, the user will need to fill in the answers again.

          section.questions.forEach((q) => {
            this.form[q._id] = q.formField.multiple ? [] : undefined;
          });

          return;
        }

        // if we're not forcing the computation, then assume that step is incomplete
        // this is done for new surveys where all fields are blank
        if (!force && !this.touched.has(section._id) && this.survey.status === undefined) {
          sectionStatus[section._id] = 'incomplete';
          return;
        }

        const state = {
          count: 0,
          completed: 0,
        };

        section.questions.forEach((q) => {
          const active = this.isQuestionActive(q);
          if (!active || !q.required) return;

          if (q.formField.type === 'field-group') {
            q.formField.fields.forEach((field) => {
              if (field.type === 'person') {
                // handled in its own component
                const data = this.$refs.anagrafica[0].validateFromParent();

                state.count += 1;
                if (data.valid.allValid) {
                  state.completed += 1;
                }
                return;
              }

              state.count += 1;

              const key = field.type === 'date' ? q._id : field._id;
              const completed = this.form[key];
              const hasErrors = this.$v.form[key].$invalid;

              if (completed && !hasErrors) state.completed += 1;
            });
          }

          if (q.formField.type === 'option-group') {
            state.count += 1;
            if (this.form[q._id]?.length) state.completed += 1;
          }
        });

        const status = (() => {
          if (state.count === state.completed) {
            return 'complete';
          }

          if (state.completed === 0) {
            return 'empty';
          }

          return 'incomplete';
        })();

        sectionStatus[section._id] = status;
      });

      this.sectionStatus = sectionStatus;
      this.$v.form.$reset();
    },

    sectionCompletionStatus(section) {
      let status = this.sectionStatus[section._id];
      if (!status) status = 'complete';
      if (this.isNewSurvey && !this.touched.has(section._id)) status = 'incomplete';

      if (status === 'complete') {
        return { color: 'step-positive', icon: 'fa fa-check' };
      }

      // if (status === 'empty') {
      // return { color: 'step-negative', icon: 'fa fa-times' };
      // }

      return { color: 'step-warning', icon: 'fa fa-exclamation' };
    },

    signatureSectionCompletionStatus(section) {
      let status = 'incomplete';

      // showing available products
      if (this.isSurveyFilled && section._id === 'sign-result') {
        status = 'complete';
      }

      // promoter signed
      if (this.signature?.promoter?.status === 'done' && section._id === 'sign-promoter') {
        status = 'complete';
      }

      // customer signed
      if (this.signature?.customer?.status === 'done' && section._id === 'sign-customer') {
        status = 'complete';
      }

      // ready to sign
      if (this.signature && section._id === 'signature-form') {
        status = 'complete';
      }

      // if survey is done
      if (this.signature?.procedureCompleted && section._id.startsWith('sign')) {
        status = 'complete';
      }

      if (status === 'complete') {
        return { color: 'step-positive', icon: 'fa fa-check' };
      }

      return { color: 'step-warning', icon: 'fa fa-exclamation' };
    },

    async getSignedUrl(field, file) {
      const entityId = [this.survey._id, field._id, Math.random().toString(36).slice(2)].join('-');

      const response = await this.$utils.getSurveyAttachmentSignedUrl(
        entityId,
        this.$store.state.login.token,
        this.$utils.strip(file[0].name),
      );

      this.uploads[field._id] = {
        entityId,
        documentId: response.data.item._id,
        displayName: file[0].name,
        type: file[0].type,
      };

      return { url: response.data.item.url };
    },

    async downloadAttachment(documentId) {
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const res = await this.$utils.getApiCall(store, {
        url: `/v1/documents/${documentId}/presigned-download`,
      });

      await download(res.item.url, res.item.displayName);
    },

    async removeAttachment(fieldId, attachmentId) {
      this.form[fieldId] = this.form[fieldId].filter((x) => x.attachmentId !== attachmentId);
      this.$refs.uploader.reset();
    },

    async uploaded(field, file) {
      const doc = this.uploads[field._id];
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const qs = new URLSearchParams({
        attachmentName: doc.displayName,
        type: doc.type,
        extension: doc.type.split('/')[1],
      });

      const res = await this.$utils.getApiCall(store, {
        url: `/v1/workflow/attachment/${doc.entityId}/${doc.documentId}?${qs.toString()}`,
        action: 'put',
      });

      this.form[field._id] = this.form[field._id] || [];
      this.form[field._id].push({
        attachmentId: res.item._id,
        displayName: doc.displayName,
      });

      this.$refs.uploader.reset();
    },

    attachmentBlock(attachment) {
      return [
        {
          _id: '0',
          label: attachment.displayName,
          weight: 'normal',
          type: '2rows',
          col: true,
        },
      ];
    },

    async surveyData() {
      // copy initial survey data
      const survey = { ...this.survey };

      // mark the survey as filled
      this.computeSectionCompletion(true);
      survey.filled = this.isSurveyFilled;

      // go through all the questions and fill `selected` and `typeValue`
      /* eslint-disable no-await-in-loop */
      for (const question of survey.questions) {
        const first = question.responses[0];

        if (first.type === 'selection') {
          // selection fields
          let selected = this.form[question._id];
          if (!Array.isArray(selected)) selected = [selected];

          question.responses.forEach((res) => {
            // reset previous status
            res.selected = false;

            if (selected.includes(res._id)) {
              res.selected = true;

              // also store related text inputs
              if (res.type === 'free-text') {
                res.typeValue = this.form[res._id];
              }
            }
          });
        } else if (first.type === 'person') {
          // Person field is handled from its own component
          const uuid = await this.$refs.anagrafica[0].triggerFromParent();

          question.responses.forEach((res) => {
            res.typeValue = uuid;
          });
        } else {
          // all other fields
          question.responses.forEach((res) => {
            let value = this.form[res._id];

            if (res.type === 'date') {
              value = moment.utc(this.form[question._id], 'DD-MM-YYYY').toISOString();
            }

            res.typeValue = value;
          });
        }
      }

      const userId = '';
      const { customerId } = this;
      const practiceId = '';
      const dossierId = '';
      return { survey, customerId, userId, practiceId, dossierId };
    },

    async submitSurveyClick() {
      this.$v.form.$touch();

      const data = await this.surveyData();
      await this.submitSurvey(data);
    },

    responseIncludes(response, target) {
      let selected = response;
      if (!Array.isArray(selected)) selected = [selected];
      return selected.includes(target);
    },

    // only include questions that are 1. relevant 2. visible
    // instead of sharing the whole form
    getQuestionsForCalculatingResults() {
      return [...QUESTION_IDS].reduce((acc, id) => {
        const active = this.isQuestionActive({ _id: id });
        if (!active) return acc;

        acc[id] = this.form[id];
        return acc;
      }, {});
    },

    getExtraQuestion(questionId) {
      return this.extraQuestions.find((q) => q.question === questionId);
    },

    validateSpecialChars(value) {
      if (value === '') return true;
      return (
        /^(?!\s)(?![\S\s]*\s$)[\d &'.@a-z-]+$/i.test(value) || 'Ci sono dei caratteri non ammessi'
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  min-width 710px
  max-width 960px
  border-radius 4px
  border solid 1px $card-border
  min-height 280px

.q-stepper
  background-color white
  border-radius 4px
  border solid 1px $card-border

.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px

label.field-title
  display: block
  margin: 1.5em 0 0.5em

.q-field, .field-wrapper
  margin-bottom: 1.5em

.disabled, [disabled], .disabled *, [disabled] *
  opacity: 1 !important
  pointer-events: none

.question-row
  padding: 1em 0 2.5em
  border-bottom: 1px solid #ccc
</style>
