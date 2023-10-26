<template>
  <div class="column">
    <prassi-search-filter
      :search-label="$t('configurationHeader.searchFilter')"
      @changedSearch="$emit('searchProduct', $event)"
    />

    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="products.length === 0 && !isFetching" />

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
        class="p-pl-promoter-item"
        v-for="product in products"
        :key="product._id"
        @click="$router.push(`/configuration/products/${product._id}`)"
      >
        <prassi-body-list
          :id="product._id"
          :blocks="myBody(product)"
          menu
          menu-icon="fa fa-copy"
          @menuClick="$emit('copyProduct', $event)"
        />
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';
import PrassiSearchFilter from '../base/prassi-search-filter';

export default {
  name: 'PrassiConfigurationProductList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList, PrassiSearchFilter },
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'configurationHeader.productCode',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '1',
          label: 'configurationHeader.productName',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 500,
          col: true,
        },
        {
          _id: '2',
          label: 'configurationHeader.type',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: '3-1',
          label: 'configurationHeader.productAvailable',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 70,
        },
        {
          _id: '3',
          label: 'configurationHeader.productAdvance',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 70,
        },
        {
          _id: '4',
          label: 'configurationHeader.Months',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 60,
        },
        {
          _id: '5',
          label: 'configurationHeader.Years',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 60,
        },
      ],
    };
  },
  props: {
    products: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(product) {
      return [
        {
          _id: '0',
          label: product.productCode,
          size: 'small',
          weight: 'normal',
          width: 150,
          type: '2rows',
        },
        {
          _id: '1',
          label: product.productName,
          size: 'small',
          weight: 'normal',
          width: 500,
          col: true,
          type: '2rows',
        },
        {
          _id: '2',
          label:
            product.premiumType === 'net'
              ? this.$t('configurationProduct.net')
              : this.$t('configurationProduct.gross'),
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: '3-1',
          type: 'icon',
          color: product.productAvailable ? 'green' : 'red',
          icon: product.productAvailable ? 'fa fa-thumbs-up' : 'fa fa-thumbs-down',
          width: 70,
        },
        {
          _id: '3',
          type: 'icon',
          color: product.advance ? 'green' : 'red',
          icon: product.advance ? 'fa fa-check' : 'fa fa-times',
          width: 70,
        },
        {
          _id: '4',
          label: `${this.$n(product.monthsOnSubscription, 'integer')}`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 60,
        },
        {
          _id: '5',
          label: `${this.$n(product.subscriptionYears, 'integer')}`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 60,
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-pl-promoter-item
  cursor pointer
</style>
