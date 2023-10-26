// eslint-disable-next-line max-classes-per-file
class Address {
  constructor({ route, houseNumber, postalCode, city, province, country }) {
    this.route = route;
    this.houseNumber = houseNumber;
    this.postalCode = postalCode;
    this.city = city;
    this.province = province;
    this.country = country;
  }
}

class Contractor {
  constructor({ name, vatNumber, fiscalCode, address, birthDate, birthCity }) {
    this.name = name;
    this.vatNumber = vatNumber;
    this.fiscalCode = fiscalCode;
    this.address = new Address(address);
    this.birthDate = birthDate;
    this.birthCity = birthCity;
  }
}

class Entry {
  constructor({ name, value, origin, productivePeriodMonth, productivePeriodYear, installments = [] }) {
    this.name = name;
    this.value = value;
    this.origin = origin;
    this.productivePeriodMonth = productivePeriodMonth;
    this.productivePeriodYear = productivePeriodYear;
    this.installments = installments;
  }
}

class Content {
  constructor({ grossTotal, grossEntries = [], taxEntries = [], netEntries = [] }) {
    this.grossTotal = new Entry(grossTotal);
    this.grossEntries = grossEntries.map((e) => new Entry(e));
    this.taxEntries = taxEntries.map((e) => new Entry(e));
    this.netEntries = netEntries.map((e) => new Entry(e));
  }
}

class Payment {
  constructor({ paymentCondition, bank }) {
    this.paymentCondition = paymentCondition;
    this.bank = bank;
  }
}

class PDFInput {
  constructor({
    regimeType,
    invoiceNumber,
    fiscalYear,
    emissionDate,
    dueDate,
    trustDate,
    productivePeriodMonth,
    productivePeriodYear,
    total,
    totalIV = 0,
    payment,
    iban,
    recipient,
    sender,
    content,
  }) {
    this.regimeType = regimeType;
    this.invoiceNumber = invoiceNumber;
    this.fiscalYear = fiscalYear;
    this.emissionDate = emissionDate;
    this.dueDate = dueDate;
    this.trustDate = trustDate;
    this.productivePeriodMonth = productivePeriodMonth;
    this.productivePeriodYear = productivePeriodYear;
    this.total = total;
    this.totalIV = totalIV;
    this.payment = new Payment(payment);
    this.iban = iban;
    this.recipient = new Contractor(recipient);
    this.sender = new Contractor(sender);
    this.content = new Content(content);
  }

  static getJSONSchema() {
    return {
      body: {
        type: 'object',
        properties: {
          regimeType: {
            type: 'string',
            enum: ['ordinary', 'minimum', 'flat'],
          },
          invoiceNumber: {
            type: 'integer',
            minimum: 0,
          },
          fiscalYear: {
            type: 'integer',
            minimum: 2000,
            maximum: 2099,
          },
          emissionDate: {
            type: 'string',
            description: 'ISO6801 date',
          },
          dueDate: {
            type: 'string',
            description: 'ISO6801 date',
          },
          birthDate: {
            type: 'string',
            description: 'ISO6801 date',
          },
          productivePeriodMonth: {
            type: 'integer',
            minumum: 0,
            maximum: 12,
          },
          productivePeriodYear: {
            type: 'integer',
            minumum: 2000,
            maximum: 2099,
          },
          total: {
            type: 'number',
          },
          payment: {
            type: 'object',
            properties: {
              paymentCondition: {
                type: 'string',
              },
              bank: {
                type: 'string',
              },
            },
          },
          iban: {
            type: 'string',
          },
          recipient: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              vatNumber: {
                type: 'string',
              },
              fiscalCode: {
                type: 'string',
              },
              address: {
                type: 'object',
                properties: {
                  route: {
                    type: 'string',
                  },
                  houseNumber: {
                    type: 'string',
                  },
                  postalCode: {
                    type: 'string',
                  },
                  city: {
                    type: 'string',
                  },
                  province: {
                    type: 'string',
                    pattern: '^([A-Z]{2})$',
                  },
                  country: {
                    type: 'string',
                  },
                },
              },
            },
          },
          sender: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              vatNumber: {
                type: 'string',
              },
              fiscalCode: {
                type: 'string',
              },
              birthDate: {
                type: 'string',
                description: 'ISO6801 date',
              },
              birthCity: {
                type: 'string',
              },
              address: {
                type: 'object',
                properties: {
                  route: {
                    type: 'string',
                  },
                  houseNumber: {
                    type: 'string',
                  },
                  postalCode: {
                    type: 'string',
                  },
                  city: {
                    type: 'string',
                  },
                  province: {
                    pattern: '^([A-Z]{2})$',
                  },
                  country: {
                    type: 'string',
                  },
                },
              },
            },
          },
          content: {
            type: 'object',
            properties: {
              grossEntries: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    value: {
                      type: 'number',
                    },
                    origin: {
                      type: 'string',
                    },
                    productivePeriodMonth: {
                      type: 'integer',
                      minumum: 0,
                      maximum: 12,
                    },
                    productivePeriodYear: {
                      type: 'integer',
                      minumum: 2000,
                      maximum: 2099,
                    },
                    installments: {
                      type: 'array',
                    },
                  },
                },
              },
              netEntries: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    value: {
                      type: 'number',
                    },
                    origin: {
                      type: 'string',
                    },
                    productivePeriodMonth: {
                      type: 'integer',
                      minumum: 0,
                      maximum: 12,
                    },
                    productivePeriodYear: {
                      type: 'integer',
                      minumum: 2000,
                      maximum: 2099,
                    },
                  },
                },
              },
              taxEntries: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    value: {
                      type: 'number',
                    },
                  },
                },
              },
              grossTotal: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  value: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    };
  }
}

module.exports = PDFInput;
