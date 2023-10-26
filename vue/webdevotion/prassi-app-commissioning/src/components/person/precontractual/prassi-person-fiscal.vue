<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">{{ $t('person.fiscal') }}</div>
      <div>
        <div class="row justify-between q-my-xs" v-if="!person.isCompany">
          <div class="col-5 justify-between">
            <q-radio v-model="form.sex" :readonly="readOnly" val="M" :label="$t('person.male')" />
            <q-radio v-model="form.sex" :readonly="readOnly" val="F" :label="$t('person.female')" />
          </div>
          <div class="col-5 justify-between">
            <q-input
              class="p-pc-date"
              v-model="form.birthDate"
              :readonly="readOnly"
              mask="##/##/####"
              fill-mask
              :label="$t('person.birthDate')"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="form.birthDate"
                      :readonly="readOnly"
                      mask="DD/MM/YYYY"
                      fill-mask
                      @input="() => $refs.qDateProxy2.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12"
            v-model="form.fiscalCode"
            :readonly="readOnly"
            type="text"
            :label="$t('person.fiscalCode')"
            :error-message="$t('person.error')"
            :error="$v.form.fiscalCode.$error"
            @blur="$v.form.fiscalCode.$touch"
            @keyup.enter="submit"
          >
            <template #append
              ><button v-if="!person.isCompany" style="font-size: 12px" @click="updateFieldsFromCF">
                Aggiorna da CF
              </button>
            </template>
          </q-input>
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.birthCity"
            :readonly="readOnly"
            type="text"
            :label="$t('person.birthCity')"
            :error-message="$t('person.error')"
            :error="$v.form.birthCity.$error"
            @blur="$v.form.birthCity.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.birthRegion"
            :readonly="readOnly"
            type="text"
            :label="$t('person.birthRegion')"
            :error-message="$t('person.error')"
            :error="$v.form.birthRegion.$error"
            @blur="$v.form.birthRegion.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.nationality"
            :readonly="readOnly"
            type="text"
            :label="$t('person.nationality')"
            :error-message="$t('person.error')"
            :error="$v.form.nationality.$error"
            @blur="$v.form.nationality.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.birthState"
            :readonly="readOnly"
            type="text"
            :label="$t('person.birthState')"
            :error-message="$t('person.error')"
            :error="$v.form.birthState.$error"
            @blur="$v.form.birthState.$touch"
            @keyup.enter="submit"
          />
        </div>
      </div>
      <div class="row justify-between q-my-xs" v-if="!readOnly && !isFetching">
        <prassi-standard-button class="q-mb-lg" label="Successivo" @click="nextStep()" />
        <prassi-standard-button class="q-mb-lg" label="Salva e Chiudi" @click="submit" />
      </div>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
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
    person: {
      immediate: true,
      handler(person) {
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'person', person);
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'person', moment(person.birthDate));
        if (!person.id) return;

        let birthDate;
        if (person.birthDate) {
          birthDate = moment(person.birthDate).format('DD/MM/YYYY');
          if (moment(person.birthDate).year() === 1) {
            birthDate = moment(person.birthDate).add(1979, 'y').format('DD/MM/YYYY');
          }
        }

        this.form.fiscalCode = person.fiscalCode;
        this.form.birthDate = birthDate;
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
          ? moment(person.foundationDate).format('DD/MM/YYYY')
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
      this.saveData();
      this.$emit('nextStep');
    },
    submit() {
      this.saveData();
    },
    saveData() {
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
            ? moment.utc(this.form.foundationDate, 'DD-MM-YYYY').toISOString()
            : '',
          companyType: {
            value: this.form.companyType.label,
            key: this.form.companyType.value,
          },
        };
        this.$utils.logobj('PRASSI-PERSON-FISCAL', 'submit person fiscal', changedPerson);
        this.$emit('changeData', { item: changedPerson });
        this.$emit('changePrecontractual', { stepper: { name: 'fiscal', status: 'completed' } });
      } else {
        this.$emit('changePrecontractual', { stepper: { name: 'fiscal', status: 'uncompleted' } });
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
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
