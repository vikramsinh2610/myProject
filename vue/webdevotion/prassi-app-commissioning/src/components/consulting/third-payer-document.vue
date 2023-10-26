<template>
  <div>
    <div>
      <div class="row justify-between q-my-xs">
        <q-input
          class="col-5"
          v-model="form.documentNumber"
          :readonly="hasSignature"
          type="text"
          :label="$t('customer.documentNumber')"
          :error-message="$t('person.error')"
          :error="$v.form.documentNumber.$error"
          @blur="$v.form.documentNumber.$touch"
          @keyup.enter="submit"
        />
        <q-select
          class="col-5"
          clearable
          v-model="form.documentType"
          :readonly="hasSignature"
          :label="$t('customer.documentType')"
          :error-message="$t('person.error')"
          :error="$v.form.documentType.$error"
          @blur="$v.form.documentType.$touch"
          :options="documentTypeList"
        />
      </div>

      <div class="row justify-between q-my-xs">
        <q-input
          class="col-5"
          v-model="form.issueDate"
          :readonly="hasSignature"
          mask="##/##/####"
          :label="$t('customer.issueDate')"
          :error-message="$t('person.error')"
          :error="$v.form.issueDate.$error"
          @blur="$v.form.issueDate.$touch"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="form.issueDate"
                  mask="DD/MM/YYYY"
                  @input="() => $refs.qDateProxy1.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          class="col-5"
          v-model="form.expiryDate"
          :readonly="hasSignature"
          mask="##/##/####"
          :label="$t('customer.expiryDate')"
          :error-message="$t('person.error')"
          :error="$v.form.expiryDate.$error"
          @blur="$v.form.expiryDate.$touch"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="form.expiryDate"
                  mask="DD/MM/YYYY"
                  @input="() => $refs.qDateProxy2.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="row justify-between q-my-xs">
        <q-input
          class="col-5 search-box"
          :readonly="hasSignature"
          v-model="form.issueCity"
          type="text"
          :label="$t('customer.issueCity')"
          @keyup.enter="submit"
        />
        <q-input
          class="col-5"
          :readonly="hasSignature"
          v-model="form.issueRegion"
          type="text"
          :label="$t('customer.issueRegion')"
          @keyup.enter="submit"
        />
      </div>

      <div class="row justify-between q-my-xs">
        <q-input
          class="col-5"
          v-model="form.issueCountry"
          type="text"
          :label="$t('customer.issueCountry')"
          @keyup.enter="submit"
        />
        <q-select
          class="col-5"
          clearable
          :readonly="hasSignature"
          v-model="form.issueAuthority"
          :label="$t('customer.issueAuthority')"
          :options="documentIssuerList"
        />
      </div>

      <div class="row justify-between q-py-xl">
        <div class="col-12">
          <div v-if="!hasSignature" style="margin-bottom: 2em">
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
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';
import download from 'getfile-rename-js';
import PrassiBodyList from '../base/prassi-body-list';

