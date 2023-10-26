/* eslint security/detect-non-literal-fs-filename: 0 */

const { Mandrill } = require('mandrill-api');
const mustache = require('mustache');
const promisify = require('promisify-node');
const path = require('path');

function getTemplate(templateId, edition, params) {
  const fs = promisify('fs');
  const filename = path.join(path.dirname(__filename), 'templates', edition, `${templateId}.mustache`);
  return fs
    .readFile(filename)
    .then((buffer) => buffer.toString())
    .then((template) => mustache.render(template, params));
}

class MailService {
  /**
   * @param {Mandrill} mandrill
   * @param {string} actionUrl
   * @param {string} edition
   * @param {string} env
   */
  constructor(mandrill, actionUrl, edition, env) {
    this.mandrill = mandrill;
    this.actionUrl = actionUrl;
    this.edition = edition;
    this.env = env;
    this.mailSender =
      edition === 'sheltia'
        ? {
            from_email: 'admin@sheltia.com',
            from_name: 'Sheltia App',
          }
        : {
            from_email: 'admin@prassi-app.com',
            from_name: 'Prassi App',
          };
  }

  sendQrRecoveryMail({ name, surname, username, encrypted }) {
    const url = `${this.actionUrl}/v1/users/reset-qr-code?user=${encrypted}`;
    return getTemplate('qr-code-recovery', this.edition, { name, surname, username, url }).then((html) => {
      const message = {
        html,
        subject: 'Reset QR Code',
        ...this.mailSender,
        to: [
          {
            email: this.edition === 'sheltia' ? 'operation@sheltia.com' : this.mailSender.from_email,
            name: `${name} ${surname}`,
            type: 'to',
          },
        ],
        tags: ['qr-reset'],
      };

      return new Promise((resolve, reject) =>
        this.mandrill.messages.send(
          { message },
          (result) => resolve(result),
          (e) => reject(e),
        ),
      );
    });
  }

  sendPasswordRecoveryMail({ name, surname, username, password }) {
    return getTemplate('password-recovery', this.edition, { name, surname, password }).then((html) => {
      const message = {
        html,
        subject: 'Recupero Password',
        ...this.mailSender,
        to: [
          {
            email: this.env === 'prod' ? username : this.mailSender.from_email,
            name: `${name} ${surname}`,
            type: 'to',
          },
        ],
        tags: ['password-reset'],
      };

      // eslint-disable-next-line sonarjs/no-identical-functions
      return new Promise((resolve, reject) =>
        this.mandrill.messages.send(
          { message },
          (result) => resolve(result),
          (e) => reject(e),
        ),
      );
    });
  }

  /**
   * @param {Array} customersNotFound
   */
  sendCustomerInsurerMail(customersNotFound) {
    return getTemplate('customers-not-found-list', this.edition, { customersNotFound }).then((html) => {
      const message = {
        html,
        subject: this.env === 'prod' ? 'Clienti senza Consulente - PROD' : 'Clienti senza Consulente - STAGE',
        ...this.mailSender,
        to: [
          {
            email: this.env === 'prod' ? this.mailSender.from_email : 'giona.granata@webdevotion.net',
            name: `Admin`,
            type: 'to',
          },
          {
            email: 'stefano.vaghi@elever.it',
            type: 'to',
          },
          {
            email: 'giona.granata@gmail.com',
            type: 'to',
          },
        ],
        tags: ['password-reset'],
      };

      // eslint-disable-next-line sonarjs/no-identical-functions
      return new Promise((resolve, reject) =>
        this.mandrill.messages.send(
          { message },
          (result) => resolve(result),
          (e) => reject(e),
        ),
      );
    });
  }

  sendPrecontractualSignedDocs(params) {
    return getTemplate('signed-docs', this.edition, { contact: params.contact }).then((html) => {
      const message = {
        html,
        subject: this.env === 'prod' ? 'Documenti Firmati Sheltia - PROD' : 'Documenti Firmati Sheltia - STAGE',
        ...this.mailSender,
        to: [
          {
            email: this.env === 'prod' ? params.emailClientTo : 'stefano.vaghi@elever.it',
            type: 'to',
          },
          {
            email: this.env === 'prod' ? params.emailConsulenteTo : 'stefano.vaghi@elever.it',
            type: 'to',
          },
        ],
        tags: ['precontractual-docs'],
        attachments: [
          {
            type: 'application/pdf',
            name: params.otp.displayName,
            content: params.otp.data.toString('base64'),
          },
          {
            type: 'application/pdf',
            name: params.privacy.displayName,
            content: params.privacy.data.toString('base64'),
          },
          {
            type: 'application/pdf',
            name: params.mandate.displayName,
            content: params.mandate.data.toString('base64'),
          },
        ],
      };

      // eslint-disable-next-line sonarjs/no-identical-functions
      return new Promise((resolve, reject) =>
        this.mandrill.messages.send(
          { message },
          (result) => resolve(result),
          (e) => reject(e),
        ),
      );
    });
  }

  sendSignedDocs(params) {
    return getTemplate('signed-docs', this.edition, {}).then((html) => {
      const message = {
        html,
        subject: this.env === 'prod' ? 'Documenti Firmati Sheltia - PROD' : 'Documenti Firmati Sheltia - STAGE',
        ...this.mailSender,
        to: [
          {
            email: this.env === 'prod' ? params.emailClientTo : 'stefano.vaghi@elever.it',
            type: 'to',
          },
          {
            email: this.env === 'prod' ? params.emailConsulenteTo : 'stefano.vaghi@elever.it',
            type: 'to',
          },
          {
            email:
              this.env === 'prod' && params.emailThirdPayerTo ? params.emailThirdPayerTo : 'stefano.vaghi@elever.it',
            type: 'to',
          },
        ],
        tags: ['docs'],
        attachments: params.attachments,
      };

      // eslint-disable-next-line sonarjs/no-identical-functions
      return new Promise((resolve, reject) =>
        this.mandrill.messages.send(
          { message },
          (result) => resolve(result),
          (e) => reject(e),
        ),
      );
    });
  }

  /**
   * @param {Array} dossiersNotFound
   */
  sendDossierInsurerMail(dossiersNotFound) {
    return getTemplate('dossiers-not-found-list', this.edition, { dossiersNotFound }).then((html) => {
      const message = {
        html,
        subject: this.env === 'prod' ? 'Pratiche senza Consulente - PROD' : 'Pratiche senza Consulente - STAGE',
        ...this.mailSender,
        to: [
          {
            email: this.env === 'prod' ? this.mailSender.from_email : 'giona.granata@webdevotion.net',
            name: `Admin`,
            type: 'to',
          },
          {
            email: 'stefano.vaghi@elever.it',
            type: 'to',
          },
          {
            email: 'giona.granata@gmail.com',
            type: 'to',
          },
        ],
        tags: ['password-reset'],
      };

      // eslint-disable-next-line sonarjs/no-identical-functions
      return new Promise((resolve, reject) =>
        this.mandrill.messages.send(
          { message },
          (result) => resolve(result),
          (e) => reject(e),
        ),
      );
    });
  }
}

module.exports = MailService;
