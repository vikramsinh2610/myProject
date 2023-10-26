const Question = require('../question');
const { typesSurvey } = require('../survey-types');
const { typesValue } = require('../value-types');
const { typesSection } = require('../section-types');

module.exports = {
  questionSeed: [
    {
      _id: 'civil-status',
      creationDate: new Date(),
      multiple: false,
      multipleObligatory: false,
      multipleQuestion: false,
      section: typesSection.USER_DATA,
      texts: [
        {
          _id: typesSurvey.DEFAULT,
          text: 'Stato civile',
        },
        {
          _id: typesSurvey.INQUIRY,
          text: 'Quale è il suo stato civile?',
        },
        {
          _id: `${typesSurvey.CATEGORY}-0000-0000-0000-0000`,
          text: 'Quale è il suo stato civile?',
        },
        {
          _id: `${typesSurvey.PRODUCT}-0000-0000-0000-0000`,
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
      creationDate: new Date(),
      multiple: false,
      multipleObligatory: false,
      multipleQuestion: false,
      section: typesSection.INVESTMENT_TYPE,
      texts: [
        {
          _id: typesSurvey.DEFAULT,
          text: 'Reddito',
        },
        {
          _id: typesSurvey.INQUIRY,
          text: 'Quale è il suo reddito?',
        },
        {
          _id: `${typesSurvey.CATEGORY}-0000-0000-0000-0000`,
          text: 'Quale è il suo reddito?',
        },
        {
          _id: `${typesSurvey.PRODUCT}-0000-0000-0000-0000`,
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
    {
      _id: 'profile-investing',
      creationDate: new Date(),
      multiple: true,
      multipleObligatory: true,
      multipleQuestion: true,
      section: typesSection.INVESTMENT_TYPE,
      texts: [
        {
          _id: typesSurvey.DEFAULT,
          text: 'Profili investimento preferiti',
        },
        {
          _id: typesSurvey.INQUIRY,
          text: 'Quali sono i suoi profili di investimento?',
        },
        {
          _id: `${typesSurvey.CATEGORY}-0000-0000-0000-0000`,
          text: 'In cosa investe preferibilmente?',
        },
        {
          _id: `${typesSurvey.PRODUCT}-0000-0000-0000-0000`,
          text: 'Quali sono i suoi profili di investimento?',
        },
      ],
      responses: [
        {
          _id: 'no-selection',
          text: 'Nessuno',
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
          _id: 'stocks',
          text: 'Azioni',
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
          _id: 'housing',
          text: 'Immobili',
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
  ].map((s) => new Question(s)),
};
