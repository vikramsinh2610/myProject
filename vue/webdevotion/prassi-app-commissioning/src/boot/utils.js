/* global CryptoJS */
/* eslint max-len: ["error", { "code": 100, "tabWidth": 4 }] */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this, unicorn/no-useless-undefined */
import { date } from 'quasar';
import CodiceFiscale from 'codice-fiscale-js';
import moment from 'moment';
import PrassiRoundButton from '../components/base/prassi-round-button';
import PrassiStandardButton from '../components/base/prassi-standard-button';
import constants from '../constants';

function parseIban(value) {
  return value.toUpperCase().replace(/\s/g, '');
}

function __modulo(a, b) {
  return ((a % b) + +b) % b;
}

function isValidIban(value) {
  const A = 'A'.charCodeAt(0);
  const Z = 'Z'.charCodeAt(0);
  let iban = parseIban(value);
  let block;

  // eslint-disable-next-line unicorn/better-regex
  const regex = /^IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}$/;

  if (!regex.test(iban)) {
    return false;
  }

  iban = iban.slice(4) + iban.slice(0, 4);
  let remainder = iban
    .split('')
    .map((n) => {
      const code = n.charCodeAt(0);
      if (code >= A && code <= Z) {
        return code - A + 10;
      }

      return n;
    })
    .join('');
  while (remainder.length > 2) {
    block = remainder.slice(0, 9);
    remainder = __modulo(Number.parseInt(block, 10), 97) + remainder.slice(block.length);
  }
  return __modulo(Number.parseInt(remainder, 10), 97) === 1;
}

