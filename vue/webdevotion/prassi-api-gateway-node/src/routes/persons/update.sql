alter table sheltia_dev.person
	add address jsonb;

alter table sheltia_dev.person
	add "legalAddress" jsonb;

alter table sheltia_dev.person
	add "displayAddress" varchar;

alter table sheltia_dev.person
	add "displayLegalAddress" varchar;

alter table sheltia_dev.person
	add email varchar;

alter table sheltia_dev.person
	add "fixedPhone" varchar;

alter table sheltia_dev.person
	add "mobilePhone" varchar;

alter table sheltia_dev.person
	add "birthCity" varchar;

alter table sheltia_dev.person
	add "birthState" varchar;

alter table sheltia_dev.person
	add "linkedIn" varchar;

alter table sheltia_dev.person
	add facebook varchar;

alter table sheltia_dev.person
	add twitter varchar;

alter table sheltia_dev.person
	add sex varchar;

alter table sheltia_dev.person
	add "birthRegion" varchar;

alter table sheltia_dev.person
	add nationality varchar;

alter table sheltia_dev.person
	add foundationDate date;

alter table sheltia_dev.person
	add "companyType" jsonb;

create index person_person_linkedpersonid_index
	on sheltia_dev.person_person ("linkedPersonId");

create index person_person_personid_index
	on sheltia_dev.person_person ("personId");

create unique index person_person_personid_linkedpersonid_uindex
	on sheltia_dev.person_person ("personId", "linkedPersonId");

drop index sheltia_dev.person_person_personid_linkedpersonid_uindex;

create unique index person_person_personid_linkedpersonid_persontypekey_uindex
	on sheltia_dev.person_person ("personId", "linkedPersonId", "personTypeKey");
