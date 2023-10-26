<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <div style="margin-top: 3em">
      <q-card>
        <q-card-section>
          <p>Upload numeriche SEPA</p>
          <q-uploader
            class="full-width"
            ref="uploader"
            accept=".csv"
            :required="true"
            :multiple="false"
            label="Upload nuovo csv"
            :factory="uploadFile"
          />

          <div style="margin-top: 2em; cursor: pointer" @click="downloadCsv">
            Export numeriche SEPA presenti
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import download from 'getfile-rename-js';

export default {
  name: 'ConfigurationSepaNumbers',
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
          url: `/v1/numbers/upload-sepa`,
          action: 'PUT',
          body: {
            file,
          },
        });

        this.$refs.uploader.reset();
        this.$q.notify({
          message: 'Tabella numeriche SEPA aggiornata',
          color: 'secondary',
          timeout: 2000,
        });
      });
    },
    async downloadCsv() {
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const file = await this.$utils.getApiCall(store, {
        url: `/v1/numbers/download-sepa`,
      });

      await download(file, 'sepa-numbers.csv');
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
