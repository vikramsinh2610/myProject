<template>
  <div>
    <q-input
      class="col-12"
      v-model="form.extraInfo"
      type="text"
      :label="$t('person.extraInfo')"
      :error-message="$t('person.error')"
      :error="$v.form.extraInfo.$error"
      @blur="$v.form.extraInfo.$touch"
      :readonly="hasSignature"
    />
    <q-input
      class="col-12 search-box"
      v-model="searchAddress"
      :readonly="readOnly"
      type="text"
      :label="'Cerca comune'"
    />
    <q-input
      class="col-12"
      v-model="form.place"
      type="text"
      :label="$t('person.signingPlace')"
      :error-message="$t('person.error')"
      :error="$v.form.place.$error"
      @blur="$v.form.place.$touch"
      :readonly="hasSignature"
    />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapState } from 'vuex';

export default {
  name: 'ConsultingEndExtraInfo',
  components: {},

  data() {
    return {
      form: {
        extraInfo: '',
        place: '',
      },
      searchAddress: '',
      map: false, // google map initialized flag
    };
  },

  mounted() {
    const { extraInfo } = this.consulting;
    if (!extraInfo) return;

    this.$set(this.form, 'extraInfo', extraInfo.extraInfo);
    this.$set(this.form, 'place', extraInfo.place);
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
        const comune = place.address_components.find((el) =>
          el.types.includes('administrative_area_level_3'),
        );
        this.form.place = comune && comune.short_name ? comune.short_name.toUpperCase() : '';
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

  validations() {
    return {
      form: {
        extraInfo: {},
        place: { required },
      },
    };
  },

  computed: {
    ...mapState({
      consulting: (state) => state.consulting.result,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    triggerFromParent() {
      this.$v.form.$touch();
      return { data: this.form, valid: !this.$v.form.$error };
    },
  },
};
</script>
