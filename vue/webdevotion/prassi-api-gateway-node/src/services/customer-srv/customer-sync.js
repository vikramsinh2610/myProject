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

class CustomerSync {
  constructor({
                _id,
                name,
                surname,
                fiscalCode,
                vat,
                address,
                fixedPhone,
                mobilePhone,
                birthDate,
                birthCity,
                physicalPerson,
                sex,
                email,
                birthRegion,
                birthState,
                legalAddress,
                created,
                modified,
                statusDisplayValue,
                statusKey = null,
                typeDisplayValue,
                typeKey = null,
                priorityDisplayValue,
                linkedIn = null,
                facebook = null,
                twitter = null,
                nationality = null,
                foundationDate = null,
                companyType = null,
                references = null,
                effectives = null,
                legal = null,
                taxLawyer = null,
                companyReference = null,
                referral = null,
                document = null,
                acquiring= null,
              }) {
    this._id = _id;
    this.name = name;
    this.surname = surname;
    this.displayName = `${name} ${surname}`;
    this.fiscalCode = fiscalCode;
    this.vat = vat;
    this.address = new Address(address);
    this.fixedPhone = fixedPhone;
    this.mobilePhone = mobilePhone;
    this.birthDate = birthDate;
    this.birthCity = birthCity;
    this.physicalPerson = physicalPerson;
    this.sex = sex;
    this.email = email;
    this.birthRegion = birthRegion;
    this.birthState = birthState;
    this.legalAddress = new Address(legalAddress);
    this.created = created;
    this.modified = modified;
    this.statusDisplayValue = statusDisplayValue;
    this.statusKey = statusKey;
    this.typeDisplayValue = typeDisplayValue;
    this.typeKey = typeKey;
    this.priorityDisplayValue = priorityDisplayValue;
    this.linkedIn = linkedIn;
    this.facebook = facebook;
    this.twitter = twitter;
    this.nationality = nationality;
    this.foundationDate = foundationDate;
    this.companyType = companyType;
    this.references = references;
    this.effectives = effectives;
    this.legal = legal;
    this.taxLawyer = taxLawyer;
    this.companyReference = companyReference;
    this.referral = referral;
    this.document = document;
    this.acquiring = acquiring;
  }
}

module.exports = CustomerSync;
