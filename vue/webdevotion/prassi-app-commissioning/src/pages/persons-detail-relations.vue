<template>
  <div class="fill-available column">
    <prassi-person-relation-list
      ref="personList"
      :persons="persons"
      :is-fetching="isFetching"
      @loadMore="loadMorePersons"
      @viewClick="gotoPractice"
      @detailClick="gotoPerson"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import PrassiPersonRelationList from '../components/person/prassi-person-relation-list';

export default {
  name: 'PersonsDetailRelations',
  components: {
    PrassiPersonRelationList,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      persons: (state) => state.dossiers.personRelations.items,
      last: (state) => state.dossiers.personRelations.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchPersonRelations: 'dossiers/fetchPersonRelations',
    }),
    ...mapMutations({
      resetPersonRelations: 'dossiers/resetPersonRelations',
    }),
    gotoPerson(person) {
      this.$utils.logobj('PERSON-DETAIL-RELATIONS', 'gotoPerson', person);
      this.$router.push(`/persons/${person.uuid}`);
    },
    gotoPractice(person) {
      this.$utils.logobj('PERSON-DETAIL-RELATIONS', 'gotoPractice', person);
      const msId = person.practiceUuid.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      window.open(
        `${this.$env.legacyBaseUrl}/#/contratto/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}?token=${this.token}`,
        '_self',
      );
    },
    // eslint-disable-next-line no-unused-vars
    loadMorePersons({ index, done }) {
      if (this.last || this.error) {
        this.$refs.personList.stopScrolling();
      } else {
        this.$utils.logobj('PERSON-DETAIL-RELATIONS', 'loadMorePersons', index);
        this.fetchPersonRelations(this.$route.params.id).finally(() => done());
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
</style>
