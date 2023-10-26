import {
  receiveProposalsDirect,
  receiveProposalsIndirect,
  receiveProposalsIndirectItems,
  receiveProposalsSummary,
  setProposalsFilterYear,
  setProposalsFilterSelected,
  resetProposalsDirect,
  resetProposalsIndirect,
} from './mutations';
import * as types from '../const';

describe('mutations', () => {
  let state;

  beforeEach(() => {
    state = {
      error: false,
      errorType: types.NO_ERROR,
      errorMessage: '',
      isFetching: false,
      direct: {
        skip: 0,
        items: [],
      },
      indirect: {
        skip: 0,
        items: [],
      },
      summary: {
        consultants: 0,
        previousConsultants: 0,
        percentageConsultants: 0,
        insured: 0,
        previousInsured: 0,
        percentageInsured: 0,
        premiums: 0,
        previousPremiums: 0,
        percentagePremiums: 0,
        IV: 0,
        previousIV: 0,
        percentageIV: 0,
        PZ: 0,
        previousPZ: 0,
        percentagePZ: 0,
      },
      filter: {
        time: {
          selected: 'year',
          year: 2018,
          quarter: '',
          month: '',
        },
        type: {
          selected: 'indirect',
        },
      },
    };
  });

  it('requestProposals change isFetching to true', () => {
    expect(state).toBe(state);
  });

  it('receiveProposalsDirect load items list', () => {
    receiveProposalsDirect(state, { _meta: { _id: '000000' }, items: [1, 2, 3] });
    expect(state.direct.items).toEqual([1, 2, 3]);
  });

  it('receiveProposalsIndirect load items list', () => {
    receiveProposalsIndirect(state, { _meta: { _id: '000000' }, items: [1, 2, 3] });
    expect(state.indirect.items).toEqual([1, 2, 3]);
  });

  it('receiveProposalsIndirectItems load items list', () => {
    receiveProposalsIndirect(state, { _meta: { _id: '000000' }, items: [{ _id: '000001' }] });
    receiveProposalsIndirectItems(state, { _meta: { _id: '000001' }, items: [1, 2, 3] });
    expect(state.indirect.items[0].proposals).toEqual([1, 2, 3]);
  });

  it('receiveProposalsSummary load totals', () => {
    receiveProposalsSummary(state, { _meta: { _id: '000000' }, item: { consultants: 100 } });
    expect(state.summary.consultants).toEqual(100);
  });

  it('setProposalsFilterYear change filter year', () => {
    setProposalsFilterYear(state, 2020);
    expect(state.filter.time.year).toEqual(2020);
  });

  it('setProposalsFilterYear change filter year', () => {
    setProposalsFilterSelected(state, 'all');
    expect(state.filter.type.selected).toEqual('all');
  });

  it('resetProposalsIndirect to []', () => {
    resetProposalsIndirect(state);
    expect(state.indirect.items).toEqual([]);
  });

  it('resetProposalsDirect to []', () => {
    resetProposalsDirect(state);
    expect(state.direct.items).toEqual([]);
  });
});
