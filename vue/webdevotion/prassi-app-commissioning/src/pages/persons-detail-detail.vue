<template>
  <div class="fill-available row">
    <prassi-person-edit :person="person" class="col-12 q-mr-sm" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PrassiPersonEdit from '../components/person/prassi-person-edit';

export default {
  name: 'PersonDetailDetail',
  components: {
    PrassiPersonEdit,
  },
  computed: {
    ...mapState({
      person: (state) => state.dossiers.customer,
      isFetching: (state) => state.error.isFetching,
    }),
  },
};
</script>

<style lang="stylus" scoped></style>
