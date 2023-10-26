<template>
  <div class="column">
    <prassi-header-list
      class="p-ll-item"
      :blocks="myHeader"
      :placeholder="$user.roleID >= 7"
      v-if="!singlePromoter"
    />
    <prassi-header-list
      class="p-ll-item"
      :blocks="myHeaderPromoterLetters"
      :placeholder="$user.roleID >= 7"
      v-if="singlePromoter"
    />

    <prassi-empty-list v-if="letters.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-target-id"
      class="fill-available"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-target-id"
    >
      <div style="height: 6px" />
      <div
        class="p-ll-item"
        v-for="letter in letters"
        :key="letter._id"
        @click="$emit('viewClick', letter._id)"
      >
        <prassi-body-list
          :blocks="myBody(letter)"
          :menu="$user.roleID >= 7"
          :color="letter.overlap ? 'double' : 'white'"
          :id="letter._id"
          @menuClick="$emit('menuClick', $event)"
        />
      </div>
    </q-infinite-scroll>

    <q-page-sticky
      v-if="singlePromoter && $user.roleID >= 7"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        ref="addButton"
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$emit('addLetter')"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiLetterList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      filter: {
        selected: 'all',
      },
      myHeader: [
        {
          _id: '0',
          label: 'letterHeader.dateSigning',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
          sortable: () => {
            this.$emit('sort', 'signatureDate');
          },
        },
        {
          _id: '2',
          label: 'letterHeader.number',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
          sortable: () => {
            this.$emit('sort', '_id');
          },
        },
        !this.singlePromoter
          ? {
              _id: '21',
              label: 'promoterHeader.displayName',
              sublabel: '',
              size: 'small',
              weight: 'normal',
              width: 340,
              sortable: () => {
                this.$emit('sort', 'promoterDisplayName');
              },
              col: true,
            }
          : undefined,
        {
          _id: '3',
          label: 'letterHeader.type',
          sublabel: 'letterHeader.description',
          size: 'small',
          weight: 'light',
          width: 250,
          sortable: () => {
            this.$emit('sort', 'type');
          },
          col: this.singlePromoter,
        },
        {
          _id: '4',
          label: 'letterHeader.active',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 40,
        },
        {
          _id: '5',
          label: 'letterHeader.dateEndValid',
          sublabel: 'letterHeader.dateStartValid',
          size: 'small',
          weight: 'normal',
          width: 100,
          sortable: () => {
            this.$emit('sort', 'didCreateDate');
          },
        },
        {
          _id: '8',
          label: 'letterHeader.attachment',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 60,
        },
      ],
      myHeaderPromoterLetters: [
        {
          _id: '0',
          label: 'letterHeader.dateSigning',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: '2',
          label: 'letterHeader.number',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        !this.singlePromoter
          ? {
              _id: '21',
              label: 'promoterHeader.displayName',
              sublabel: '',
              size: 'small',
              weight: 'normal',
              width: 340,
              col: true,
            }
          : undefined,
        {
          _id: '3',
          label: 'letterHeader.type',
          sublabel: 'letterHeader.description',
          size: 'small',
          weight: 'light',
          width: 120,
          col: this.singlePromoter,
        },
        {
          _id: '4',
          label: 'letterHeader.active',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 40,
        },
        {
          _id: '5',
          label: 'letterHeader.dateEndValid',
          sublabel: 'letterHeader.dateStartValid',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '8',
          label: 'letterHeader.attachment',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 60,
        },
      ],
    };
  },
  props: {
    letters: {
      type: Array,
      default: () => [],
    },
    singlePromoter: {
      type: Boolean,
      default: false,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapMutations({
      setLetterSorting: 'promoters/setLetterSorting',
    }),
    myBody(letter) {
      return [
        {
          _id: '-1',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: this.$t(`letterChipText.${letter.type}`),
        },
        {
          _id: '0',
          label: this.$utils.isoToDisplayDate(letter.signatureDate, this.$d.bind(this)),
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        {
          _id: '2',
          label: letter._id,
          size: 'large',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        !this.singlePromoter
          ? {
              _id: '21',
              label: letter.promoterDisplayName,
              size: 'large',
              weight: 'normal',
              width: 340,
              type: '2rows',
              col: true,
            }
          : undefined,
        {
          _id: '3',
          label: this.$t(`promoterInsertLetter.${letter.type}`),
          sublabel: letter.description,
          size: 'large',
          weight: 'normal',
          width: 250,
          type: '2rows',
          col: this.singlePromoter,
        },
        {
          _id: '4',
          type: 'icon',
          color: (() => {
            switch (letter.status) {
              case 'active':
                return 'green';
              case 'wip':
                return 'grey';
              default:
                return 'red';
            }
          })(),
          icon: (() => {
            switch (letter.status) {
              case 'active':
                return 'fa fa-check';
              case 'wip':
                return 'fa fa-edit';
              default:
                return 'fa fa-times';
            }
          })(),
          width: 40,
        },
        {
          _id: '5',
          label:
            letter.toProductivePeriodYear && letter.toProductivePeriodMonth
              ? `${letter.toProductivePeriodYear} / ${letter.toProductivePeriodMonth}`
              : '-',
          sublabel:
            letter.fromProductivePeriodYear && letter.fromProductivePeriodMonth
              ? `${letter.fromProductivePeriodYear} / ${letter.fromProductivePeriodMonth}`
              : '-',
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '8',
          type: 'icon',
          color: letter.hasAttachments ? 'green' : 'red',
          icon: letter.hasAttachments ? 'fa fa-check' : 'fa fa-times',
          width: 60,
        },
      ];
    },
    stopScrolling() {
      this.$utils.log('LETTER-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('LETTER-LIST', 'RESUME SCROLLING');
      if (typeof this.$refs.infiniteScroll !== 'undefined') {
        this.$refs.infiniteScroll.resume();
      }
    },
    forceScrolling() {
      this.$utils.log('LETTER-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-ll-item
  padding-left 10px
  cursor pointer
</style>
