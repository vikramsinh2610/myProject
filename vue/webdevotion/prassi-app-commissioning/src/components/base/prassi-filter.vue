<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-actions>
      <q-tabs inverted no-pane-border v-model="filterInternal.selected">
        <q-tab
          v-for="menu in menus"
          v-if="menu !== undefined"
          :key="menu._id"
          :name="menu._id"
          :label="menu.label"
          :disable="menu.disabled"
          boot
        >
          <q-tooltip v-if="menu.tooltip">
            {{ menu.tooltip }}
          </q-tooltip>
        </q-tab>
      </q-tabs>
      <q-btn-toggle
        class="p-pc-toggle q-mr-lg"
        style="margin-left: auto"
        v-if="btnToggle"
        v-model="btnToggleInternal"
        :readonly="disabled"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="btnToggleOptions"
      />
      <q-btn-toggle
        class="p-pc-toggle q-mr-lg"
        v-if="btnToggle2"
        v-model="btnToggleInternal2"
        :readonly="disabled"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="btnToggleOptions2"
      />
      <q-toggle
        class="p-pc-toggle q-mr-lg"
        :style="btnToggle ? '' : 'margin-left: auto;'"
        color="secondary"
        v-if="toggle"
        v-model="toggleInternal"
        :label="toggleLabel"
      />
      <q-toggle
        class="p-pc-toggle q-mr-lg"
        color="secondary"
        v-if="toggle2"
        v-model="toggleInternal2"
        :label="toggleLabel2"
      />
      <q-option-group
        class="p-pc-toggle q-mr-lg"
        style="margin-left: auto"
        v-if="overdue"
        v-model="installmentsInternal"
        :options="options"
        color="secondary"
        inline
        dense
      />
      <span v-if="labelTop" class="p-pf-plus">{{ labelTopText }}</span>
      <prassi-round-button
        v-if="plusMenu"
        class="p-pf-plus"
        icon="fa fa-ellipsis-v"
        @click="$emit('buttonPlusMenu')"
      >
        <template slot="popover">
          <slot name="popover" />
        </template>
      </prassi-round-button>
    </q-card-actions>
    <q-separator />
    <div class="row">
      <prassi-standard-button
        v-if="button"
        :label="buttonLabel"
        :loading="isFetching"
        @click="$emit('buttonClicked')"
      />
      <prassi-standard-button
        v-if="buttonAdditional"
        :label="buttonAdditionalLabel"
        :loading="isFetching"
        @click="$emit('buttonAdditionalClicked')"
      />
      <q-checkbox
        class="q-mx-md"
        v-if="checkbox"
        left-label
        v-model="checkedInternal"
        :label="checkboxLabel"
      />
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiFilter',
  data() {
    return {
      filterInternal: { ...this.filter },
      checkedInternal: false,
      toggleInternal: false,
      toggleInternal2: false,
      btnToggleInternal: 'all',
      btnToggleInternal2: 'all',
      installmentsInternal: 2,
      options: [
        {
          label: '2',
          value: 2,
        },
        {
          label: '3',
          value: 3,
        },
        {
          label: '4',
          value: 4,
        },
        {
          label: '5',
          value: 5,
        },
        {
          label: '6',
          value: 6,
        },
      ],
    };
  },
  props: {
    button: {
      type: Boolean,
      default: false,
    },
    buttonAdditional: {
      type: Boolean,
      default: false,
    },
    buttonLabel: {
      type: String,
      default: '',
    },
    buttonAdditionalLabel: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    overdue: {
      type: Boolean,
      default: false,
    },
    checkboxLabel: {
      type: String,
      default: '',
    },
    toggle: {
      type: Boolean,
      default: false,
    },
    toggleLabel: {
      type: String,
      default: '',
    },
    toggle2: {
      type: Boolean,
      default: false,
    },
    toggleLabel2: {
      type: String,
      default: '',
    },
    btnToggle: {
      type: Boolean,
      default: false,
    },
    btnToggleOptions: {
      type: Array,
      default: () => [],
    },
    btnToggle2: {
      type: Boolean,
      default: false,
    },
    btnToggleOptions2: {
      type: Array,
      default: () => [],
    },
    plusMenu: {
      type: Boolean,
      default: false,
    },
    labelTop: {
      type: Boolean,
      default: false,
    },
    labelTopText: {
      type: String,
      default: '',
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Object,
      default: () => ({
        selected: 'all',
      }),
    },
    menus: {
      type: Array,
      default: () => [
        {
          _id: 'menu1',
          label: 'Menu Item',
        },
      ],
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSI-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.selected': function (selected) {
      this.$utils.logobj('PRASSI-FILTER', 'filterInternal.selected', selected);
      this.$emit('changed', { ...this.filterInternal, selected });
    },
    checked(checked) {
      this.$utils.logobj('PRASSI-FILTER', 'checked', checked);
      this.checkedInternal = checked;
    },
    checkedInternal(checked) {
      this.$utils.logobj('PRASSI-FILTER', 'checkedInternal', checked);
      this.$emit('changedChecked', checked);
    },
    toggleInternal(checked) {
      this.$utils.logobj('PRASSI-FILTER', 'toggleInternal', checked);
      this.$emit('changedToggle', checked);
    },
    toggleInternal2(checked) {
      this.$utils.logobj('PRASSI-FILTER', 'toggleInternal2', checked);
      this.$emit('changedToggle2', checked);
    },
    btnToggleInternal(selected) {
      this.$utils.logobj('PRASSI-FILTER', 'btnToggleInternal', selected);
      this.$emit('changedBtnToggle', selected);
    },
    btnToggleInternal2(selected) {
      this.$utils.logobj('PRASSI-FILTER', 'btnToggleInternal', selected);
      this.$emit('changedBtnToggle2', selected);
    },
    installmentsInternal(option) {
      this.$utils.logobj('PRASSI-FILTER', 'installmentsInternal', option);
      this.$emit('changedOption', option);
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-top-left-radius 4px
  border-top-right-radius 4px
  border-bottom-right-radius 0
  border-bottom-left-radius 0
  border-top solid 1px $card-border
  border-left solid 1px $card-border
  border-right solid 1px $card-border
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 10px auto auto
.p-pf-plus:hover
  border-color $secondary
.q-card__actions
  padding 8px 8px 0 8px
</style>
