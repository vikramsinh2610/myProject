<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">Sede Legale</div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12 search-box"
            v-model="form.searchAddress"
            :readonly="readOnly"
            type="text"
            :label="$t('person.search')"
            @keyup.enter="saveData"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.legalAddress.route"
            :readonly="readOnly"
            type="text"
            :label="$t('person.legalAddress')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.route.$error"
            @keyup.enter="saveData"
          />
          <q-input
            class="col-5"
            v-model="form.legalAddress.streetNumber"
            :readonly="readOnly"
            type="text"
            :label="$t('person.number')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.streetNumber.$error"
            @blur="$v.form.legalAddress.streetNumber.$touch"
            @keyup.enter="saveData"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.legalAddress.city"
            :readonly="readOnly"
            type="text"
            :label="$t('person.city')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.city.$error"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.legalAddress.postalCode"
            :readonly="readOnly"
            type="text"
            :label="$t('person.postalCode')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.postalCode.$error"
            @blur="$v.form.legalAddress.postalCode.$touch"
            @keyup.enter="saveData"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.legalAddress.province"
            :readonly="readOnly"
            type="text"
            :label="$t('person.province')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.province.$error"
            @blur="$v.form.legalAddress.province.$touch"
            @keyup.enter="saveData"
          />
          <q-input
            class="col-5"
            v-model="form.legalAddress.country"
            :readonly="readOnly"
            type="text"
            :label="$t('person.country')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.country.$error"
            @keyup.enter="saveData"
          />
        </div>
      </div>
      <div class="row justify-between q-my-xs" v-if="!readOnly">
        <prassi-standard-button class="q-mb-lg" label="Successivo" @click="nextStep()" />
        <prassi-standard-button class="q-mb-lg" label="Salva e Chiudi" @click="submit" />
      </div>
      <div class="row justify-between q-my-xs">
        <div class="map col-12" style="height: 500px"></div>
      </div>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';

export default {
  name: 'PrassiPersonLegalAddress',
  data() {
    return {
      map: undefined,
      marker: undefined,
      form: {
        id: '',
        searchAddress: '',
        legalAddress: {
          route: '',
          streetNumber: '',
          city: '',
          postalCode: '',
          country: '',
          province: '',
          latitude: undefined,
          longitude: undefined,
        },
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
    const v = this.required ? { required } : {};
    return {
      form: {
        legalAddress: {
          route: v,
          streetNumber: v,
          city: v,
          postalCode: v,
          province: v,
          country: v,
        },
      },
    };
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  mounted() {
    // eslint-disable-next-line sonarjs/cognitive-complexity

    window.addEventListener('google-maps-loaded', () => {
      if (this.map) return;

      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(
        this.$el.querySelector('.search-box input'),
        {
          types: ['geocode', 'establishment'],
        },
      );

      autocomplete.setFields(['geometry', 'address_components']);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const cap = place.address_components.find((el) => el.types.includes('postal_code'));
        const country = place.address_components.find((el) => el.types.includes('country'));
        const provincia = place.address_components.find((el) =>
          el.types.includes('administrative_area_level_2'),
        );
        const indirizzo = place.address_components.find((el) => el.types.includes('route'));
        const number = place.address_components.find((el) => el.types.includes('street_number'));
        const comune = place.address_components.find((el) =>
          el.types.includes('administrative_area_level_3'),
        );

        this.form.legalAddress = {
          route: indirizzo && indirizzo.short_name ? indirizzo.short_name : '',
          streetNumber: number && number.short_name ? number.short_name : '',
          city: comune && comune.short_name ? comune.short_name.toUpperCase() : '',
          postalCode: cap && cap.short_name ? cap.short_name : '',
          country: country && country.long_name ? country.long_name.toUpperCase() : '',
          province: provincia && provincia.short_name ? provincia.short_name : '',
        };
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
  watch: {
    person: {
      immediate: true,
      handler(person) {
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'person', person);
        if (!person.id) return;
        this.form.legalAddress = person.legalAddress;
        this.form.id = person.id;
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
    saveData() {
      this.$v.form.$touch();
      this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact');

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', this.form);
        const birthday = this.person.birthDate
          ? moment(this.person.birthDate).format('DD/MM/YYYY')
          : '';
        const changedPerson = {
          ...this.person,
          birthDate: birthday ? moment.utc(birthday, 'DD-MM-YYYY').toISOString() : '',
          legalAddress: this.form.legalAddress,
          address: this.form.legalAddress,
        };
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', changedPerson);
        this.$emit('changeData', { item: changedPerson });
        this.$emit('changePrecontractual', {
          stepper: { name: 'legalAddress', status: 'completed' },
        });
      } else {
        this.$emit('changePrecontractual', {
          stepper: { name: 'legalAddress', status: 'uncompleted' },
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
