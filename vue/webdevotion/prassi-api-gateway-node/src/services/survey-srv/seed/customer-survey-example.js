const { v4: uuid } = require('uuid');
const { typesSurvey } = require('../survey-types');
const { typesValue } = require('../value-types');

module.exports = {
  seed: [
    {
      _id: uuid(),
      creationDate: new Date(),
      type: typesSurvey.INQUIRY,
      idSurvey: 'ffd38c43-8e24-b149-9605-55fc0208083e',
      customerId: 'ffd38c43-8e24-b149-9605-55fc0208083e',
      practiceId: 'SUBG8001002001',
      dossierId: '90014003000',
      results: [
          {
            _id: typesValue.DEFAULT,
            points: 35,
            reasons: ['non autosufficiente', 'troppo giovane per il prodotto richiesto'],
          },
          {
            _id: typesValue.INVESTMENT,
            points: 5,
            reason: undefined,
          },
      ],
      questions: [
        {
          _id: 'civil-status',
          responses: [
            {
              _id: 'married',
              text: 'Coniugato',
              selected: true,
              values: [
                {
                  _id: typesValue.DEFAULT,
                  points: 0,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
                {
                  _id: typesValue.INVESTMENT,
                  points: 0,
                  reason: undefined,
                  conditionedQuestionId: 'child-number',
                },
              ],
            },
            {
              _id: 'unmarried',
              text: 'Celibe',
              selected: false,
              values: [
                {
                  _id: typesValue.DEFAULT,
                  points: 0,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
                {
                  _id: typesValue.INVESTMENT,
                  points: 30,
                  reason: 'profilo poco affidabile nel lungo termine',
                  conditionedQuestionId: undefined,
                },
              ],
            },
            {
              _id: 'divorced',
              text: 'Divorziato',
              selected: false,
              values: [
                {
                  _id: typesValue.DEFAULT,
                  points: 0,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
                {
                  _id: typesValue.INVESTMENT,
                  points: 0,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
              ],
            },
          ],
        },
        {
          _id: 'income-level',
          responses: [
            {
              _id: 'income-0-25000',
              text: 'Da 0 a 20.000',
              selected: true,
              values: [
                {
                  _id: typesValue.DEFAULT,
                  points: 30,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
                {
                  _id: typesValue.INVESTMENT,
                  points: 30,
                  reason: 'troppo poco',
                  conditionedQuestionId: undefined,
                },
              ],
            },
            {
              _id: 'income-25000-50000',
              text: 'da 25.000 a 50.000',
              selected: false,
              values: [
                {
                  _id: typesValue.DEFAULT,
                  points: 0,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
                {
                  _id: typesValue.INVESTMENT,
                  points: 30,
                  reason: 'profilo poco affidabile nel lungo termine',
                  conditionedQuestionId: undefined,
                },
              ],
            },
            {
              _id: 'income-75000-150000',
              text: 'da 75.000 a 150.000',
              selected: false,
              values: [
                {
                  _id: typesValue.DEFAULT,
                  points: 0,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
                {
                  _id: typesValue.INVESTMENT,
                  points: 30,
                  reason: undefined,
                  conditionedQuestionId: undefined,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
