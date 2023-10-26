<template>
  <div>
    <prassi-header-list class="p-pl-item" :blocks="myHeader" />
    <div style="height: 6px" />
    <div class="p-pl-item" v-for="proposal in proposals" :key="proposal._id">
      <prassi-body-list :blocks="myBody(proposal)" />
    </div>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';

export default {
  name: 'PrassiProposalList',
  components: { PrassiHeaderList, PrassiBodyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'proposalHeader.effectDate',
          sublabel: 'proposalHeader.termDate',
          size: 'small',
          weight: 'normal',
          width: 70,
        },
        {
          _id: '1',
          label: 'proposalHeader.contractId',
          sublabel: 'proposalHeader.proposal',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: '2',
          label: 'proposalHeader.product',
          sublabel: 'proposalHeader.company',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '3',
          label: 'proposalHeader.insured',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 240,
        },
        {
          _id: '4',
          label: 'proposalHeader.premium',
          sublabel: 'proposalHeader.rate',
          size: 'small',
          weight: 'light',
          width: 60,
        },
        {
          _id: '5',
          label: 'proposalHeader.iv',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 90,
        },
        {
          _id: '6',
          label: 'proposalHeader.late',
          sublabel: 'proposalHeader.wait',
          size: 'small',
          weight: 'light',
          width: 40,
        },
        {
          _id: '7',
          label: 'proposalHeader.status',
          sublabel: 'proposalHeader.payments',
          size: 'small',
          weight: 'normal',
          width: 80,
        },
      ],
    };
  },
  props: {
    proposals: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    myBody(proposal) {
      return [
        {
          _id: '0',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: proposal.type,
        },
        {
          _id: '1',
          label: this.$d(new Date(proposal.effectDate)),
          sublabel: this.$d(new Date(proposal.termDate)),
          size: 'small',
          weight: 'normal',
          width: 70,
          type: '2rows',
        },
        {
          _id: '2',
          label: proposal.contractId,
          sublabel: proposal.proposalId,
          size: 'medium',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        {
          _id: '3',
          label: proposal.productName,
          sublabel: proposal.insurerName,
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '4',
          label: proposal.insuredName,
          size: 'large',
          weight: 'light',
          width: 240,
          type: '2rows',
        },
        {
          _id: '5',
          label: `${this.$n(proposal.premiumGross / 100, 'nodecimals')}€`,
          sublabel: proposal.recurring,
          size: 'medium',
          weight: 'light',
          width: 60,
          type: '2rows',
        },
        {
          _id: '6',
          label: `${this.$n(proposal.iv / 100, 'nodecimals')} IV`,
          size: 'medium',
          weight: 'light',
          width: 90,
          type: '2rows',
        },
        {
          _id: '7',
          label: this.$n(proposal.late, 'nodecimals'),
          sublabel: `${this.$n(proposal.wait, 'nodecimals')}/${this.$n(
            proposal.paid,
            'nodecimals',
          )}`,
          size: 'medium',
          weight: 'light',
          width: 40,
          type: '2rows',
        },
        {
          _id: '8',
          label: proposal.state,
          sublabel: proposal.payments,
          size: 'small',
          weight: 'normal',
          width: 80,
          type: '2rows',
        },
        {
          _id: '9',
          type: 'icon',
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-pl-item
  padding-left 10px
</style>
