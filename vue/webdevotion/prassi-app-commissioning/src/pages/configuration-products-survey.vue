<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <div style="margin-top: 3em">
      <q-card>
        <q-card-section>
          <p>1. Scarica il CSV con la lista di prodotti e le risposte all'analisi dei bisogni.</p>
          <prassi-standard-button label="Scarica csv" @click="downloadCsv" />

          <p>
            2. Compila il CSV con una "x" sui prodotti/risposte desiderati e ricarica il file. Non
            modificare il nome di colonne o il loro ordine.
          </p>
          <q-uploader
            class="full-width"
            ref="uploader"
            accept=".csv"
            :required="true"
            :multiple="false"
            label="Upload nuovo csv"
            :factory="uploadFile"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import download from 'getfile-rename-js';

export default {
  name: 'ConfigurationProductsSurvey',
  data() {
    return {};
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      token: (state) => state.login.token,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    uploadFile(files) {
      const reader = new FileReader();

      reader.readAsDataURL(files[0]);

      reader.addEventListener('load', async () => {
        const store = { rootState: this.$store.state, commit: this.$store.commit };
        const file = reader.result.split('base64,').pop();

        await this.$utils.getApiCall(store, {
          url: `/v1/product-configurations/upload`,
          action: 'PUT',
          body: {
            file,
          },
        });

        this.$refs.uploader.reset();
        this.$q.notify({
          message: 'Tabella analisi dei bisogni aggiornata',
          color: 'secondary',
          timeout: 2000,
        });
      });
    },
    async downloadCsv() {
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const file = await this.$utils.getApiCall(store, {
        url: `/v1/product-configurations/download`,
      });

      await download(file, 'products.csv');
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
