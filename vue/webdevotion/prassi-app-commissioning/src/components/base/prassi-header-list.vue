<template>
  <q-card
    style="width: 100%; padding-right: 10px"
    inline
    flat
    class="bg-header text-primary"
    :class="noScrollbar ? '' : 'listing-header-container'"
  >
    <div
      v-if="title"
      class="q-pa-xs text-center text-weight-bold"
      :class="titleColor ? titleColor : 'text-secondary'"
    >
      {{ titleText }}
    </div>
    <q-separator v-if="title" class="q-mr-10" />
    <q-card-section class="row no-wrap q-card-section">
      <div
        class="p-c-fit"
        :class="block.col ? 'col' : ''"
        :style="block.col ? 'min-width: 50px' : ''"
        v-for="block in blocks"
        v-if="block !== undefined"
        :key="block._id"
        @click="() => (block.sortable ? block.sortable() : undefined)"
      >
        <prassi-two-rows-block
          :label="$t(`${block.label}`)"
          :sublabel="$t(`${block.sublabel}`)"
          :size="block.size"
          :weight="block.weight"
          :width="block.width"
          :col="block.col"
          :sortable="!!block.sortable"
        />
      </div>
      <prassi-round-button class="q-mr-sm invisible" v-if="menuDelete" />
      <prassi-round-button class="q-mr-sm invisible" v-if="placeholder" />
      <q-checkbox
        class="q-mx-md"
        :class="checkboxVisible ? '' : 'invisible'"
        v-if="checkbox"
        v-model="checkedInternal"
      />
      <q-toggle class="q-mx-md invisible" v-if="toggleButton" :value="false" />
    </q-card-section>
  </q-card>
</template>

<script>
import PrassiTwoRowsBlock from './prassi-two-rows-block';

export default {
  name: 'PrassiHeaderList',
  components: { PrassiTwoRowsBlock },
  data() {
    return {
      checkedInternal: false,
    };
  },
  props: {
    placeholder: {
      type: Boolean,
      default: false,
    },
    title: {
      type: Boolean,
      default: false,
    },
    titleText: {
      type: String,
      default: 'Title',
    },
    titleColor: {
      type: String,
      default: '',
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    checkboxVisible: {
      type: Boolean,
      default: false,
    },
    toggleButton: {
      type: Boolean,
      default: false,
    },
    menuDelete: {
      type: Boolean,
      default: false,
    },
    noScrollbar: {
      type: Boolean,
      default: false,
    },
    blocks: {
      type: Array,
      default: () => [
        {
          _id: 0,
          label: 'label',
          sublabel: 'sublabel',
          size: 'small',
          weight: 'light',
          width: 70,
          col: false,
          sortable: false,
        },
      ],
    },
  },
  watch: {
    checkedInternal(checked) {
      this.$utils.logobj('PRASSI-HEADER-LIST', 'checkedInternal', checked);
      this.$emit('changedChecked', { id: this.id, checked });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-top-left-radius 0
  border-top-right-radius 0
  border-bottom-right-radius 4px
  border-bottom-left-radius 4px
  border solid 1px $card-border
.q-card-section
  position relative
  padding 0 0 0 16px
  align-items center
.p-c-fit
  display inline-flex
.p-c-fit:hover
  cursor pointer
.q-mr-10
  margin-right 10px
</style>