export default ({ Vue }) => {
  class Utils {
    log(module, message) {
      console.log(`${module}: ${message}`);
    }

    err(module, message) {
      console.log(`${module}: ERROR!!: ${message}`);
    }

    logobj(module, message, event) {
      console.log(`${module}: ${message}`, event);
    }

    errobj(module, message, event) {
      console.log(`${module}: ERROR!!: ${message}`, event);
    }

    // noinspection JSUnusedGlobalSymbols
    apiUrl(path) {
      return `${Vue.prototype.$env.apiUrl}${path}`;
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    getApiCall = ({ commit, rootState }, apiCall) => {
      if (apiCall.request) commit(apiCall.request);
      commit('error/startRequest', undefined, { root: true });

      return new Promise((resolve, reject) => {
        Vue.prototype
          .$axios({
            method: apiCall.action ? apiCall.action : 'get',
            url: this.apiUrl(apiCall.url),
            headers: { Authorization: `Bearer ${rootState.login.token}` },
            data: apiCall.body,
          })
          .then((response) => {
            if (response.status < 200 || response.status > 299) {
              this.errobj(`getApiCall ${apiCall.url}`, 'error ', response);
              commit(
                'error/errorInternal',
                { message: response.data.message, status: response.status },
                { root: true },
              );
              if (response.status === 401 || response.status === 403) {
                commit('login/requestLogout', undefined, { root: true });
              }
              reject();
            } else {
              this.logobj(`getApiCall ${apiCall.url}`, 'response ok', response);
              try {
                if (apiCall.receive) commit(apiCall.receive, response.data);
                commit('error/resetError', undefined, { root: true });
                resolve(response.data);
              } catch (error) {
                this.err('API-CALL', `internal error: ${error}`);
                commit(apiCall.errorInternal, { message: `${error}`, status: response.status });
                reject();
              }
            }
          })
          .catch((error) => {
            if (error.response) {
              this.errobj(`getApiCall ${apiCall.url}`, 'error response', error);
              if (error.response.data !== undefined && error.response.data.message !== undefined) {
                this.errobj(`getApiCall ${apiCall.url}`, 'error response ', error);
                commit(
                  'error/errorInternal',
                  { message: error.response.data.message, status: error.response.status },
                  { root: true },
                );
                if (error.response.status === 401 || error.response.status === 403) {
                  commit('login/requestLogout', undefined, { root: true });
                }
                reject();
              } else {
                this.errobj(`getApiCall ${apiCall.url}`, 'error response', error);
                commit(
                  'error/errorInternal',
                  { message: `error: ${error.response.status}`, status: error.response.status },
                  { root: true },
                );
                if (error.response.status === 401 || error.response.status === 403) {
                  commit('login/requestLogout', undefined, { root: true });
                }
                reject();
              }
            } else if (error.request) {
              this.errobj(`getApiCall ${apiCall.url}`, 'error request', error);
              commit('error/errorConnection', undefined, { root: true });
              reject();
            } else {
              this.errobj(`getApiCall ${apiCall.url}`, 'error', error);
              commit('error/errorConnection', undefined, { root: true });
              reject();
            }
          });
      });
    };

    // eslint-disable-next-line sonarjs/cognitive-complexity
    compositionApiCallList = (apiCall) =>
      new Promise((resolve, reject) => {
        Vue.prototype
          .$axios({
            method: apiCall.action ? apiCall.action : 'get',
            url: this.apiUrl(apiCall.url),
            headers: { Authorization: `Bearer ${global.token}` },
            data: apiCall.body,
          })
          .then((response) => {
            if (response.status < 200 || response.status > 299) {
              this.errobj(`compositionApiCallList ${apiCall.url}`, 'error ', response);
              Vue.prototype.$q.notify(
                response.data.message || `Errore ${apiCall.url}: ${response.status}`,
              );
              reject();
            } else {
              this.logobj(`compositionApiCallList ${apiCall.url}`, 'response ok', response);
              resolve(response.data);
            }
          })
          .catch((error) => {
            if (error.response) {
              this.errobj(`compositionApiCallList ${apiCall.url}`, 'error response', error);
              Vue.prototype.$q.notify(
                error.response.data && error.response.data.message
                  ? error.response.data.message
                  : `Errore ${apiCall.url}: ${error.response.status}`,
              );
              reject();
            } else {
              this.errobj(`compositionApiCallList ${apiCall.url}`, 'error request', error);
              Vue.prototype.$q.notify('Errore di connessione');
              reject();
            }
          });
      });

    // eslint-disable-next-line sonarjs/cognitive-complexity
    getApiCallList = ({ commit, rootState }, apiCall) => {
      if (apiCall.request) commit(apiCall.request);

      return new Promise((resolve, reject) => {
        Vue.prototype
          .$axios({
            method: apiCall.action ? apiCall.action : 'get',
            url: this.apiUrl(apiCall.url),
            headers: { Authorization: `Bearer ${rootState.login.token}` },
            data: apiCall.body,
          })
          .then((response) => {
            if (response.status < 200 || response.status > 299) {
              this.errobj(`getApiCall ${apiCall.url}`, 'error ', response);
              commit(
                'error/errorInternal',
                { message: response.data.message, status: response.status },
                { root: true },
              );
              if (response.status === 401 || response.status === 403) {
                commit('login/requestLogout', undefined, { root: true });
              }
              reject();
            } else {
              this.logobj(`getApiCall ${apiCall.url}`, 'response ok', response);
              try {
                if (apiCall.receive) commit(apiCall.receive, response.data);
                resolve();
              } catch (error) {
                this.err('API-CALL', `internal error: ${error}`);
                commit(apiCall.errorInternal, { message: `${error}`, status: response.status });
                reject();
              }
            }
          })
          .catch((error) => {
            if (error.response) {
              this.errobj(`getApiCall ${apiCall.url}`, 'error response', error);
              if (error.response.data !== undefined && error.response.data.message !== undefined) {
                this.errobj(`getApiCall ${apiCall.url}`, 'error response ', error);
                if (error.response.status === 401 || error.response.status === 403) {
                  commit('login/requestLogout', undefined, { root: true });
                }
                reject();
              } else {
                this.errobj(`getApiCall ${apiCall.url}`, 'error response', error);
                if (error.response.status === 401 || error.response.status === 403) {
                  commit('login/requestLogout', undefined, { root: true });
                }
                reject();
              }
            } else if (error.request) {
              this.errobj(`getApiCall ${apiCall.url}`, 'error request', error);
              commit('error/errorConnection', undefined, { root: true });
              reject();
            } else {
              this.errobj(`getApiCall ${apiCall.url}`, 'error', error);
              commit('error/errorConnection', undefined, { root: true });
              reject();
            }
          });
      });
    };

    getSignedUrl = async (promoterId, letterId, token, type) => {
      // eslint-disable-next-line sonarjs/prefer-immediate-return
      const awsResponse = await Vue.prototype
        .$axios({
          method: 'get',
          url: this.apiUrl(
            // eslint-disable-next-line max-len
            `/v1/promoters/${promoterId}/letters/${letterId}/attachments/presigned-upload?extension=${type}`,
          ),
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.logobj('UTILS', 'getSignedUrl', response);
          if (response.status < 200 || response.status > 299) {
            // eslint-disable-next-line unicorn/no-useless-undefined
            return undefined;
          }
          return response;
        })
        .catch((error) => {
          this.errobj('UTILS', 'getSignedUrl', error);
          // eslint-disable-next-line unicorn/no-useless-undefined
          return undefined;
        });
      return awsResponse;
    };

    // noinspection JSUnusedGlobalSymbols
    numberToRate(rate, $t, unique) {
      switch (rate) {
        case 1:
          if (unique) return $t('months.unique');
          return $t('months.yearly');
        case 2:
          return $t('months.halfYearly');
        case 4:
          return $t('months.quarterly');
        case 12:
          return $t('months.monthly');
        default:
          return '';
      }
    }

    // noinspection JSUnusedGlobalSymbols
    numberToMonth(number, $t) {
      switch (number) {
        case 1:
          return $t('months.jan');
        case 2:
          return $t('months.feb');
        case 3:
          return $t('months.mar');
        case 4:
          return $t('months.apr');
        case 5:
          return $t('months.may');
        case 6:
          return $t('months.jun');
        case 7:
          return $t('months.jul');
        case 8:
          return $t('months.aug');
        case 9:
          return $t('months.sep');
        case 10:
          return $t('months.oct');
        case 11:
          return $t('months.nov');
        case 12:
          return $t('months.dec');
        default:
          return '';
      }
    }

    // noinspection JSUnusedGlobalSymbols
    customerStatus(number) {
      switch (number) {
        case 1:
          return 'Potenziale';
        case 2:
          return 'Prospect';
        case 3:
          return 'Contattato interessato';
        case 4:
          return 'Contattato non interessato';
        case 5:
          return 'Proposta in corso';
        case 6:
          return 'Contraente';
        case 7:
          return 'Da campagna online';
        case 8:
          return 'Revocato mandato';
        case 9:
          return 'Revocata privacy';
        case 10:
          return 'Collegato ad Azienda';
        default:
          return 'Nessun tipo';
      }
    }

    // noinspection JSUnusedGlobalSymbols
    customerType(number) {
      switch (number) {
        case 1:
          return 'Contatto';
        case 2:
          return 'Cliente';
        default:
          return 'Nessuno stato';
      }
    }

    numberToQuarter(number) {
      switch (number) {
        case 1:
          return 'Q1';
        case 2:
          return 'Q2';
        case 3:
          return 'Q3';
        case 4:
          return 'Q4';
        default:
          return '';
      }
    }

    quarterToMonth(number) {
      switch (number) {
        case 1:
          return 1;
        case 2:
          return 4;
        case 3:
          return 7;
        case 4:
          return 10;
        default:
          return 1;
      }
    }

    monthToQuarter(number) {
      switch (number) {
        case 1:
        case 2:
        case 3:
          return 1;
        case 4:
        case 5:
        case 6:
          return 2;
        case 7:
        case 8:
        case 9:
          return 3;
        case 10:
        case 11:
        case 12:
          return 4;
        default:
          return 1;
      }
    }

    // noinspection JSUnusedGlobalSymbols
    productivePeriodMonthList($t) {
      return [
        {
          label: $t('months.jan'),
          value: 1,
        },
        {
          label: $t('months.feb'),
          value: 2,
        },
        {
          label: $t('months.mar'),
          value: 3,
        },
        {
          label: $t('months.apr'),
          value: 4,
        },
        {
          label: $t('months.may'),
          value: 5,
        },
        {
          label: $t('months.jun'),
          value: 6,
        },
        {
          label: $t('months.jul'),
          value: 7,
        },
        {
          label: $t('months.aug'),
          value: 8,
        },
        {
          label: $t('months.sep'),
          value: 9,
        },
        {
          label: $t('months.oct'),
          value: 10,
        },
        {
          label: $t('months.nov'),
          value: 11,
        },
        {
          label: $t('months.dec'),
          value: 12,
        },
      ];
    }

    // noinspection JSUnusedGlobalSymbols
    addProductivePeriod(year, month) {
      return {
        month: month === 12 ? 1 : month + 1,
        year: month === 12 ? year + 1 : year,
      };
    }

    // noinspection JSUnusedGlobalSymbols
    subtractProductivePeriod(year, month) {
      return {
        month: month === 0 ? 12 : month,
        year: month === 0 ? year - 1 : year,
      };
    }

    isoToDisplayDate(dateParameter, $d) {
      return date ? $d(new Date(dateParameter)) : '-';
    }

    overlap(letter1, letter2) {
      if (
        !(
          letter1.toProductivePeriodYear &&
          letter1.toProductivePeriodMonth &&
          letter1.fromProductivePeriodYear &&
          letter1.fromProductivePeriodMonth &&
          letter2.toProductivePeriodYear &&
          letter2.toProductivePeriodMonth &&
          letter2.fromProductivePeriodYear &&
          letter2.fromProductivePeriodMonth
        )
      )
        return false;
      const fromCheck =
        `${letter1.toProductivePeriodYear}${letter1.toProductivePeriodMonth
          .toString()
          .padStart(2, '0')}` >=
        `${letter2.fromProductivePeriodYear}${letter2.fromProductivePeriodMonth
          .toString()
          .padStart(2, '0')}`;
      const toCheck =
        `${letter1.fromProductivePeriodYear}${letter1.fromProductivePeriodMonth
          .toString()
          .padStart(2, '0')}` <=
        `${letter2.fromProductivePeriodYear}${letter2.fromProductivePeriodMonth
          .toString()
          .padStart(2, '0')}`;
      return fromCheck && toCheck && letter1.type === letter2.type;
    }

    // noinspection JSUnusedGlobalSymbols
    calcPeriodString(year, month, quarter, range) {
      switch (range) {
        case 'allPeriod':
        case 'year':
          // eslint-disable-next-line max-len
          return `fromProductivePeriodYear=${year}&fromProductivePeriodMonth=01&toProductivePeriodYear=${year}&toProductivePeriodMonth=12`;
        case 'month':
          // eslint-disable-next-line max-len
          return `fromProductivePeriodYear=${year}&fromProductivePeriodMonth=${month}&toProductivePeriodYear=${year}&toProductivePeriodMonth=${month}`;
        case 'quarter':
          // eslint-disable-next-line no-case-declarations
          let toMonth = this.quarterToMonth(quarter) + 2;
          // eslint-disable-next-line no-case-declarations
          let toYear = year;
          // eslint-disable-next-line sonarjs/no-nested-switch
          switch (toMonth) {
            case 13:
              toMonth = 1;
              toYear += 1;
              break;
            case 14:
              toMonth = 2;
              toYear += 1;
              break;
            default:
              break;
          }
          // eslint-disable-next-line max-len
          return `fromProductivePeriodYear=${year}&fromProductivePeriodMonth=${this.quarterToMonth(
            quarter,
          )}&toProductivePeriodYear=${toYear}&toProductivePeriodMonth=${toMonth}`;
        default:
          return '';
      }
    }

    // noinspection JSUnusedGlobalSymbols
    calcPreviousPeriodString(year, month, quarter, range) {
      switch (range) {
        case 'year':
          // eslint-disable-next-line max-len
          return `fromPreviousProductivePeriodYear=${year}&fromPreviousProductivePeriodMonth=01&toPreviousProductivePeriodYear=${year}&toPreviousProductivePeriodMonth=12`;
        case 'month':
          // eslint-disable-next-line max-len
          return `fromPreviousProductivePeriodYear=${year}&fromPreviousProductivePeriodMonth=${month}&toPreviousProductivePeriodYear=${year}&toPreviousProductivePeriodMonth=${month}`;
        case 'quarter':
          // eslint-disable-next-line no-case-declarations
          let toMonth = this.quarterToMonth(quarter) + 2;
          // eslint-disable-next-line no-case-declarations
          let toYear = year;
          // eslint-disable-next-line sonarjs/no-nested-switch
          switch (toMonth) {
            case 13:
              toMonth = 1;
              toYear += 1;
              break;
            case 14:
              toMonth = 2;
              toYear += 1;
              break;
            default:
              break;
          }
          // eslint-disable-next-line max-len
          return `fromPreviousProductivePeriodYear=${year}&fromPreviousProductivePeriodMonth=${this.quarterToMonth(
            quarter,
          )}&toPreviousProductivePeriodYear=${toYear}&toPreviousProductivePeriodMonth=${toMonth}`;
        default:
          return '';
      }
    }

    auth(xhr, crypt) {
      // noinspection ES6ModulesDependencies
      const now = moment();
      xhr.setRequestheader('Date-Prassi', now.toISOString());
      // eslint-disable-next-line prefer-template
      const hash = CryptoJS.HmacSHA512(now.toISOString() + 'Sheltia.2018' + crypt, 'Elever.2017');
      xhr.setRequestHeader('Auth-Prassi', hash.toString(CryptoJS.enc.Base64));
    }

    // noinspection JSUnusedGlobalSymbols
    encode(toEncode) {
      if (toEncode !== undefined) {
        return encodeURI(toEncode.replace(/\s/g, '+')).toLowerCase();
      }
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    strip(toEncode) {
      if (toEncode !== undefined) {
        return encodeURI(toEncode.replace(/\s/g, '')).toLowerCase();
      }
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    splitUrl(urlstring, number) {
      if (urlstring === undefined) {
        return true;
      }

      const arrayPath = urlstring.split('/');
      let howMany = 0;

      arrayPath.forEach((element) => {
        if (element !== '') {
          howMany += 1;
        }
      });

      return howMany < number;
    }

    // noinspection JSUnusedGlobalSymbols
    safeJSONParse(data) {
      let returnData;
      try {
        returnData = JSON.parse(data);
        // eslint-disable-next-line unicorn/prefer-optional-catch-binding
      } catch (error) {
        returnData = undefined;
      }
      return returnData;
    }

    // noinspection JSUnusedGlobalSymbols
    dateHedline(myDate) {
      const now = moment();
      let datew = moment(myDate);
      if (now.diff(datew, 'minutes') <= 60) {
        const diff = now.diff(datew, 'minutes');
        datew = diff === 1 ? diff + this.locale.minuteago : diff + this.locale.minutesago;
      } else if (datew.isSame(now, 'day')) {
        const diff = now.diff(datew, 'hours');
        datew = diff === 1 ? diff + this.locale.hourago : diff + this.locale.hoursago;
      } else if (datew.isSame(now, 'week')) {
        datew = datew.format('dddd');
      } else if (datew.isSame(now, 'year')) {
        datew = datew.format('D MMMM');
      } else {
        datew = datew.format('D MMMM YYYY');
      }
      return datew;
    }

    getCustomerDisplayName(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (
        store.dossiers &&
        store.dossiers.customers &&
        store.dossiers.customers.items &&
        Array.isArray(store.dossiers.customers.items)
      ) {
        if (store.dossiers.customer && store.dossiers.customer._id === id) {
          return store.dossiers.customer.displayName;
        }
        const foundCustomer = store.dossiers.customers.items.find(
          (customer) => customer._id === id,
        );
        if (foundCustomer && foundCustomer.displayName) {
          return foundCustomer.displayName;
        }
      }
      return id;
    }

    getPersonDisplayName(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (
        store.dossiers &&
        store.dossiers.customers &&
        store.dossiers.customers.items &&
        Array.isArray(store.dossiers.customers.items)
      ) {
        if (store.dossiers.customer && store.dossiers.customer._id === id) {
          return store.dossiers.customer.displayname;
        }
        const foundCustomer = store.dossiers.customers.items.find(
          (customer) => customer._id === id,
        );
        if (foundCustomer && foundCustomer.displayname) {
          return foundCustomer.displayname;
        }
      }
      return id;
    }

    getPromoterDisplayName(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (
        store.promoters &&
        store.promoters.promoters &&
        store.promoters.promoters.items &&
        Array.isArray(store.promoters.promoters.items)
      ) {
        if (store.promoters.promoter && store.promoters.promoter._id === id) {
          return store.promoters.promoter.displayName;
        }
        const foundPromoter = store.promoters.promoters.items.find(
          (promoter) => promoter._id === id,
        );
        if (foundPromoter && foundPromoter.displayName) {
          return foundPromoter.displayName;
        }
      }
      return id;
    }

    getPromoterDisplayNameJob(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (
        store.configuration &&
        store.configuration.promoters &&
        store.configuration.promoters.items &&
        Array.isArray(store.configuration.promoters.items)
      ) {
        if (store.configuration.promoter && store.configuration.promoter._id === id) {
          return store.configuration.promoter.displayName;
        }
        const foundPromoter = store.configuration.promoters.items.find(
          (promoter) => promoter._id === id,
        );
        if (foundPromoter && foundPromoter.displayName) {
          return foundPromoter.displayName;
        }
      }
      return id;
    }

    getInvoiceNumber(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (store.invoicing && store.invoicing.invoice.item) {
        return store.invoicing.invoice.item.number;
      }
      return id;
    }

    getProductName(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (store.configuration && store.configuration.product) {
        return store.configuration.product.productName;
      }
      return id;
    }

    getSurveyName(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (store.configuration && store.configuration.types) {
        const type = store.configuration.types.find(
          (el) => el._id === store.configuration.survey.type,
        );
        return type
          ? `${type.description} - ${date.formatDate(
              store.configuration.survey.creationDate,
              'DD/MM/YYYY',
            )}`
          : id;
      }
      return id;
    }

    getProductSignalerName(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (store.configuration && store.configuration.signalerProduct) {
        return store.configuration.signalerProduct.productName;
      }
      return id;
    }

    getSurveyDisplayName(store) {
      if (store && store.surveys && store.surveys.survey) {
        const s = store.surveys.survey;
        return [s.type, s.codeSurveyResult].filter((x) => x).join(' – ');
      }

      return '';
    }

    getAcquittanceId(id, store) {
      if (!id) return '-';
      if (!store) return id;
      if (store.acquittance.acquittance && store.acquittance.acquittance.item) {
        return `${store.acquittance.acquittance.item.companyName} - ${date.formatDate(
          store.acquittance.acquittance.item.didCreatedDate,
          'DD-MM-YYYY',
        )}`;
      }
      return id;
    }

    first(tree, id) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      if (!tree) return undefined;
      // eslint-disable-next-line unicorn/no-useless-undefined
      if (!tree.children) return undefined;
      if (tree._id === id) return tree;

      let i;
      for (i = 0; i < tree.children.length; i += 1) {
        const found = this.first(tree.children[i], id);
        if (found) return found;
      }

      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }

    getFullMonthAndYearFromDateStr(dateStr) {
      if (!dateStr) return '-';
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4);
      const monthInItalian = constants.italianMonths[Number.parseInt(month, 10) - 1];
      return `${monthInItalian} - ${year}`;
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    addDate(filter, dateFlow) {
      const filterInternal = { ...filter };
      let newMonth = filterInternal.month;
      let newYear = filterInternal.year;
      let newQuarter = filterInternal.quarter;
      const actualYear = new Date().getFullYear();
      const actualMonth = new Date().getMonth() + 1;
      const isValidDateMonth =
        `${actualYear}${actualMonth.toString().padStart(2, '0')}` >=
        `${newYear}${newMonth.toString().padStart(2, '0')}`;
      const isValidDateQuarter =
        `${actualYear}${actualMonth.toString().padStart(2, '0')}` >=
        `${newYear}${this.quarterToMonth(newQuarter).toString().padStart(2, '0')}`;

      switch (filterInternal.selected) {
        case 'year':
          // eslint-disable-next-line no-case-declarations
          const isValidYear = new Date().getFullYear() >= filterInternal.year + 1;
          if (dateFlow === 'all' || dateFlow === 'onlyForward' || isValidYear) {
            filterInternal.year += 1;
          } else {
            throw new Error('dateRangeBlock.noForward');
          }
          break;
        case 'month':
          if (newMonth === 12) {
            newMonth = 1;
            newYear += 1;
          } else {
            newMonth += 1;
          }
          if (dateFlow === 'all' || dateFlow === 'onlyForward' || isValidDateMonth) {
            filterInternal.month = newMonth;
            filterInternal.year = newYear;
          } else {
            throw new Error('dateRangeBlock.noForward');
          }
          break;
        case 'quarter':
          if (newQuarter === 4) {
            newQuarter = 1;
            newYear += 1;
          } else {
            newQuarter += 1;
          }
          if (dateFlow === 'all' || dateFlow === 'onlyForward' || isValidDateQuarter) {
            filterInternal.quarter = newQuarter;
            filterInternal.year = newYear;
          } else {
            throw new Error('dateRangeBlock.noForward');
          }
          break;
        default:
          break;
      }

      return filterInternal;
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    subtractDate(filter, dateFlow) {
      const filterInternal = { ...filter };
      let newMonth = filterInternal.month;
      let newYear = filterInternal.year;
      let newQuarter = filterInternal.quarter;
      const actualYear = new Date().getFullYear();
      const actualMonth = new Date().getMonth() + 1;
      const isValidDateMonth =
        `${newYear}${newMonth.toString().padStart(2, '0')}` >=
        `${actualYear}${actualMonth.toString().padStart(2, '0')}`;
      const isValidDateQuarter =
        `${newYear}${this.quarterToMonth(newQuarter).toString().padStart(2, '0')}` >=
        `${actualYear}${actualMonth.toString().padStart(2, '0')}`;

      switch (filterInternal.selected) {
        case 'year':
          // eslint-disable-next-line no-case-declarations
          const isValidYear = new Date().getFullYear() <= filterInternal.year - 1;
          if (dateFlow === 'all' || dateFlow === 'onlyBackward' || isValidYear) {
            filterInternal.year -= 1;
          } else {
            throw new Error('dateRangeBlock.noBackward');
          }
          break;
        case 'month':
          if (newMonth === 1) {
            newMonth = 12;
            newYear -= 1;
          } else {
            newMonth -= 1;
          }
          if (dateFlow === 'all' || dateFlow === 'onlyBackward' || isValidDateMonth) {
            filterInternal.month = newMonth;
            filterInternal.year = newYear;
          } else {
            throw new Error('dateRangeBlock.noBackward');
          }
          break;
        case 'quarter':
          if (newQuarter === 1) {
            newQuarter = 4;
            newYear -= 1;
          } else {
            newQuarter -= 1;
          }
          if (dateFlow === 'all' || dateFlow === 'onlyBackward' || isValidDateQuarter) {
            filterInternal.quarter = newQuarter;
            filterInternal.year = newYear;
          } else {
            throw new Error('dateRangeBlock.noBackward');
          }
          break;
        default:
          break;
      }

      return filterInternal;
    }

    getRoleName(roles, roleId) {
      const role = roles.find((el) => el.networkId === roleId);
      if (role) {
        return role.name;
      }
      return 'Ruolo non trovato';
    }

    getAuthenticationName(roles, authenticationId) {
      const role = roles.find(
        (el) => el.authenticationId === Number.parseInt(authenticationId, 10),
      );
      if (role) {
        return role.authenticationName;
      }
      return 'Ruolo non trovato';
    }

    getRoleColor(roles, roleId) {
      const role = roles.find((el) => el.networkId === roleId);
      if (role) {
        return role.color;
      }
      return 'grey';
    }

    getRoleShortName(roles, roleId) {
      const role = roles.find((el) => el.networkId === roleId);
      if (role) {
        return role.shortName;
      }
      return 'NN';
    }

    getRoleArea(roles, roleId) {
      const role = roles.find((el) => el.networkId === roleId);
      if (role) {
        return role.area;
      }
      return 'no area';
    }

    getPromoterDisplayNameByPromoterId(promoters, promoterId) {
      const promoter = promoters.find((el) => el._id === promoterId);
      if (promoter) {
        return promoter.displayName;
      }
      return '';
    }

    checkFiscalCode(cfins) {
      if (!cfins) return true;

      const cf = cfins.toUpperCase();
      const cfReg = /^[A-Z]{6}(?:\d{2}[A-Z]){2}\d{3}[A-Z]$/;
      if (!cfReg.test(cf)) {
        return false;
      }

      const set1 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const set2 = 'ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const setpari = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const setdisp = 'BAKPLCQDREVOSFTGUHMINJWZYX';
      let s = 0;

      for (let i = 1; i <= 13; i += 2)
        s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
      for (let i = 0; i <= 14; i += 2)
        s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
      if (s % 26 !== cf.charCodeAt(15) - 'A'.charCodeAt(0)) return false;
      return true;
    }

    checkVatNumber(pi) {
      console.log('controllo', pi);
      if (!pi) return true;
      if (!/^\d{11}$/.test(pi)) return false;

      let s = 0;
      for (let i = 0; i <= 9; i += 2) {
        s += pi.charCodeAt(i) - '0'.charCodeAt(0);
      }
      for (let i = 1; i <= 9; i += 2) {
        let c = 2 * (pi.charCodeAt(i) - '0'.charCodeAt(0));
        if (c > 9) c -= 9;
        s += c;
      }
      const controllo = (10 - (s % 10)) % 10;
      if (controllo !== pi.charCodeAt(10) - '0'.charCodeAt(0)) return false;

      return true;
    }

    checkIban(input) {
      if (!input) return true;
      if (input === '000000000000000000000000000') return true;

      return isValidIban(input);
    }

    checkNotNegative(value) {
      if (!value) return true;

      const n = Number.parseInt(value, 10);
      if (Number.isNaN(n)) return false;

      return n >= 0;
    }

    checkPastDate(value) {
      return new Date() >= moment(value, 'DD-MM-YYYY');
    }

    getSurveyAttachmentSignedUrl = async (entityId, token, type) => {
      // eslint-disable-next-line sonarjs/prefer-immediate-return
      const awsResponse = await Vue.prototype
        .$axios({
          method: 'get',
          url: this.apiUrl(
            // eslint-disable-next-line max-len
            `/v1/workflow/upload/${entityId}?extension=${type}`,
          ),
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.logobj('UTILS', 'getSurveyAttachmentSignedUrl', response);
          if (response.status < 200 || response.status > 299) {
            // eslint-disable-next-line unicorn/no-useless-undefined
            return undefined;
          }
          return response;
        })
        .catch((error) => {
          this.errobj('UTILS', 'getSurveyAttachmentSignedUrl', error);
          // eslint-disable-next-line unicorn/no-useless-undefined
          return undefined;
        });
      return awsResponse;
    };

    setFormValuesFromCodiceFiscale(cf, form) {
      try {
        const res = new CodiceFiscale(cf);
        form.birthDate = res.birthday.toLocaleDateString('it-IT').split('/').join('-');
        form.birthCity = res.birthplace.nome;
        form.birthRegion = res.birthplace.prov;
        form.sex = res.gender;

        if (res.birthplace.prov !== 'EE') {
          form.nationality = 'ITALIANA';
          form.birthState = 'ITALIA';
        } else {
          form.nationality = res.birthplace.nome;
          form.birthState = res.birthplace.nome;
        }
        // eslint-disable-next-line no-empty, unicorn/prefer-optional-catch-binding
      } catch (error) {}
    }

    dossierUrl(id, token) {
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      // eslint-disable-next-line max-len
      return `${Vue.prototype.$env.legacyBaseUrl}/#/contratto/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}?token=${token}`;
    }

    // precontractual: 3 years expiry
    precontractualExpiration(precontractual) {
      if (!precontractual.signedDate) return undefined;

      return moment(precontractual.signedDate).add(3, 'years');
    }

    // inquiry: 1 years expiry
    inquirySurveyExpiration(survey) {
      if (!survey.signature?.signedDate) return undefined;

      return moment(survey.signature.signedDate).add(1, 'years');
    }
  }

  Vue.prototype.$utils = new Utils();
  global.utils = Vue.prototype.$utils;
  Vue.use(PrassiRoundButton);
  Vue.component('prassi-round-button', PrassiRoundButton);
  Vue.component('prassi-standard-button', PrassiStandardButton);
};
