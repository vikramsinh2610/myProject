import {
  receivePromoter,
  receivePromoterCompanyProfile,
  receivePromoterLetters,
  receivePromoterLetter,
  receivePromoterInvoices,
  receivePromoterDocuments,
  receivePromoterLetterAttachments,
  receivePromoters,
  setPromotersFilterSelected,
  setPromotersFilterYear,
  resetPromoterLetters,
  resetPromoterInvoices,
  resetPromoterDocuments,
  resetPromoters,
  resetPromoterLetter,
  receivePromoterLetterSettings,
} from './mutations';
import * as types from '../const';

describe('mutations', () => {
  let state;

  beforeEach(() => {
    state = {
      error: false,
      errorType: types.NO_ERROR,
      errorMessage: '',
      errorNotFound: false,
      isFetching: false,
      summary: {
        count: 0,
        previousCount: 0,
        percentageCount: 0,
        network: 0,
        previousNetwork: 0,
        percentageNetwork: 0,
        enabled: 0,
        previousEnabled: 0,
        percentageEnabled: 0,
        gone: 0,
        previousGone: 0,
        percentageGone: 0,
      },
      promoters: {
        skip: 0,
        items: [],
      },
      letters: {
        skip: 0,
        items: [],
      },
      documents: {
        skip: 0,
        items: [],
      },
      invoices: {
        skip: 0,
        items: [],
      },
      letter: {
        _id: '',
        type: '',
        status: '',
        promoterId: '',
        promoterSerialNumber: '',
        promoterDisplayName: '',
        description: '',
        signatureDate: '',
      },
      promoter: {
        _id: '',
        approvationState: {},
        area: {},
        dateExit: '',
        dateInsert: '',
        enabled: false,
        lastLogin: '',
        name: '',
        role: '',
        surname: '',
        userName: '',
      },
      filter: {
        time: {
          selected: 'year',
          year: 2018,
          quarter: '',
          month: '',
        },
        type: {
          selected: 'all',
        },
      },
      attachments: {
        items: [],
      },
      letterSettings: {
        types: {},
      },
    };
  });

  it('requestPromoters change isFetching to true', () => {
    expect(state).toEqual(state);
  });

  it('receivePromoters load items list', () => {
    receivePromoters(state, { _id: '000000', items: [{ _id: '000001' }] });
    expect(state.promoters.items[0]).toEqual({ _id: '000001' });
  });

  it('receivePromoter load items list', () => {
    receivePromoter(state, { item: { _id: '000000' } });
    expect(state.promoter).toEqual({ _id: '000000' });
  });

  it('receivePromoterCompanyProfile load items list', () => {
    receivePromoterCompanyProfile(state, { item: { count: 100 } });
    expect(state.companyProfile.count).toEqual(100);
  });

  it('receivePromoterLetters load letters', () => {
    receivePromoterLetters(state, { _id: '000000', items: [{ _id: '000001' }] });
    expect(state.letters.items[0]).toEqual({ _id: '000001' });
  });

  it('receivePromoterInvoices load invoices', () => {
    receivePromoterInvoices(state, { _id: '000000', items: [{ _id: '000001' }] });
    expect(state.invoices.items[0]).toEqual({ _id: '000001' });
  });

  it('receivePromoterDocuments load documents', () => {
    receivePromoterDocuments(state, { _id: '000000', items: [{ _id: '000001' }] });
    expect(state.documents.items[0]).toEqual({ _id: '000001' });
  });

  it('receivePromoterLetter load letter', () => {
    receivePromoterLetter(state, { _id: '000000', item: { _id: '000001' } });
    expect(state.letter._id).toEqual('000001');
  });

  it('receivePromoterLetterAttachments load letters', () => {
    receivePromoterLetterAttachments(state, { _id: '000000', items: [{ _id: '000001' }] });
    expect(state.attachments.items[0]).toEqual({ _id: '000001' });
  });

  it('resetPromoters to []', () => {
    resetPromoters(state);
    expect(state.promoters.items).toEqual([]);
  });

  it('resetPromoterLetters to []', () => {
    resetPromoterLetters(state);
    expect(state.promoters.items).toEqual([]);
  });

  it('resetPromoterInvoices to []', () => {
    resetPromoterInvoices(state);
    expect(state.invoices.items).toEqual([]);
  });

  it('resetPromoterDocuments to []', () => {
    resetPromoterDocuments(state);
    expect(state.documents.items).toEqual([]);
  });

  it('setPromotersFilterYear change filter year', () => {
    setPromotersFilterYear(state, 2020);
    expect(state.filter.time.year).toEqual(2020);
  });

  it('setPromotersFilterSelected change filter year', () => {
    setPromotersFilterSelected(state, 'all');
    expect(state.filter.type.selected).toEqual('all');
  });

  it('resetPromoterLetter to initial', () => {
    resetPromoterLetter(state);
    expect(state.letter._id).toEqual('');
  });

  it('receivePromoterLetterSettings to state', () => {
    receivePromoterLetterSettings(state, { _id: '000000', item: { types: { _id: '000001' } } });
    expect(state.letterSettings.types._id).toEqual('000001');
  });
});
