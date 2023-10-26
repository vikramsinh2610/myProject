<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">
        {{ $t('personPrecontractual.fiscalCode') }}
      </div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12"
            v-model="form.fiscalCode"
            :readonly="readOnly"
            type="text"
            :label="$t('personPrecontractual.fiscalCode')"
            :error-message="$t('person.error')"
            :error="$v.form.fiscalCode.$error"
            @blur="$v.form.fiscalCode.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-py-xl">
          <div class="col-12">
            <div v-if="!readOnly" style="margin-bottom: 2em">
              <q-uploader
                class="full-width"
                ref="uploader"
                auto-expand
                hide-upload-button
                method="PUT"
                accept=".pdf"
                :auto-upload="true"
                :required="true"
                :multiple="false"
                label="Allega"
                :headers="[{ name: 'content-type', value: 'application/pdf' }]"
                :factory="(file) => getSignedUrl(form.document, file)"
                :send-raw="true"
                @uploaded="(file) => uploaded(file)"
              />
            </div>

            <div v-if="(form.document || []).length">
              <div v-for="attachment in form.document || []" :key="attachment.attachmentId">
                <prassi-body-list
                  menu
                  menu-delete
                  menu-icon="fa fa-eye"
                  :blocks="attachmentBlock(attachment)"
                  @menuClick="downloadAttachment(attachment.attachmentId)"
                  @deleteClick="removeAttachment('document', attachment.attachmentId)"
                />
              </div>
            </div>
            <div v-else>
              {{ $t('survey.noAttachment') }}
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-between q-my-xs" v-if="!readOnly">
        <prassi-standard-button class="q-mb-lg" label="Successivo" @click="nextStep()" />
        <prassi-standard-button class="q-mb-lg" label="Salva e Chiudi" @click="submit" />
      </div>
      <div class="row justify-between q-my-xs"></div>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import download from 'getfile-rename-js';
import PrassiBodyList from '../../base/prassi-body-list';

export default {
  name: 'PrassiPersonFiscalCard',
  components: {
    PrassiBodyList,
  },
  data() {
    return {
      uploads: {},
      form: {
        fiscalCode: '',
        document: [],
      },
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
    precontractual: {
      type: Object,
      default: () => ({}),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    embedded: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
  },
  validations() {
    return {
      form: {
        fiscalCode: {
          ...(this.required ? { required } : {}),
          checkFiscalCode: this.$utils.checkFiscalCode,
        },
      },
    };
  },
  watch: {
    person: {
      immediate: true,
      handler(person) {
        this.$utils.logobj('PRASSI-PERSON-FISCAL-CARD', 'person', person);
        if (!person.id) return;
        this.form.fiscalCode = person.fiscalCode;
        if (
          person.fiscalCodeAttachmentObj &&
          person.fiscalCodeAttachmentObj.displayName &&
          !this.form.document[0]
        ) {
          this.form.document[0] = person.fiscalCodeAttachmentObj;
        }
      },
    },
    precontractual: {
      immediate: true,
      handler(precontractual) {
        this.$utils.logobj('PRASSI-PERSON-FISCAL-CARD', 'precontractual', precontractual);
        if (!precontractual.id) return;
        if (precontractual.fiscalCodeFile) {
          this.form.document[0] = precontractual.fiscalCodeFile;
        }
      },
    },
  },
  methods: {
    nextStep() {
      this.saveData();
      this.$emit('nextStep');
    },
    submit() {
      this.saveData();
    },
    async getSignedUrl(field, file) {
      const entityId = [
        this.precontractual.personId,
        'document',
        Math.random().toString(36).slice(2),
      ].join('-');

      const response = await this.$utils.getSurveyAttachmentSignedUrl(
        entityId,
        this.$store.state.login.token,
        'pdf',
      );

      this.uploads.document = {
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

    // eslint-disable-next-line no-unused-vars
    async uploaded(file) {
      const doc = this.uploads.document;
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const qs = new URLSearchParams({
        attachmentName: doc.displayName,
        type: doc.type,
        extension: 'pdf',
      });

      const res = await this.$utils.getApiCall(store, {
        url: `/v1/workflow/attachment/${doc.entityId}/${doc.documentId}?${qs.toString()}`,
        action: 'put',
      });

      this.form.document = this.form.document || [];
      this.form.document.push({
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

    async saveData() {
      this.$v.form.$touch();
      this.$utils.logobj('PRASSI-PERSON-FISCAL', 'submit person fiscal');

      if (!(this.form.document && this.form.document[0])) {
        this.$emit('changePrecontractual', {
          stepper: { name: 'fiscalCard', status: 'uncompleted' },
        });
        this.$q.notify('Manca documento in allegato');
        return;
      }

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'submit person fiscal', this.form);
        const changedPerson = {
          ...this.person,
          fiscalCode: this.form.fiscalCode,
          fiscalCodeAttachmentObj: this.form.document[0],
        };
        const changedPrecontractual = {
          fiscalCodeFile: this.form.document[0],
        };
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'submit person fiscal', changedPerson);
        this.$emit('changeData', { item: changedPerson });
        this.$emit('changePrecontractual', {
          data: changedPrecontractual,
          stepper: { name: 'fiscalCard', status: 'completed' },
        });
      } else {
        this.$emit('changePrecontractual', {
          stepper: { name: 'fiscalCard', status: 'uncompleted' },
        });
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  min-height 280px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-red-section
  font-size 18px
  color $r-3
  font-weight 500
  margin 20px auto
  text-align center
.p-pc-small-field
  width 140px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-pc-date
  width 200px
</style>
