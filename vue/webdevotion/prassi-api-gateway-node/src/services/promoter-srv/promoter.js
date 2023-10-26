// eslint-disable-next-line max-classes-per-file
class Address {
  constructor({ route, streetNumber, city, province, country, postalCode }) {
    this.route = route;
    this.streetNumber = streetNumber;
    this.city = city;
    this.province = province;
    this.country = country;
    this.postalCode = postalCode;
    const area = [postalCode, city, province ? `(${province})` : ''].filter((str) => str !== '').join(' ') || '';
    this.displayAddress = [route, streetNumber, area].filter((str) => str !== '').join(', ') || '';
  }
}

class Tax {
  constructor({ iban, vat, fiscalRegimeType }) {
    this.iban = iban;
    this.vat = vat;
    this.fiscalRegimeType = fiscalRegimeType;
  }

  // https://it.wikipedia.org/wiki/International_Bank_Account_Number#Italia
  getPaese() {
    return this.iban ? this.iban.slice(0, 2) : '';
  }

  getConto() {
    return this.iban ? this.iban.slice(15, 27) : '';
  }
}

class Promoter {
  constructor({
    _id,
    name,
    surname,
    username,
    role,
    tipoDocumento,
    numeroDocumento,
    documentoRilasciatoDa,
    documentoDataRilascio,
    documentoDataScadenza,
    serialNumber,
    ivass,
    fiscalCode,
    address,
    tax,
    gerarchiaResponsabili,
    approved,
    enabled,
    networkEnterDate,
    networkExitDate,
    fixedPhone,
    mobilePhone,
    birthDate,
    birthCity,
    physicalPerson,
    sex,
    corporateEmail,
    personalEmail,
    birthRegion,
    birthState,
    trustDate,
    endTrustDate,
    taxCode,
    subjectCode,
    eInvoice,
    companyData,
    degree = '',
  }) {
    this._id = _id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.role = role;
    this.tipoDocumento = tipoDocumento;
    this.numeroDocumento = numeroDocumento;
    this.documentoRilasciatoDa = documentoRilasciatoDa;
    this.documentoDataRilascio = documentoDataRilascio;
    this.documentoDataScadenza = documentoDataScadenza;
    this.displayName = `${name} ${surname}`;
    this.serialNumber = serialNumber;
    this.ivass = ivass;
    this.fiscalCode = fiscalCode;
    this.address = new Address(address);
    this.tax = new Tax(tax);
    this.gerarchiaResponsabili = gerarchiaResponsabili;
    this.approved = approved;
    this.enabled = enabled;
    this.networkEnterDate = networkEnterDate;
    this.networkExitDate = networkExitDate;
    this.fixedPhone = fixedPhone;
    this.mobilePhone = mobilePhone;
    this.birthDate = birthDate;
    this.birthCity = birthCity;
    this.physicalPerson = physicalPerson;
    this.sex = sex;
    this.corporateEmail = corporateEmail;
    this.personalEmail = personalEmail;
    this.birthRegion = birthRegion;
    this.birthState = birthState;
    this.trustDate = trustDate;
    this.endTrustDate = endTrustDate;
    this.taxCode = taxCode;
    this.subjectCode = subjectCode;
    this.eInvoice = eInvoice;
    this.companyData = companyData;
    this.degree = degree;
  }
}

module.exports = Promoter;
