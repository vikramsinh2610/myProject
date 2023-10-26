<template>
  <div>
    <q-card
      :style="noBottomBorder ? 'border-bottom: solid 0 !important; width: 100%' : 'width: 100%'"
      inline
      flat
      :color="color"
      class="text-primary"
    >
      <q-card-section class="row no-wrap q-card-main">
        <prassi-conditional-block
          v-for="block in blocks"
          v-if="block !== undefined"
          :key="block._id"
          :label="block.label"
          :sublabel="block.sublabel"
          :sublabel-chip="block.sublabelChip"
          :size="block.size"
          :weight="block.weight"
          :width="block.width"
          :type="block.type"
          :color="block.color"
          :icon="block.icon"
          :chip-text="block.chipText"
          :col="block.col"
          :class-name="block.className"
        />
        <q-btn-toggle
          class="p-pc-toggle q-mr-sm"
          style="width: 200px"
          v-if="btnToggle"
          v-model="btnToggleInternal"
          :readonly="!btnToggleEnabled"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="btnToggleOptions"
        />
        <prassi-round-button
          class="q-mr-sm"
          :style="'width: 40px; height: 40px'"
          :disabled="hideMenuDelete"
          v-if="menuDelete"
          :icon="deleteIcon"
          @click.stop="$emit('deleteClick', id)"
        />
        <prassi-round-button
          class="q-mr-sm"
          :style="'width: 40px; height: 40px'"
          v-if="menu"
          :disabled="hideMenu"
          :icon="menuIcon"
          @click.stop="$emit('menuClick', id)"
        />
        <q-checkbox class="q-mx-md" v-if="checkbox" v-model="checkedInternal" />
        <q-toggle class="q-mx-md" v-if="toggleButton" v-model="toggleInternal" color="secondary" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import PrassiConditionalBlock from './prassi-conditional-block';

export default {
  name: 'PrassiBodyList',
  components: { PrassiConditionalBlock },
  data() {
    return {
      checkedInternal: this.checked,
      toggleInternal: this.toggle,
      btnToggleInternal: this.btnToggleSelected,
    };
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'white',
    },
    className: {
      type: String,
      default: '',
    },
    menu: {
      type: Boolean,
      default: false,
    },
    btnToggleEnabled: {
      type: Boolean,
      default: false,
    },
    menuDelete: {
      type: Boolean,
      default: false,
    },
    hideMenuDelete: {
      type: Boolean,
      default: false,
    },
    hideMenu: {
      type: Boolean,
      default: false,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    toggleButton: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    toggle: {
      type: Boolean,
      default: false,
    },
    noBottomBorder: {
      type: Boolean,
      default: false,
    },
    menuIcon: {
      type: String,
      default: 'fa fa-ellipsis-v',
    },
    deleteIcon: {
      type: String,
      default: 'fa fa-trash',
    },
    btnToggle: {
      type: Boolean,
      default: false,
    },
    btnToggleSelected: {
      type: String,
      default: 'all',
    },
    btnToggleOptions: {
      type: Array,
      default: () => [],
    },
    blocks: {
      type: Array,
      default: () => [
        {
          _id: 0,
          label: 'label',
          sublabel: 'sublabel',
          sublabelChip: false,
          size: 'small',
          weight: 'light',
          width: 70,
          type: '2rows',
          icon: 'fa fa-check',
          color: 'green',
          chipText: 'Ct',
          col: false,
          className: '',
        },
      ],
    },
  },
  watch: {
    checked(checked) {
      this.checkedInternal = checked;
    },
    checkedInternal(checked) {
      this.$utils.logobj('PRASSI-BODY-LIST', 'checkedInternal', checked);
      this.$emit('changedChecked', { id: this.id, checked });
    },
    toggleInternal(checked) {
      this.$utils.logobj('PRASSI-BODY-LIST', 'toggleInternal', checked);
      this.$emit('changedToggle', { id: this.id, checked });
    },
    btnToggleInternal(selected) {
      this.$utils.logobj('PRASSI-BODY-LIST', 'btnToggleInternal', selected);
      this.$emit('changedBtnToggle', { id: this.id, selected });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  margin-bottom 6px
  border-radius 4px
  border solid 1px $card-border
  padding-right 10px
.q-card-main
  position relative
  padding 5px 0 5px 16px
  align-items center
  height 60px
</style>
