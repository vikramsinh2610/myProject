# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Continuos Integration

### Added
- [#497] Sheltia Commissioning 2019
- [#503] Fix Commissioning 2019
- [#505] Other Fixes Commissioning 2019
- [#505] Other Fixes Commissioning 2019

### Changed
- change name of invoice to name - surname - matricola

### Fixed

# Legacy pre-ci releases
releases are banned from now on, only continuos integration of master to production deploy

- [#494] Dockerize app

## 1.4.0 - Wed Feb 27 2019

### Added

- [#439] Signaler commissioning

### Changed

- [#491] Industrial countability: change productive period rules to be aligned with commissioning

### Fixed

- Distribute payout in company advance

## 1.3.5 - 1.3.12

Many small fixes directly done in production due to quick deadline.

## 1.3.4 - Thu Feb 14 2019

### Fixed

- [#477] Get management fees from all funds
- [#478] Commissioning: change legacy IV sync behavior

## 1.3.1 - Thu Feb 7 2019

### Changed

- [#473] Optimize commissioning

## 1.3.0 - Tue Feb 5 2019

### Added

- [#450] Add "occasional performance" invoice template
- [#472] Letter: new conditioned bonuses detail
- [#479] Commissioning: make processing asynchronous
- [#489] Invoicing: make processing asynchronous

### Fixed

- Some minor commissioning bug fixed

## 1.2.1 - Thu Jan 31 2019

### Fixed

- Some minor commissioning bug fixed

## 1.2.0 - Thu Jan 24 2019

### Added

- Add list and update promoter targets by group (by year) API
- [#337] Sheltia Commissioning Configuration Service and Sheltia Promoter Target Service with APIs
- [#336] Sheltia Commissioning
- [#376] Extend real mongo to all test
- [#303] Add accounting notes delete and rename API
- [#380] Sheltia: sync legacy practice, IV and payin before commissioning
- [#384] Add Management Fee
- [#385] Add employee invoice template
- [#386] Add Sheltia invoice template
- [#432] Add documents filter by promoter name
- [#401] Move legacy sync into a cron
- [#232] Invoicing, download all invoices in a single ZIP
- [#240] Download "Riepilogo dipendenti" ZIP
- [#351] Sheltia IV KPI
- [#257] Add acquittance delete API
- [#419] Create invoices out of invoicing
- [#440] Add Sheltia invoice extra types
- [#404] Add support for "net to pay" accounting notes
- [#419] Create invoices out of invoicing
- [#423] Add total IV into invoice
- [#448] Invoice delete & issue
- [#460] Invoicing layout issue part 2

### Changed

- [#350] Separate Sheltia and TCW KPI
- [#424] Different letter types for Sheltia and TCW
- [#405] Sheltia invoice template, add SH prefix to invoice number
- [#409] Invoice, hide witholding % to totals
- [#420] Save invoice template info into document
- [#451] Map "occasional performance" fiscal regime type
- [#441] Add Sheltia APE KPI and hide consultants
- [#465] Add letter new KPI and allow alternate conditioned bonuses

### Fixed

- Manage divide by zero on forecast API
- [#406] Fixed invoices created without amount
- [#406] Countability doesn't show correct data
- [#408] Get the invoicing payment date as invoice date
- [#432] Fixed letter productive period
- Fixed letter expire calculation

## 1.1.1 - Mon Nov 19 2018

### Fixed

- Remove npm package-lock to fix AWS Beanstalk
- [#371] Resolve countability cause infinite loop

## [1.1.0](https://github.com/EleverSrl/tcw-api-gateway-node/milestone/5) - Fri Nov 16 2018

### Added

- [#338] Tcw Commissioning Configuration Service
- [#342] Add IV to commissioning installments
- [#344] Sheltia Payout Service

### Changed

- [#335] Move TCW commissioning into TCW Commissioning Service
- [#339] Remove commissioning configuration from JobService
- [#359] Improve promoters list API performance
- [#356] Rename -service folder into -srv
- [#354] Change Sheltia QR recovery mail

### Fixed

- [#358] Fix countability summary percentages

### Fixed

- [#357] Return consultant numbers in commissioning

## [1.0.0](https://github.com/EleverSrl/tcw-api-gateway-node/milestone/4) - Mon Nov 12 2018

### Changed

- [#314] Promoters list API: return real last login date
- [#315] Change Sheltia sender email

## Fixed

- [#253] Refactor Adjusted Premium and add seed
- [#329] Fix PromoterJob service that doesn't return correct roleId

### Security

- [#254] Add commissioning rollback on errors

## [1.0.0-rc.1](https://github.com/EleverSrl/tcw-api-gateway-node/releases) - Mon Nov 5 2018

### Added

- [#293] Forecast countability API
- [#294] Installments on overdue countability API

### Changed

- [#313] Filter countability by contractId with regex

### Fixed

- [#309] Fixed industrial countability filters
- [#301] Exclude administrator from commissioning
- [#302] Fix delete document API crash

## [1.0.0-rc.0](https://github.com/EleverSrl/tcw-api-gateway-node/releases/tag/untagged-c44e8407da1a4774e00d) - Tue Oct 30 2018

### Added

- [#251] Add delete document API
- [#272] Industrial countability API
- [#249] Make letters list sortable
- [#277] Add Sheltia edition support for login and emails
- [#276] Add Edition configuration

### Changed

- [#248] Keep filename on document upload
- [#269] Get promoter role by letter
- [#287] Restore Sheltia CI

### Security

- [#246] Resolve MongoDB deprecation warning on remove
- [#245] Protected documents
