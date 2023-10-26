<template>
  <div class="fill-available row">
    <prassi-person-edit-precontractual
      v-if="person && person.id && !person.isCompany"
      :person="person"
      :is-fetching="isFetching"
      class="col-12 q-mr-sm"
    />
    <prassi-person-legal-edit-precontractual
      v-if="person && person.isCompany"
      :person="person"
      :is-fetching="isFetching"
      class="col-12 q-mr-sm"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PrassiPersonEditPrecontractual from '../components/person/precontractual/prassi-person-edit-precontractual';
import PrassiPersonLegalEditPrecontractual from '../components/person/precontractual/prassi-person-legal-edit-precontractual';

export default {
  name: 'PersonDetailDetail',
  components: {
    PrassiPersonEditPrecontractual,
    PrassiPersonLegalEditPrecontractual,
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
