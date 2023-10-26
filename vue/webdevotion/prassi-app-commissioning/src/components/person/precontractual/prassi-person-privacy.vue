<template>
  <q-card inline flat color="white" text-color="primary" style="width: 700px">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">
        {{ $t('personPrecontractual.privacy') }}
      </div>
      <div>
        <div class="row justify-between q-my-xs">
          <div class="full-width">
            <p class="text-h6">Minima</p>
            <q-separator />
            <p class="desc">
              Esprimo il consenso al trattamento dei dati idonei a rivelare dati particolari per le
              finalità connesse alla sottoscrizione/gestione del/i contratt/i, la ricezione di
              comunicazioni di carattere informativo e per l’esercizio dell’attività di brokeraggio
              assicurativo tramite formale mandato
            </p>
            <q-option-group
              v-model="form.isMinimal"
              :options="[
                { label: 'ACCONSENTO', value: true },
                {
                  label: 'NON ACCONSENTO',
                  value: false,
                },
              ]"
              disable
              class="text-center"
              :type="'radio'"
              size="30px"
              color="primary"
              :error="$v.form.isMinimal.$error"
              inline
            />
            <p class="text-h6">Marketing</p>
            <q-separator />
            <p class="desc">
              Esprimo il consenso al trattamento dei miei dati per le finalità di marketing sopra
              indicate: invio di comunicazioni commerciali/promozionali, tramite modalità
              automatizzate di contatto (come e-mail, sms o mms) e tradizionali (come telefonate con
              operatore e posta tradizionale) sui propri prodotti e servizi, segnalazione di eventi
              aziendali, rilevazione del grado di soddisfazione della clientela, nonché
              realizzazione di indagini di mercato ed analisi statistiche
            </p>
            <q-option-group
              v-model="form.isMarketing"
              :options="[
                { label: 'ACCONSENTO', value: true },
                {
                  label: 'NON ACCONSENTO',
                  value: false,
                },
              ]"
              :disable="readOnly"
              class="text-center"
              :type="'radio'"
              size="30px"
              color="primary"
              inline
            />
            <p class="text-h6">Profilazione</p>
            <q-separator />
            <p class="desc">
              Esprimo il consenso al trattamento automatizzato dei miei dati personali, ivi inclusa
              la profilazione, effettuato per analizzare le mie preferenze, abitudini, interessi
              (...) al fine di ricevere comunicazioni commerciali personalizzate.
            </p>
            <q-option-group
              v-model="form.isProfile"
              :disable="readOnly"
              :options="[
                { label: 'ACCONSENTO', value: true },
                {
                  label: 'NON ACCONSENTO',
                  value: false,
                },
              ]"
              class="text-center"
              :type="'radio'"
              size="30px"
              color="primary"
              inline
            />
          </div>
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12 search-box"
            v-model="searchAddress"
            :readonly="readOnly"
            type="text"
            :label="'Cerca comune'"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.signPlacePrivacy"
            :readonly="readOnly"
            type="text"
            label="Luogo Firma"
            :error-message="$t('person.error')"
            :error="$v.form.signPlacePrivacy.$error"
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
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPersonPrivacy',
  data() {
    return {
      form: {
        // eslint-disable-next-line unicorn/no-null
        id: null,
        isMinimal: true,
        isMarketing: false,
        isProfile: false,
        signPlacePrivacy: '',
      },
      searchAddress: '',
      map: false, // google map initialized flag
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
    precontractual: {
      type: Object,
      default: () => ({}),
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    precontractual: {
      immediate: true,
      handler(precontractual) {
        this.$utils.logobj('PRASSI-PERSON-DOCUMENT-CARD', 'precontractual', precontractual);
        if (!precontractual.id) return;
        this.form.isMinimal = true;
        this.form.isMarketing = precontractual.marketingCheck
          ? precontractual.marketingCheck
          : false;
        this.form.isProfile = precontractual.profileCheck ? precontractual.profileCheck : false;
        this.form.signPlacePrivacy = precontractual.signPlacePrivacy;
      },
    },
  },
  validations() {
    const v = this.required ? { required } : {};
    return {
      form: {
        isMinimal: {
          checked(value) {
            return value === true;
          },
        },
        signPlacePrivacy: v,
      },
    };
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
        const comune = place.address_components.find((el) =>
          el.types.includes('administrative_area_level_3'),
        );
        this.form.signPlacePrivacy =
          comune && comune.short_name ? comune.short_name.toUpperCase() : '';
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
      this.$utils.logobj('PRASSI-PERSON-PRIVACY', 'submit person privacy');
      const changedPrecontractual = {
        minimalCheck: true,
        marketingCheck: this.form.isMarketing,
        profileCheck: this.form.isProfile,
        signPlacePrivacy: this.form.signPlacePrivacy,
      };
      if (!this.$v.form.$error) {
        this.$emit('changePrecontractual', {
          data: changedPrecontractual,
          stepper: { name: 'privacy', status: 'completed' },
        });
      } else {
        this.$emit('changePrecontractual', {
          data: changedPrecontractual,
          stepper: { name: 'privacy', status: 'uncompleted' },
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.text-h6
  margin 0px
.desc
  margin-top 10px
  color #666666
  font-weight 400
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
