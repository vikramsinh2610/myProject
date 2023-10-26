<template>
  <div class="column fill-available">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" :menu-delete="$user.roleID >= 7" />

    <prassi-empty-list v-if="documents.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-target-id"
      class="fill-available relative-position"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-target-id"
    >
      <div style="height: 6px" />
      <div
        class="p-pl-promoter-item"
        v-for="document in documents"
        :key="document.id"
        @click="$emit('viewClick', document)"
      >
        <prassi-body-list
          :menu-delete="$user.roleID >= 7"
          :blocks="myBody(document)"
          delete-icon="fa fa-trash"
          @deleteClick="deleteDocument(document)"
        />
      </div>
      <q-spinner-ios
        v-if="isFetching"
        :class="
          documents && documents.length !== 0 && !showProgress
            ? 'center-spinner'
            : 'center-spinner-first'
        "
        color="primary"
        :size="documents && documents.length !== 0 && !showProgress ? '40' : '80'"
      />
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiPersonIdentityCardList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  updated() {
    this.resumeScrolling();
    if (this.documents.length === 0) {
      this.forceScrolling();
    }
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'customerHeader.displayName',
          sublabel: 'customer.fiscalCode',
          size: 'small',
          weight: 'normal',
          width: 274,
          col: true,
        },
        {
          _id: '1',
          label: 'customer.documentType',
          sublabel: 'customer.documentNumber',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '3',
          label: 'customer.issueDate',
          sublabel: 'customer.expiryDate',
          size: 'small',
          weight: 'light',
          width: 120,
        },
      ],
    };
  },
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
    offsetSticky: {
      type: Array,
      default: () => [18, 18],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('PERSON-IDENTITY-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('PERSON-IDENTITY-LIST', 'RESUME SCROLLING NEW');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('PERSON-IDENTITY-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    deleteDocument(document) {
      this.$emit('deleteDocument', document);
    },
    myBody(document) {
      return [
        {
          _id: '0',
          label: document.displayname,
          sublabel: document.fiscalCode,
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: document.documentType ? document.documentType.value : '-',
          sublabel: document.documentNumber ? document.documentNumber : '-',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '3',
          label: document.issueDate ? this.$d(new Date(document.issueDate)) : '-',
          sublabel: document.expiryDate ? this.$d(new Date(document.expiryDate)) : '-',
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-pl-promoter-item
  cursor pointer
.center-spinner
  display block
  margin auto
.center-spinner-first
  display block
  margin auto
  position: absolute;
  top: 50%;
  left: calc(50% - 40px);
  transform: translateY(-50%);
</style>
