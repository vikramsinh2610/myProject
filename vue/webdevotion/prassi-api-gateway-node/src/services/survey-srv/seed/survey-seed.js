const { v4: uuid } = require('uuid');
const Survey = require('../survey');
const { typesSurvey } = require('../survey-types');
const { typesValue } = require('../value-types');
const { typesSection } = require('../section-types');

module.exports = {
  surveySeed: [
    {
      _id: uuid(),
      type: typesSurvey.INQUIRY,
      creationDate: new Date(),
      questions: [
        {
          _id: 'civil-status',
          multiple: false,
          section: typesSection.USER_DATA,
          texts: [
            {
              _id: typesSurvey.INQUIRY,
              text: 'Quale è il suo stato civile?',
            },
          ],
          responses: [
            {
              _id: 'married',
              text: 'Coniugato',
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
          multiple: false,
          section: typesSection.INVESTMENT_TYPE,
          texts: [
            {
              text: 'Quale è il suo reddito?',
            },
          ],
          responses: [
            {
              _id: 'income-0-25000',
              text: 'Da 0 a 20.000',
              selected: false,
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
                  reason: undefined,
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
  ].map((s) => new Survey(s)),
};
