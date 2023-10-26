<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">{{ $t('person.fiscal') }}</div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12"
            v-model="form.fiscalCode"
            type="text"
            :label="person.isCompany ? $t('person.vatCode') : $t('person.fiscalCode')"
            :error-message="$t('person.error')"
            :error="$v.form.fiscalCode.$error"
            @blur="$v.form.fiscalCode.$touch"
            :readonly="$user.roleID < 7"
            @keyup.enter="submit"
          >
            <template #append
              ><button
                v-if="!person.isCompany && $user.roleID >= 7"
                style="font-size: 12px"
                @click="updateFieldsFromCF"
              >
                Aggiorna da CF
              </button>
            </template>
          </q-input>
        </div>

        <div class="row justify-between q-my-xs" v-if="!person.isCompany">
          <div class="col-5 justify-between">
            <q-radio v-model="form.sex" val="M" :label="$t('person.male')" :disable="true" />
            <q-radio v-model="form.sex" val="F" :label="$t('person.female')" :disable="true" />
          </div>
          <div class="col-5 justify-between">
            <q-input
              class="p-pc-date"
              v-model="form.birthDate"
              mask="##-##-####"
              fill-mask
              :label="$t('person.birthDate')"
              :error-message="$t('person.error')"
              :error="$v.form.birthDate.$error"
              :readonly="$user.roleID < 7"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="form.birthDate"
                      mask="DD-MM-YYYY"
                      fill-mask
                      :readonly="$user.roleID < 7"
                      @input="() => $refs.qDateProxy2.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row justify-between q-my-xs" v-if="!person.isCompany">
          <q-input
            class="col-5"
            v-model="form.nationality"
            type="text"
            :label="$t('person.nationality')"
            :error-message="$t('person.error')"
            :error="$v.form.nationality.$error"
            @blur="$v.form.nationality.$touch"
            @keyup.enter="submit"
            :readonly="$user.roleID < 7"
          />
          <q-input
            class="col-5"
            v-model="form.birthState"
            type="text"
            :label="$t('person.birthState')"
            :error-message="$t('person.error')"
            :error="$v.form.birthState.$error"
            @blur="$v.form.birthState.$touch"
            @keyup.enter="submit"
            :readonly="$user.roleID < 7"
          />
        </div>

        <div class="row justify-between q-my-xs" v-if="!person.isCompany">
          <q-input
            class="col-5"
            v-model="form.birthRegion"
            type="text"
            :label="$t('person.birthRegion')"
            :error-message="$t('person.error')"
            :error="$v.form.birthRegion.$error"
            @blur="$v.form.birthRegion.$touch"
            :readonly="$user.roleID < 7"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.birthCity"
            type="text"
            :label="$t('person.birthCity')"
            :error-message="$t('person.error')"
            :error="$v.form.birthCity.$error"
            :readonly="$user.roleID < 7"
            @blur="$v.form.birthCity.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs" v-if="person.isCompany">
          <q-input
            v-model.number="form.foundationDate"
            type="number"
            class="p-pc-date"
            :label="$t('person.foundationDate')"
            :error-message="$t('person.error')"
            :error="$v.form.foundationDate.$error"
            @blur="$v.form.foundationDate.$touch"
            @keyup.enter="submit"
          />

          <q-select
            class="col-5"
            clearable
            v-model="form.companyType"
            :label="$t('person.companyType')"
            :options="companyTypeList"
          />
        </div>
      </div>
      <div class="row justify-between q-my-xs" v-if="!embedded">
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('promoterCompany.save')"
          @click="submit"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import moment from 'moment';
import { required, requiredUnless } from 'vuelidate/lib/validators';

const companyTypeList = [
  {
    label: 'Srl',
    value: 1,
  },
  {
    label: 'srls',
    value: 2,
  },
  {
    label: 'Snc',
    value: 3,
  },
  {
    label: 'sas',
    value: 4,
  },
  {
    label: 'spa',
    value: 5,
  },
  {
    label: 'sapa',
    value: 6,
  },
  {
    label: 'scarl',
    value: 7,
  },
  {
    label: 'onlus',
    value: 8,
  },
  {
    label: 'Altro',
    value: 9,
  },
];

