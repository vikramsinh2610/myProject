create table sheltia_stage.precontractual
(
    id                 serial,
    "personId"         integer,
    status             integer,
    "lastModifiedDate" date,
    "createdDate"      date,
    stepper            integer
);

alter table sheltia_stage.precontractual
    owner to root;

