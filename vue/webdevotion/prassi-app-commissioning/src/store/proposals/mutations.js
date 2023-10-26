import Vue from 'vue';

export const receiveProposalsSummary = (state, { item }) => {
  state.summary.consultants = item.consultants;
  state.summary.previousConsultants = item.previousConsultants;
  state.summary.percentageConsultants = Math.round(
    (100 / item.previousConsultants) * item.consultants - 100,
  );
  state.summary.insured = item.insured;
  state.summary.previousInsured = item.previousInsured;
  state.summary.percentageInsured = Math.round((100 / item.previousInsured) * item.insured - 100);
  state.summary.premiums = item.premiums;
  state.summary.previousPremiums = item.previousPremiums;
  state.summary.percentagePremiums = Math.round(
    (100 / item.previousPremiums) * item.premiums - 100,
  );
  state.summary.iv = item.iv;
  state.summary.previousIV = item.previousIV;
  state.summary.percentageIV = Math.round((100 / item.previousIV) * item.iv - 100);
  state.summary.pc = item.pc;
  state.summary.previousPC = item.previousPC;
  state.summary.percentagePC = Math.round((100 / item.previousPC) * item.pc - 100);
};

export const receiveProposalsDirect = (state, { items }) => {
  state.direct.skip += 20;
  state.direct.items = [...state.direct.items, ...items];
};

export const resetProposalsDirect = (state) => {
  state.direct.skip = 0;
  state.direct.items = [];
};

export const receiveProposalsIndirect = (state, { items }) => {
  state.indirect.skip += 20;
  state.indirect.items = [...state.indirect.items, ...items];
};

export const resetProposalsIndirect = (state) => {
  state.indirect.skip = 0;
  state.indirect.items = [];
};

export const receiveProposalsIndirectItems = (state, { _meta, items }) => {
  state.indirect.items.forEach((element) => {
    if (element._id === _meta._id) {
      if (element.proposals === undefined) {
        Vue.set(element, 'skip', 0);
        Vue.set(element, 'proposals', items);
      } else {
        Vue.set(element, 'skip', (element.skip += 20));
        Vue.set(element, 'proposals', [...element.proposals, ...items]);
      }
    }
  });
};

export const setProposalsFilterYear = (state, year) => {
  state.filter = {
    time: { ...state.filter.time, selected: 'year', year },
    type: { ...state.filter.type },
  };
};

export const setProposalsFilterSelected = (state, selected) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, selected },
  };
};