export default {
  name: 'ConsultingThirdPayerDocument',

  components: {
    PrassiBodyList,
  },

  data() {
    return {
      uploads: {},
      form: {
        // eslint-disable-next-line unicorn/no-null
        documentId: null,
        personId: '',
        documentNumber: '',
        issueDate: '',
        expiryDate: '',
        // eslint-disable-next-line unicorn/no-null
        documentType: { label: '', value: 0 },
        // eslint-disable-next-line unicorn/no-null
        issueAuthority: null,
        issueCountry: '',
        issueCity: '',
        issueRegion: '',
        uuid: '',
        document: [],
      },
      documentTypeList: [
        {
          label: "Carta d'identita",
          value: 1,
        },
        {
          label: 'Passaporto',
          value: 2,
        },
        {
          label: 'Patente di guida',
          value: 3,
        },
      ],
      documentIssuerList: [
        {
          label: 'Comune',
          value: 1,
        },
        {
          label: 'Prefettura',
          value: 2,
        },
        {
          label: 'Questura',
          value: 3,
        },
        {
          label: 'Motorizzazione',
          value: 4,
        },
        {
          label: 'Ministero affari esteri',
          value: 5,
        },
        {
          label: 'Ambasciata',
          value: 6,
        },
        {
          label: 'Dipartimento dei trasporti terrestri',
          value: 7,
        },
        {
          label: 'Rappresentanze diplomatiche',
          value: 8,
        },
      ],
    };
  },
  validations() {
    return {
      form: {
        documentNumber: {
          required,
        },
        issueDate: {
          required,
          minValue(value) {
            return moment.utc(value, 'DD-MM-YYYY') <= moment();
          },
          maxValue(value, { expiryDate }) {
            return expiryDate
              ? moment.utc(expiryDate, 'DD-MM-YYYY') > moment.utc(value, 'DD-MM-YYYY')
              : true;
          },
        },
        expiryDate: {
          required,
          minValue(value, { issueDate }) {
            return issueDate
              ? moment.utc(value, 'DD-MM-YYYY') > moment.utc(issueDate, 'DD-MM-YYYY')
              : true;
          },
          maxValue(value) {
            return moment.utc(value, 'DD-MM-YYYY') >= moment().add(1, 'months');
          },
        },
        documentType: {
          required,
        },
        issueAuthority: {
          required,
        },
        issueCountry: {
          required,
        },
        issueCity: {
          required,
        },
        issueRegion: {
          required,
        },
      },
    };
  },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async mounted() {
    if (this.map) return;
    this.searchAddress = '';
    // eslint-disable-next-line sonarjs/cognitive-complexity
    window.addEventListener('google-maps-loaded', () => {
      this.map = true;
      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(
        document.querySelector('.search-box input'),
        {
          types: ['(cities)'],
        },
      );

      autocomplete.setFields(['geometry', 'address_components']);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const country = place.address_components.find((el) => el.types.includes('country'));
        const provincia = place.address_components.find((el) =>
          el.types.includes('administrative_area_level_2'),
        );
        const comune = place.address_components.find((el) =>
          el.types.includes('administrative_area_level_3'),
        );

        this.form.issueCity = comune && comune.short_name ? comune.short_name.toUpperCase() : '';
        this.form.issueCountry =
          country && country.long_name ? country.long_name.toUpperCase() : '';
        this.form.issueRegion = provincia && provincia.short_name ? provincia.short_name : '';
      });
    });

    if (!window.initMap) {
      window.initMap = () => {
        const event = new CustomEvent('google-maps-loaded');
        window.dispatchEvent(event);
        window.googleMapReady = true;
      };
    }

    const mapSrc = `https://maps.googleapis.com/maps/api/js?key=${this.$env.mapKey}&libraries=places&callback=initMap`;
    const isLoaded = document.querySelector(`script[src="${mapSrc}"]`);
    if (!isLoaded) {
      const script = document.createElement('script');
      script.src = mapSrc;
      script.defer = true;
      document.head.append(script);
    } else if (window.googleMapReady) {
      window.initMap();
    }
    if (this.consulting?.sepa.document.documentId) {
      this.form = this.consulting.sepa.document;
    } else {
      await this.fetchIdentityCardByCustomerId(this.consulting.sepa.linkedCustomerId);
      this.form.documentId = this.personIdentityCard.documentId
        ? this.personIdentityCard.documentId
        : undefined;
      if (this.personIdentityCard.documentNumber) {
        this.form.documentNumber = this.personIdentityCard.documentNumber;
      }
      if (
        this.personIdentityCard.attachmentObj &&
        this.personIdentityCard.attachmentObj.displayName
      ) {
        this.form.document[0] = this.personIdentityCard.attachmentObj;
      }
      if (this.personIdentityCard.issueDate) {
        this.form.issueDate = moment(this.personIdentityCard.issueDate).format('DD/MM/YYYY');
      }
      if (this.personIdentityCard.expiryDate) {
        this.form.expiryDate = moment(this.personIdentityCard.expiryDate).format('DD/MM/YYYY');
      }
      if (this.personIdentityCard.issueAuthority) {
        this.form.issueAuthority = {
          value: this.personIdentityCard.issueAuthority.key,
          label: this.personIdentityCard.issueAuthority.value,
        };
      }
      if (this.personIdentityCard.issueCountry) {
        this.form.issueCountry = this.personIdentityCard.issueCountry;
      }
      if (this.personIdentityCard.issueCity) {
        this.form.issueCity = this.personIdentityCard.issueCity;
      }
      if (this.personIdentityCard.issueRegion) {
        this.form.issueRegion = this.personIdentityCard.issueRegion;
      }

      this.form.documentType = {
        value: this.personIdentityCard.documentType.key,
        label: this.personIdentityCard.documentType.value,
      };
      this.resetPersonDocuments();
    }
  },

  computed: {
    ...mapState({
      consulting: (state) => state.consulting.result,
      personIdentityCard: (state) => state.dossiers.personIdentityCard,
      isFetching: (state) => state.error.isFetching,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    ...mapActions({
      fetchIdentityCardByCustomerId: 'dossiers/fetchIdentityCardByCustomerId',
      savePersonDocument: 'dossiers/savePersonDocument',
    }),
    ...mapMutations({
      resetPersonDocuments: 'dossiers/resetPersonDocuments',
    }),
    async getSignedUrl(field, file) {
      const entityId = [
        this.consulting.sepa.linkedCustomerId,
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
    // eslint-disable-next-line no-empty-function
    async triggerFromParent() {
      const changedDocument = {
        // eslint-disable-next-line unicorn/no-null
        id: this.form.documentId ? this.form.documentId : null,
        // eslint-disable-next-line unicorn/no-null
        documentId: this.form.documentId ? this.form.documentId : null,
        personId: this.consulting?.sepa?.customer?.id,
        attachmentObj: this.form.document[0],
        documentNumber: this.form.documentNumber,
        issueDate: moment.utc(this.form.issueDate, 'DD-MM-YYYY').toISOString(),
        expiryDate: moment.utc(this.form.expiryDate, 'DD-MM-YYYY').toISOString(),
        issueAuthority: {
          value: this.form.issueAuthority.label,
          key: this.form.issueAuthority.value,
        },
        issueCity: this.form.issueCity,
        issueRegion: this.form.issueRegion,
        issueCountry: this.form.issueCountry,
        documentType: this.form.documentType
          ? {
              key: this.form.documentType.value,
              value: this.form.documentType.label,
            }
          : { label: '', value: 0 },
      };

      await this.savePersonDocument({
        ...changedDocument,
      });

      return {
        document: this.form,
      };
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
