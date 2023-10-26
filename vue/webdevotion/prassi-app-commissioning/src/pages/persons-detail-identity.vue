<template>
  <div class="fill-available column">
    <prassi-person-identity-card-list
      ref="documentList"
      :documents="documents"
      :is-fetching="isFetching"
      @loadMore="loadMoreDocuments"
      @viewClick="changeDocumentDialog"
      @deleteDocument="deleteDocumentClicked"
    />

    <q-dialog v-model="showDelDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{
              $t('configurationHeader.confirmDeleteDocument') +
              ' ' +
              this.documentToDelete.documentNumber
            }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            color="red"
            :label="$t('configurationProduct.delete')"
            @click="deleteDocumentConfirmed"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddDialog">
      <q-card style="max-width: 800px; width: 800px">
        <q-card-section class="bg-secondary text-white q-mb-md">
          <div class="text-h6">{{ $t('configurationHeader.changeDocument') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5"
              v-model="form.documentNumber"
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
              :label="$t('customer.documentType')"
              :error-message="$t('person.error')"
              :error="$v.form.documentType.$error"
              @blur="$v.form.documentType.$touch"
              :options="documentTypeList"
            />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input
              class="p-pc-date"
              v-model="form.issueDate"
              mask="##-##-####"
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
                      mask="DD-MM-YYYY"
                      @input="() => $refs.qDateProxy1.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              class="p-pc-date"
              v-model="form.expiryDate"
              mask="##-##-####"
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
                      mask="DD-MM-YYYY"
                      @input="() => $refs.qDateProxy2.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5 search-box"
              v-model="form.issueCity"
              type="text"
              :label="$t('customer.issueCity')"
              @keyup.enter="submit"
            />
            <q-input
              class="col-5"
              v-model="form.issueRegion"
              type="text"
              :label="$t('customer.issueRegion')"
              @keyup.enter="submit"
            />
          </div>
        </q-card-section>

        <q-card-section>
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
              v-model="form.issueAuthority"
              :label="$t('customer.issueAuthority')"
              :options="documentIssuerList"
            />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row justify-between q-py-xl">
            <div class="col-12">
              <div style="margin-bottom: 2em">
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
                    :menu-delete="$user.roleID >= 7"
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
        </q-card-section>

        <q-card-section>
          <prassi-standard-button :label="$t('default.okButton')" @click="comfirmAddDocument" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[26, 18]" class="first-menu">
      <q-fab-action @click="addDocumentDialog" color="red" icon="fa fa-plus-white">
        <q-tooltip
          anchor="center left"
          self="center right"
          :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
        >
          {{ $t('customer.addDocument') }}
        </q-tooltip>
      </q-fab-action>
    </q-page-sticky>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import download from 'getfile-rename-js';
import PrassiPersonIdentityCardList from '../components/person/prassi-person-identity-card-list';
import PrassiBodyList from '../components/base/prassi-body-list';

export default {
  name: 'PersonsDetailIdentity',
  components: {
    PrassiPersonIdentityCardList,
    PrassiBodyList,
  },
  data() {
    return {
      showAddDialog: false,
      showDelDialog: false,
      documentToDelete: '',
      uploads: {},
      form: {
        // eslint-disable-next-line unicorn/no-null
        id: null,
        personId: '',
        documentNumber: '',
        issueDate: '',
        expiryDate: '',
        // eslint-disable-next-line unicorn/no-null
        documentType: null,
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
      map: false, // google map initialized flag
      searchAddress: '',
    };
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  validations: {
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
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      person: (state) => state.dossiers.customer,
      documents: (state) => state.dossiers.personDocuments.items,
      last: (state) => state.dossiers.personDocuments.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchPersonDocuments: 'dossiers/fetchPersonDocuments',
      deletePersonDocument: 'dossiers/deletePersonDocument',
      savePersonDocument: 'dossiers/savePersonDocument',
    }),
    ...mapMutations({
      resetPersonDocuments: 'dossiers/resetPersonDocuments',
    }),
    setMap() {
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
    },
    addDocumentDialog() {
      this.$utils.log('PERSON-DETAIL-IDENTITY', 'addDocumentDialog');
      this.form = {
        // eslint-disable-next-line unicorn/no-null
        id: null,
        personId: this.person.id,
        documentNumber: '',
        issueDate: '',
        expiryDate: '',
        // eslint-disable-next-line unicorn/no-null
        documentType: null,
        // eslint-disable-next-line unicorn/no-null
        issueAuthority: null,
        issueCountry: '',
        issueCity: '',
        issueRegion: '',
        uuid: '',
        document: [],
      };
      this.showAddDialog = true;
      setTimeout(() => this.setMap(), 200);
    },
    changeDocumentDialog(document) {
      this.$utils.logobj('PERSON-DETAIL-IDENTITY', 'changeDocumentDialog', document);
      this.form.id = document.id ? document.id : undefined;
      if (document.documentNumber) {
        this.form.documentNumber = document.documentNumber;
      }
      if (document.attachmentObj && document.attachmentObj.displayName) {
        this.form.document[0] = document.attachmentObj;
      }
      if (document.issueDate) {
        this.form.issueDate = moment(document.issueDate).format('DD/MM/YYYY');
      }
      if (document.expiryDate) {
        this.form.expiryDate = moment(document.expiryDate).format('DD/MM/YYYY');
      }
      if (document.uuid) {
        this.form.uuid = document.uuid;
      }
      this.form.issueAuthority = document.issueAuthority
        ? {
            value: document.issueAuthority.key,
            label: document.issueAuthority.value,
          }
        : undefined;
      this.form.issueCountry = document.issueCountry;
      this.form.issueCity = document.issueCity;
      this.form.issueRegion = document.issueRegion;
      this.form.documentType = {
        value: document.documentType.key,
        label: document.documentType.value,
      };
      this.showAddDialog = true;
      setTimeout(() => this.setMap(), 200);
    },
    comfirmAddDocument() {
      this.$v.form.$touch();
      this.$utils.logobj('PRASSI-DETAIL-IDENTITY', 'submit person identity');

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-DETAIL-IDENTITY', 'submit person identity', this.form);
        this.showAddDialog = false;

        this.savePersonDocument({
          ...this.form,
          issueDate: moment.utc(this.form.issueDate, 'DD-MM-YYYY').toISOString(),
          expiryDate: moment.utc(this.form.expiryDate, 'DD-MM-YYYY').toISOString(),
          documentType: {
            value: this.form.documentType.label,
            key: this.form.documentType.value,
          },
          issueAuthority: {
            value: this.form.issueAuthority.label,
            key: this.form.issueAuthority.value,
          },
          attachmentObj: this.form.document[0],
          personId: this.person.id,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.resetPersonDocuments();
          this.$refs.documentList.forceScrolling();
        });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },
    async getSignedUrl(field, file) {
      const entityId = [this.person.id, 'document', Math.random().toString(36).slice(2)].join('-');

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
    deleteDocumentClicked(document) {
      this.$utils.logobj('PERSON-DETAIL-IDENTITY', 'deleteDocumentClicked', document);
      this.documentToDelete = document;
      this.showDelDialog = true;
    },
    deleteDocumentConfirmed() {
      this.$utils.log('PERSON-DETAIL-IDENTITY', 'deleteDocumentConfirmed');
      this.deletePersonDocument(this.documentToDelete).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.resetPersonDocuments();
      });
      this.documentToDelete = '';
      this.showDelDialog = false;
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreDocuments({ index, done }) {
      if (this.last || this.error) {
        this.$refs.documentList.stopScrolling();
      } else {
        this.$utils.logobj('PERSON-DETAIL-IDENTITY', 'loadMoreDocuments', index);
        this.fetchPersonDocuments(this.$route.params.id).finally(() => done());
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
.first-menu
  bottom 70px
.pac-container
  z-index 9999
</style>
