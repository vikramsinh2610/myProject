<template>
  <div>
    <div v-if="searchActive" class="row justify-between q-my-xs">
      <q-input
        class="col-12 search-box"
        v-model="form.searchAddress"
        type="text"
        :label="$t('person.search')"
        :readonly="readonly"
      />
    </div>

    <div class="row justify-between q-my-xs">
      <q-input
        class="col-5"
        v-model="form.address.route"
        type="text"
        :label="$t('invoicing.route')"
        :error-message="$t('person.error')"
        :error="$v.form.address.route.$error"
        :readonly="readonly"
      />
      <q-input
        class="col-5"
        v-model="form.address.streetNumber"
        type="text"
        :label="$t('person.number')"
        :error-message="$t('person.error')"
        :error="$v.form.address.streetNumber.$error"
        @blur="$v.form.address.streetNumber.$touch"
        :readonly="readonly"
      />
    </div>

    <div class="row justify-between q-my-xs">
      <q-input
        class="col-5"
        v-model="form.address.city"
        type="text"
        :label="$t('person.city')"
        :error-message="$t('person.error')"
        :error="$v.form.address.city.$error"
        :readonly="readonly"
      />
      <q-input
        class="col-5"
        v-model="form.address.postalCode"
        type="text"
        :label="$t('person.postalCode')"
        :error-message="$t('person.error')"
        :error="$v.form.address.postalCode.$error"
        @blur="$v.form.address.postalCode.$touch"
        :readonly="readonly"
      />
    </div>

    <div class="row justify-between q-my-xs">
      <q-input
        class="col-5"
        v-model="form.address.province"
        type="text"
        :label="$t('person.province')"
        :error-message="$t('person.error')"
        :error="$v.form.address.province.$error"
        @blur="$v.form.address.province.$touch"
        :readonly="readonly"
      />
      <q-input
        class="col-5"
        v-model="form.address.country"
        type="text"
        :label="$t('person.country')"
        :error-message="$t('person.error')"
        :error="$v.form.address.country.$error"
        :readonly="readonly"
      />
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'ConsultingAddress',
  data() {
    return {
      mapInitialized: false,
      form: {
        id: '',
        searchAddress: '',
        address: {
          route: '',
          streetNumber: '',
          city: '',
          postalCode: '',
          country: '',
          province: '',
        },
      },
    };
  },

  props: {
    searchActive: {
      type: Boolean,
      default: true,
    },

    initialAddress: {
      type: Object,
      default: () => {},
    },

    readonly: {
      type: Boolean,
      default: false,
    },
  },

  validations() {
    const v = { required };
    return {
      form: {
        address: {
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
    if (this.initialAddress) {
      this.form.address = {
        route: this.initialAddress.route,
        streetNumber: this.initialAddress.streetNumber,
        city: this.initialAddress.city,
        postalCode: this.initialAddress.postalCode,
        country: this.initialAddress.country,
        province: this.initialAddress.province,
      };
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    window.addEventListener('google-maps-loaded', () => {
      if (this.mapInitialized || !this.searchActive) return;

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

        this.mapInitialized = true;
        this.form.address = {
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

  methods: {
    getAddress() {
      return this.form.address;
    },
    isValid() {
      this.$v.form.$touch();
      return !this.$v.form.$error;
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
