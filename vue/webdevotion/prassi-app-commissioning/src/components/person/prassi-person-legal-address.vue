<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">{{ $t('person.contact') }}</div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12 search-box"
            v-model="form.searchAddress"
            type="text"
            :label="$t('person.search')"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.legalAddress.route"
            type="text"
            :label="$t('person.legalAddress')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.route.$error"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.legalAddress.streetNumber"
            type="text"
            :label="$t('person.number')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.streetNumber.$error"
            @blur="$v.form.legalAddress.streetNumber.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.legalAddress.city"
            type="text"
            :label="$t('person.city')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.city.$error"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.legalAddress.postalCode"
            type="text"
            :label="$t('person.postalCode')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.postalCode.$error"
            @blur="$v.form.legalAddress.postalCode.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.legalAddress.province"
            type="text"
            :label="$t('person.province')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.province.$error"
            @blur="$v.form.legalAddress.province.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.legalAddress.country"
            type="text"
            :label="$t('person.country')"
            :error-message="$t('person.error')"
            :error="$v.form.legalAddress.country.$error"
            @keyup.enter="submit"
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
      <div class="row justify-between q-my-xs">
        <div class="map col-12" style="height: 500px"></div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

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

      this.createMap();

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
        this.map.setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        this.map.fitBounds(place.geometry.viewport);
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        // eslint-disable-next-line unicorn/no-null
        this.marker.setMap(null);
        // eslint-disable-next-line no-undef
        this.marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          // eslint-disable-next-line no-undef
          animation: google.maps.Animation.DROP,
        });

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
          latitude: lat,
          longitude: lng,
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
    createMap() {
      // eslint-disable-next-line no-undef
      const geocoder = new google.maps.Geocoder();
      const lat = this.person.legalAddress?.latitude ?? this.form.legalAddress.latitude;
      const lng = this.person.legalAddress?.longitude ?? this.form.legalAddress.longitude;
      if (lat && lng) {
        // eslint-disable-next-line no-undef,no-unused-vars
        this.map = new google.maps.Map(this.$el.querySelector('.map'), {
          center: {
            lat,
            lng,
          },
          zoom: 17,
        });
        // eslint-disable-next-line no-undef,no-unused-vars
        this.marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          // eslint-disable-next-line no-undef,no-unused-vars
          animation: google.maps.Animation.DROP,
        });
      } else if (
        this.person.legalAddress.route &&
        this.person.legalAddress.route !== '' &&
        this.person.displayLegalAddress
      ) {
        geocoder.geocode({ address: this.person.displayLegalAddress }, (results, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.GeocoderStatus.OK) {
            // eslint-disable-next-line vue/no-mutating-props
            this.person.legalAddress.latitude = results[0].geometry.location.lat();
            // eslint-disable-next-line vue/no-mutating-props
            this.person.legalAddress.longitude = results[0].geometry.location.lng();
            // eslint-disable-next-line no-undef,no-unused-vars
            this.map = new google.maps.Map(this.$el.querySelector('.map'), {
              center: {
                lat: this.person.legalAddress.latitude,
                lng: this.person.legalAddress.longitude,
              },
              zoom: 17,
            });
            // eslint-disable-next-line no-undef,no-unused-vars
            this.marker = new google.maps.Marker({
              position: {
                lat: this.person.legalAddress.latitude,
                lng: this.person.legalAddress.longitude,
              },
              map: this.map,
              // eslint-disable-next-line no-undef,no-unused-vars
              animation: google.maps.Animation.DROP,
            });
          } else {
            this.setMapDefault();
          }
        });
      } else {
        this.setMapDefault();
      }
    },
    setMapDefault() {
      // eslint-disable-next-line no-undef,no-unused-vars
      this.map = new google.maps.Map(this.$el.querySelector('.map'), {
        center: {
          // eslint-disable-next-line no-undef
          lat: 41.8719,
          // eslint-disable-next-line no-undef
          lng: 12.5674,
        },
        zoom: 5,
      });
      // eslint-disable-next-line no-undef,no-unused-vars
      this.marker = new google.maps.Marker({
        position: { lat: 41.8719, lng: 12.5674 },
        map: this.map,
        // eslint-disable-next-line no-undef,no-unused-vars
        animation: google.maps.Animation.DROP,
      });
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
      this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact');

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', this.form);
        const changedPerson = {
          ...this.person,
          legalAddress: this.form.legalAddress,
        };
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', changedPerson);
        this.$emit('changeData', { item: changedPerson });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },

    triggerFromParent() {
      this.$v.form.$touch();
      return { data: this.form, valid: !this.$v.form.$error };
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
