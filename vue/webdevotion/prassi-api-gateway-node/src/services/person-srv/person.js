// eslint-disable-next-line max-classes-per-file
const { v4: uuid4 } = require('uuid');

class Address {
  constructor({ route, streetNumber, city, province, country, postalCode, latitude = null, longitude = null }) {
    this.route = route;
    this.streetNumber = streetNumber;
    this.city = city;
    this.province = province;
    this.country = country;
    this.postalCode = postalCode;
    this.latitude = latitude;
    this.longitude = longitude;
    const area = [postalCode, city, province ? `(${province})` : ''].filter((str) => str !== '').join(' ') || '';
    this.displayAddress = [route, streetNumber, area].filter((str) => str !== '').join(', ') || '';
  }
}

class Person {
  constructor({
    id,
    uuid = uuid4(),
    name,
    surname,
    companyName,
    fiscalCode,
    vat,
    address,
    fixedPhone,
    mobilePhone,
    birthDate,
    birthCity,
    isCompany,
    sex,
    email,
    birthRegion,
    birthState,
    legalAddress,
    creationDate,
    modified,
    statusDisplayValue,
    status = null,
    typeDisplayValue,
    customerType = null,
    priorityDisplayValue,
    linkedIn = null,
    facebook = null,
    twitter = null,
    nationality = null,
    foundationDate = null,
    companyType = null,
    legalPerson = null,
    fiscalCodeAttachmentObj: fiscalCodeAttachmentObject = null
  }) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.surname = surname;
    this.companyName = companyName;
    this.displayName = `${name} ${surname}`;
    this.fiscalCode = fiscalCode;
    this.vat = vat;
    this.address = address ? new Address(address) : {};
    this.fixedPhone = fixedPhone;
    this.mobilePhone = mobilePhone;
    this.birthDate = birthDate;
    this.birthCity = birthCity;
    this.isCompany = isCompany;
    this.sex = sex;
    this.email = email;
    this.birthRegion = birthRegion;
    this.birthState = birthState;
    this.legalAddress = legalAddress ? new Address(legalAddress) : {};
    this.displayAddress = this.address.displayAddress;
    this.displayLegalAddress = this.legalAddress.displayAddress;
    this.creationDate = creationDate;
    this.modified = modified;
    this.statusDisplayValue = statusDisplayValue;
    this.status = status;
    this.typeDisplayValue = typeDisplayValue;
    this.customerType = customerType;
    this.priorityDisplayValue = priorityDisplayValue;
    this.linkedIn = linkedIn;
    this.facebook = facebook;
    this.twitter = twitter;
    this.nationality = nationality;
    this.foundationDate = foundationDate;
    this.companyType = companyType;
    this.legalPerson = legalPerson || null;
    this.fiscalCodeAttachmentObj = fiscalCodeAttachmentObject || null;
  }
}

module.exports = Person;
