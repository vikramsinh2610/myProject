<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section">{{ $t('promoterInsertLetter.baseData') }}</div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.promoterSerialNumber"
            readonly
            hide-bottom-space
            type="text"
            :label="$t('promoterInsertLetter.serialNumber')"
            :error-message="$t('promoterInsertLetter.serialNumberError')"
            :error="$v.form.promoterSerialNumber.$error"
            @blur="$v.form.promoterSerialNumber.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.promoterDisplayName"
            readonly
            hide-bottom-space
            type="text"
            :label="$t('promoterInsertLetter.promoterName')"
            :error-message="$t('promoterInsertLetter.promoterNameError')"
            :error="$v.form.promoterDisplayName.$error"
            @blur="$v.form.promoterDisplayName.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.description"
            :readonly="letter.status !== 'wip' || $user.roleID < 7"
            type="text"
            :label="$t('promoterInsertLetter.description')"
            :error-message="$t('promoterInsertLetter.descriptionError')"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-small-field"
            v-model="form._id"
            readonly
            hide-bottom-space
            type="text"
            :label="$t('promoterInsertLetter.letterNumber')"
            :error-message="$t('promoterInsertLetter.letterNumberError')"
            :error="$v.form._id.$error"
            @blur="$v.form._id.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-small-field"
            v-model="form.signatureDate"
            mask="##-##-####"
            :label="$t('promoterInsertLetter.signingDate')"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="form.signatureDate"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="row justify-between q-my-xs">
          <q-select
            class="full-width"
            :readonly="letter.status !== 'wip' || $user.roleID < 7"
            v-model="form.type"
            :label="$t('promoterInsertLetter.letterType')"
            :options="letterTypeList"
          />
        </div>

        <div class="row q-my-xl">
          <q-uploader
            class="full-width"
            ref="uploader"
            auto-expand
            hide-upload-button
            method="PUT"
            :headers="[{ name: 'content-type', value: 'application/octet-stream' }]"
            :factory="getSignedUrl"
            :send-raw="true"
            @uploaded="uploaded"
            @add="nFiles += 1"
            @remove="nFiles -= 1"
          />
        </div>
      </div>
      <div class="p-pc-red-section">
        {{ nAttachments }} {{ $t('promoterInsertLetter.nAttachments') }}
      </div>
      <prassi-standard-button
        class="q-mb-lg"
        icon="backup"
        v-if="letter.status === 'wip' && $user.roleID >= 7"
        :loading="isFetching"
        :label="$t('promoterInsertLetter.uploadFile')"
        @click="upload"
      />
      <prassi-standard-button
        class="q-mb-lg"
        v-if="letter.status === 'wip' && $user.roleID >= 7"
        :loading="isFetching"
        :label="$t('promoterInsertLetter.cancel')"
        @click="cancel"
      />
      <prassi-standard-button
        class="q-mb-lg"
        v-if="letter.status === 'wip' && $user.roleID >= 7"
        :loading="isFetching"
        :label="$t('promoterCompany.save')"
        @click="submit"
      />
      <prassi-round-button
        class="q-mb-md float-right"
        icon="fa fa-chevron-down"
        @click="nextStep"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from 'quasar';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterLetterBase',
  data() {
    return {
      nFiles: 0,
      form: {
        promoterSerialNumber: '',
        promoterDisplayName: '',
        description: '',
        _id: '',
        signatureDate: '',
        type: undefined,
      },
      attachmentId: '',
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    letter: {
      type: Object,
      default: () => ({}),
    },
    letterSettings: {
      type: Object,
      default: () => ({}),
    },
    nAttachments: {
      type: Number,
      default: 0,
    },
  },
  validations: {
    form: {
      promoterSerialNumber: {
        required,
      },
      promoterDisplayName: {
        required,
      },
      _id: {
        required,
      },
      signatureDate: {
        required,
      },
      type: {
        required,
      },
    },
  },
  computed: {
    letterTypeList() {
      const letterTypeList = [];

      Object.entries(this.letterSettings).forEach((key) => {
        letterTypeList.push({
          label: this.$t(`promoterInsertLetter.${key[1]._id}`),
          value: key[1]._id,
        });
      });

      return letterTypeList;
    },
  },
  watch: {
    letter: {
      immediate: true,
      handler(letter) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'letter', letter);
        if (!letter._id) return;
        this.form.promoterDisplayName = letter.promoterDisplayName;
        this.form.promoterSerialNumber = letter.promoterSerialNumber;
        this.form.signatureDate = date.formatDate(letter.signatureDate, 'DD-MM-YYYY');
        this.form.type = {
          label: this.letterTypeList.find((el) => letter.type === el.value).label,
          value: letter.type,
        };
        this.form.description = this.form.description || letter.description;
        this.form._id = letter._id;
      },
    },
    'form.type': {
      handler(type) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'type', type);
        if (type.value === this.letter.type) return;
        const changedLetter = {
          ...this.letter,
          signatureDate: date.extractDate(this.form.signatureDate, 'DD-MM-YYYY').toISOString(),
          type: this.form.type.value,
        };
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'change type', changedLetter);
        this.$emit('changeType', changedLetter);
      },
    },
  },
  methods: {
    upload() {
      this.$refs.uploader.upload();
      this.nFiles = 0;
    },
    nextStep() {
      if (this.letter.status === 'wip' && this.$user.roleID >= 7) {
        this.submit();
      } else {
        this.$emit('nextStep');
      }
    },
    submit() {
      this.$v.form.$touch();

      this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'submit letter base NFILES', this.nFiles);
      if (this.nFiles !== 0) {
        this.$q.notify(this.$t('promoterInsertLetter.cantSaveFiles'));
        return;
      }

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'submit letter base', this.form);
        const changedLetter = {
          ...this.letter,
          signatureDate: date.extractDate(this.form.signatureDate, 'DD-MM-YYYY').toISOString(),
          description: this.form.description,
          type: this.form.type.value,
        };
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'submit letter base', changedLetter);
        this.$emit('changeData', { item: changedLetter });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },
    cancel() {
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'cancel letter', this.form);
      this.$emit('deleteLetter', this.letter._id);
    },
    async getSignedUrl(file) {
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'getSignedUrl', file);
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'getSignedUrl', file[0].name);
      const response = await this.$utils.getSignedUrl(
        this.$route.params.id,
        this.form._id,
        this.$store.state.login.token,
        this.$utils.strip(file[0].name),
      );
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'getSignedUrl response', response);
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'getSignedUrl url', response.data.item.url);
      this.attachmentId = response.data.item._id;
      return { url: response.data.item.url };
    },
    // eslint-disable-next-line no-unused-vars
    async uploaded(file) {
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-BASE', 'uploaded', file);
      this.$emit('uploaded', {
        letterId: this.form._id,
        attachmentId: this.attachmentId,
        displayName: file.files[0].name,
      });
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