export default {
  name: 'PrassiPersonFiscal',
  data() {
    return {
      form: {
        fiscalCode: '',
        birthDate: '',
        birthState: '',
        birthCity: '',
        birthRegion: '',
        sex: '',
        nationality: '',
        foundationDate: '',
        companyType: companyTypeList[0],
      },
      searchAddress: '',
      map: false, // google map initialized flag
      companyTypeList,
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
    embedded: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  validations() {
    return {
      form: {
        fiscalCode: {
          ...(this.required ? { required } : {}),
          checkFiscalCode: this.person.isCompany
            ? this.$utils.checkVatNumber
            : this.$utils.checkFiscalCode,
        },
        birthDate: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        birthState: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        birthCity: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        birthRegion: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        sex: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        foundationDate: {
          laterThanToday(value) {
            if (!this.person.isCompany) return true;
            return new Date().getFullYear() >= Number.parseInt(value, 10);
          },
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return !this.person.isCompany;
          }),
        },
        nationality: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        companyType: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return !this.person.isCompany;
          }),
        },
      },
    };
  },
  watch: {
    // 'form.fiscalCode': function (value) {
    //   this.$utils.setFormValuesFromCodiceFiscale(value, this.form);
    // },

    person: {
      immediate: true,
      handler(person) {
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'person', person);
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'person', moment(person.birthDate));
        if (!person.id) return;
        this.form.fiscalCode = person.fiscalCode;
        this.form.birthDate = person.birthDate
          ? moment(person.birthDate).format('DD-MM-YYYY')
          : undefined;
        this.form.birthState = person.birthState;
        this.form.birthCity = person.birthCity;
        this.form.birthRegion = person.birthRegion;
        this.form.sex = person.sex;
        this.form.nationality = person.nationality;
        this.form.companyType = person.companyType
          ? {
              label: person.companyType.value,
              value: person.companyType.key,
            }
          : { label: '', value: 0 };
        this.form.foundationDate = person.foundationDate
          ? moment.utc(person.foundationDate, 'YYYY-MM-DD').format('YYYY')
          : undefined;
        this.form.id = person.id;
      },
    },
  },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  mounted() {
    if (this.map) return;

    // eslint-disable-next-line sonarjs/cognitive-complexity
    window.addEventListener('google-maps-loaded', () => {
      this.map = true;

      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(
        this.$el.querySelector('.search-box input'),
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

        this.form.birthState = country && country.long_name ? country.long_name.toUpperCase() : '';
        this.form.birthCity = comune && comune.short_name ? comune.short_name.toUpperCase() : '';
        this.form.birthRegion = provincia && provincia.short_name ? provincia.short_name : '';
        this.form.nationality = this.form.birthState;
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

  methods: {
    nextStep() {
      if (this.letter.status === 'wip' && this.$user.roleID >= 7) {
        this.submit();
      } else {
        this.$emit('nextStep');
      }
    },
    submit() {
      this.$v.form.$touch();
      this.$utils.logobj('PRASSI-PERSON-FISCAL', 'submit person fiscal');

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'submit person fiscal', this.form);
        const changedPerson = {
          ...this.person,
          fiscalCode: this.form.fiscalCode,
          birthState: this.form.birthState,
          birthDate: this.form.birthDate
            ? moment.utc(this.form.birthDate, 'DD-MM-YYYY').toISOString()
            : '',
          birthRegion: this.form.birthRegion,
          sex: this.form.sex,
          nationality: this.form.nationality,
          birthCity: this.form.birthCity,
          foundationDate: this.form.foundationDate
            ? moment.utc(`01-01-${this.form.foundationDate}`, 'DD-MM-YYYY').toISOString()
            : '',
          companyType: {
            value: this.form.companyType.label,
            key: this.form.companyType.value,
          },
        };
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'submit person fiscal', changedPerson);
        this.$emit('changeData', { item: changedPerson });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },

    triggerFromParent() {
      this.$v.form.$touch();
      return { data: this.form, valid: !this.$v.form.$error };
    },

    updateFieldsFromCF() {
      this.$utils.setFormValuesFromCodiceFiscale(this.form.fiscalCode, this.form);
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
