<template>
  <div class="column fill-available">
    <prassi-letter-filter
      v-if="$route.name === 'letters-all'"
      :letters-types="letterTypes"
      :filter="filterLetters"
      @changed="filterLetterChange"
    />
    <prassi-letter-list
      class="fill-available"
      :letters="letters"
      :is-fetching="isFetching"
      :single-promoter="$route.name !== 'letters-all'"
      @viewClick="viewLetter"
      @menuClick="menuClick"
      @addLetter="addLetter"
      @loadMore="loadMoreLetters"
      @sort="sortLetters"
      ref="letterList"
    />

    <q-dialog v-model="showCopyDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('promoterDetail.insertTitleDialog') }}</div>
        </q-card-section>
        <q-card-section style="overflow-x: scroll">
          <div class="column justify-center q-my-lg" style="height: 370px">
            <prassi-promoter-filter roles :role-types="roles" @changed="filterTypeChange" />
            <prassi-promoter-check-list
              ref="promoterChecklist"
              class="fill-available"
              :promoters="promoters"
              :roles="roles"
              @changeChecked="setChecked($event)"
              @changeCheckedAll="setCheckedAll($event)"
            />
            <q-spinner-dots v-if="isFetching" class="block margin-auto" color="primary" size="40" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="column items-center">
            <q-toggle v-model="active" :label="$t('promoterDetail.active')" color="secondary" />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            :disable="disable"
            :label="$t('default.copyButton')"
            @click="confirmCopyLetter"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showResultsDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('promoterDetail.insertTitleDialogResult') }}</div>
        </q-card-section>
        <q-card-section>
          <div
            class="row"
            :class="status.copyOk ? '' : 'p-pc-red-section'"
            v-for="status in copyStatus"
            :key="status.promoterId"
          >
            {{ findPromoter(status.promoterId) ? findPromoter(status.promoterId).displayName : '' }}
            -
            {{
              status.copyOk
                ? $t('promoterDetail.letterCopied')
                : $t('promoterDetail.letterCopiedError')
            }}
            -
            {{
              status.activationOk
                ? $t('promoterDetail.letterActivated')
                : $t('promoterDetail.letterNotActivated')
            }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.okButton')" @click="confirmOkResults" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-spinner-dots
      v-if="isFetching && $route.name === 'letters-all'"
      class="center-spinner"
      color="primary"
      size="40"
    />
  </div>
</template>

<script>
import { required, between } from 'vuelidate/lib/validators';
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiLetterList from '../components/letter/prassi-letter-list';
import PrassiPromoterCheckList from '../components/letter/prassi-promoter-check-list';
import PrassiPromoterFilter from '../components/promoter/prassi-promoter-filter';
import PrassiLetterFilter from '../components/letter/prassi-letter-filter';

export default {
  name: 'PromotersDetailLetters',
  components: {
    PrassiLetterList,
    PrassiPromoterCheckList,
    PrassiPromoterFilter,
    PrassiLetterFilter,
  },
  data() {
    return {
      showCopyDialog: false,
      showResultsDialog: false,
      active: false,
      selectedLetter: '',
      searchPromoters: '',
      disable: true,
    };
  },
  validations: {
    yearPeriod: {
      required,
      integer: true,
      between: between(2000, 2999),
    },
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      letter: (state) => state.promoters.letter,
      letters: (state) => state.promoters.letters.items,
      letterTypes: (state) => state.promoters.letters.types,
      filterLetters: (state) => state.promoters.letters.filter,
      promoters: (state) => state.promoters.promoters.items,
      copyStatus: (state) => state.promoters.copyStatus.items,
      filter: (state) => state.promoters.filter,
      roles: (state) => state.promoters.roles.items,
      lastLetter: (state) => state.promoters.letters.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchLetters: 'promoters/fetchLetters',
      fetchPromoterLetters: 'promoters/fetchPromoterLetters',
      createPromoterLetter: 'promoters/createPromoterLetter',
      disablePromoterLetter: 'promoters/disablePromoterLetter',
      deletePromoterLetter: 'promoters/deletePromoterLetter',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      copyPromoterLetter: 'promoters/copyPromoterLetter',
      fetchRoles: 'promoters/fetchRoles',
    }),
    ...mapMutations({
      resetPromoters: 'promoters/resetPromoters',
      resetRoles: 'promoters/resetRoles',
      resetPromoterLetters: 'promoters/resetPromoterLetters',
      resetPromoterLetter: 'promoters/resetPromoterLetter',
      resetPromoterLetterAttachments: 'promoters/resetPromoterLetterAttachments',
      setPromotersChecked: 'promoters/setPromotersChecked',
      setPromotersCheckedAll: 'promoters/setPromotersCheckedAll',
      setLettersFilterType: 'promoters/setLettersFilterType',
      setLettersFilterPromoter: 'promoters/setLettersFilterPromoter',
      setLetterSorting: 'promoters/setLetterSorting',
      setPromoterFilterRoleType: 'promoters/setPromoterFilterRoleType',
      setPromoterFilterSearch: 'promoters/setPromoterFilterSearch',
    }),
    setChecked(checked) {
      this.setPromotersChecked(checked);
      this.disable = this.promoters.filter((el) => el.checked).length <= 0;
    },
    setCheckedAll(checked) {
      this.setPromotersCheckedAll(checked);
      this.$nextTick(() => {
        this.disable = this.promoters.filter((el) => el.checked).length <= 0;
      });
    },
    findPromoter(promoterId) {
      return this.promoters.find((el) => el._id === promoterId);
    },
    addLetter() {
      this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'addLetter', 'addLetter');
      this.resetPromoterLetter();
      this.resetPromoterLetterAttachments();
      this.createPromoterLetter(this.$route.params.id).then(() => {
        this.$router.push(`/promoters/${this.$route.params.id}/letters/${this.letter._id}`);
      });
    },
    viewLetter(id) {
      this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'viewLetter', id);
      this.$router.push(
        `/promoters/${this.letters.find((el) => el._id === id).promoterId}/letters/${id}`,
      );
    },
    confirmCopyLetter() {
      this.$utils.log('PROMOTERS-DETAIL-LETTERS', 'confirmCopy');
      this.$q.loading.show({ delay: 200 });
      this.copyPromoterLetter({
        promoterId: this.selectedLetter.promoterId,
        letterId: this.selectedLetter._id,
        body: { promoterIds: this.promoters.filter((el) => el.checked).map((el) => el._id) },
        activate: this.active,
      })
        .then(() => {
          this.$utils.log('PROMOTERS-INSERT-LETTER', 'saveLetterType');
          this.resetPromoterLetters();
          this.$q.loading.hide();
          this.showCopyDialog = false;
          this.showResultsDialog = true;
        })
        .finally(() => {
          this.showCopyDialog = false;
          this.$q.loading.hide();
        });
    },
    confirmOkResults() {
      this.$utils.log('PROMOTERS-DETAIL-LETTERS', 'confirmOk');
      this.showResultsDialog = false;
    },
    selectAllPromoters() {
      this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'selectAllPromoters', 'selectAllPromoters');
      this.setPromotersCheckedAll(true);
    },
    filterTypeChange(filterType) {
      this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'filterTypeChange', filterType);
      this.setPromoterFilterRoleType(filterType.roleType.value);
      this.setPromoterFilterSearch(filterType.searchPromoter);
      this.resetPromoters();
      this.fetchAllPromoters();
    },
    filterLetterChange(filterLetter) {
      this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'filterLetterChange', filterLetter);
      this.setLettersFilterType(filterLetter.type);
      this.setLettersFilterPromoter(filterLetter.promoterDisplayName);
      this.resetPromoterLetters();
    },
    sortLetters(sort) {
      this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'sortLetters', sort);
      this.setLetterSorting(sort);
      this.resetPromoterLetters();
    },
    menuClick(param) {
      this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'menuClick', param);
      this.selectedLetter = this.letters.find((el) => el._id === param);
      const actions = [
        {
          label:
            this.selectedLetter.status === 'wip'
              ? this.$t('promoterDetail.change')
              : this.$t('promoterDetail.view'),
          icon: this.selectedLetter.status === 'active' ? 'fa fa-eye' : 'fa fa-edit',
          color: 'green',
          handler: () => {
            this.$utils.logobj('PROMOTERS-DETAIL-LETTERS', 'Change', param);
            this.viewLetter(param);
          },
        },
        {
          label: this.$t('promoterDetail.copy'),
          icon: 'fa fa-copy',
          color: 'black',
          handler: () => {
            this.showCopyDialog = true;
            this.resetPromoters();
            this.fetchAllPromoters().then(() => {
              this.$nextTick().then(() => {
                this.$refs.promoterChecklist.forceScrolling();
              });
            });
          },
        },
      ];

      if (this.selectedLetter.status === 'active') {
        actions.unshift({
          label: this.$t('promoterDetail.disable'),
          icon: 'fa fa-times',
          color: 'red',
          handler: () => {
            this.disablePromoterLetter({
              promoterId: this.selectedLetter.promoterId,
              letterId: param,
            }).then(() => {
              this.$nextTick().then(() => {
                this.$q.notify({
                  message: this.$t('promoterInsertLetter.disableOk'),
                  color: 'secondary',
                  timeout: 300,
                });
              });
              this.resetPromoterLetters();
            });
          },
        });
      }

      if (this.selectedLetter.status === 'wip') {
        actions.unshift({
          label: this.$t('promoterDetail.delete'),
          icon: 'fa fa-trash',
          color: 'red',
          handler: () => {
            this.deletePromoterLetter({
              promoterId: this.selectedLetter.promoterId,
              letterId: param,
            }).then(() => {
              this.$nextTick().then(() => {
                this.$q.notify({
                  message: this.$t('promoterInsertLetter.deletedOk'),
                  color: 'secondary',
                  timeout: 300,
                });
              });
              this.resetPromoterLetters();
            });
          },
        });
      }

      this.$q
        .bottomSheet({
          title:
            // eslint-disable-next-line prefer-template
            this.$t(`promoterInsertLetter.${this.selectedLetter.type}`) + ' ' + param,
          dismissLabel: 'Quit',
          actions,
        })
        .onOk((action) => {
          action.handler();
        });
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreLetters({ index, done }) {
      if (this.lastLetter || this.error) {
        this.$refs.letterList.stopScrolling();
      } else {
        this.$route.params.id
          ? this.fetchPromoterLetters(this.$route.params.id).finally(() => {
              done();
            })
          : this.fetchLetters().finally(() => {
              done();
            });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.center-spinner
  display block
  margin auto
</style>
