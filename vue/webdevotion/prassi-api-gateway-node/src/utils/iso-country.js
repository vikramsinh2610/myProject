function translateCountryISO(origin) {
    const origins = {
        'afghanistan' : 'AF',
        'albania' : 'AL',
        'algeria' : 'DZ',
        'andorra' : 'AD',
        'angola' : 'AO',
        'anguilla' : 'AI',
        'antartide' : 'AQ',
        'antigua e barbuda' : 'AG',
        'arabia saudita' : 'SA',
        'argentina' : 'AR',
        'armenia' : 'AM',
        'aruba' : 'AW',
        'australia' : 'AU',
        'austria' : 'AT',
        'azerbaigian' : 'AZ',
        'bahamas' : 'BS',
        'bahrein' : 'BH',
        'bangladesh' : 'BD',
        'barbados' : 'BB',
        'belgio' : 'BE',
        'belize' : 'BZ',
        'benin' : 'BJ',
        'bermuda' : 'BM',
        'bhutan' : 'BT',
        'bielorussia' : 'BY',
        'birmania' : 'MM',
        'bolivia' : 'BO',
        'bosnia ed erzegovina' : 'BA',
        'botswana' : 'BW',
        'brasile' : 'BR',
        'brunei' : 'BN',
        'bulgaria' : 'BG',
        'burkina faso' : 'BF',
        'burundi' : 'BI',
        'cambogia' : 'KH',
        'camerun' : 'CM',
        'canada' : 'CA',
        'capo verde' : 'CV',
        'ciad' : 'TD',
        'cile' : 'CL',
        'cina' : 'CN',
        'cipro' : 'CY',
        'città del vaticano' : 'VA',
        'colombia' : 'CO',
        'comore' : 'KM',
        'corea del nord' : 'KP',
        'corea del sud' : 'KR',
        'costa d\'avorio' : 'CI',
        'costa rica' : 'CR',
        'croazia' : 'HR',
        'cuba' : 'CU',
        'curaçao' : 'CW',
        'danimarca' : 'DK',
        'dominica' : 'DM',
        'ecuador' : 'EC',
        'egitto' : 'EG',
        'el salvador' : 'SV',
        'emirati arabi uniti' : 'AE',
        'eritrea' : 'ER',
        'estonia' : 'EE',
        'etiopia' : 'ET',
        'figi' : 'FJ',
        'filippine' : 'PH',
        'finlandia' : 'FI',
        'francia' : 'FR',
        'gabon' : 'GA',
        'gambia' : 'GM',
        'georgia' : 'GE',
        'georgia del sud e isole sandwich australi' : 'GS',
        'germania' : 'DE',
        'ghana' : 'GH',
        'giamaica' : 'JM',
        'giappone' : 'JP',
        'gibilterra' : 'GI',
        'gibuti' : 'DJ',
        'giordania' : 'JO',
        'grecia' : 'GR',
        'grenada' : 'GD',
        'groenlandia' : 'GL',
        'guadalupa' : 'GP',
        'guam' : 'GU',
        'guatemala' : 'GT',
        'guernsey' : 'GG',
        'guinea' : 'GN',
        'guinea-bissau' : 'GW',
        'guinea equatoriale' : 'GQ',
        'guyana' : 'GY',
        'guyana francese' : 'GF',
        'haiti' : 'HT',
        'honduras' : 'HN',
        'hong kong' : 'HK',
        'india' : 'IN',
        'indonesia' : 'ID',
        'iran' : 'IR',
        'iraq' : 'IQ',
        'irlanda' : 'IE',
        'islanda' : 'IS',
        'isola bouvet' : 'BV',
        'isola di man' : 'IM',
        'isola di natale' : 'CX',
        'isola norfolk' : 'NF',
        'isole åland' : 'AX',
        'isole bes' : 'BQ',
        'isole cayman' : 'KY',
        'isole cocos (keeling)' : 'CC',
        'isole cook' : 'CK',
        'fær øer' : 'FO',
        'isole falkland' : 'FK',
        'isole heard e mcdonald' : 'HM',
        'isole marianne settentrionali' : 'MP',
        'isole marshall' : 'MH',
        'isole minori esterne degli stati uniti' : 'UM',
        'isole pitcairn' : 'PN',
        'isole salomone' : 'SB',
        'isole vergini britanniche' : 'VG',
        'isole vergini americane' : 'VI',
        'israele' : 'IL',
        'italia' : 'IT',
        'jersey' : 'JE',
        'kazakistan' : 'KZ',
        'kenya' : 'KE',
        'kirghizistan' : 'KG',
        'kiribati' : 'KI',
        'kuwait' : 'KW',
        'laos' : 'LA',
        'lesotho' : 'LS',
        'lettonia' : 'LV',
        'libano' : 'LB',
        'liberia' : 'LR',
        'libia' : 'LY',
        'liechtenstein' : 'LI',
        'lituania' : 'LT',
        'lussemburgo' : 'LU',
        'macao' : 'MO',
        'macedonia del nord' : 'MK',
        'madagascar' : 'MG',
        'malawi' : 'MW',
        'malaysia' : 'MY',
        'maldive' : 'MV',
        'mali' : 'ML',
        'malta' : 'MT',
        'marocco' : 'MA',
        'martinica' : 'MQ',
        'mauritania' : 'MR',
        'mauritius' : 'MU',
        'mayotte' : 'YT',
        'messico' : 'MX',
        'micronesia' : 'FM',
        'moldavia' : 'MD',
        'mongolia' : 'MN',
        'montenegro' : 'ME',
        'montserrat' : 'MS',
        'mozambico' : 'MZ',
        'namibia' : 'NA',
        'nauru' : 'NR',
        'nepal' : 'NP',
        'nicaragua' : 'NI',
        'niger' : 'NE',
        'nigeria' : 'NG',
        'niue' : 'NU',
        'norvegia' : 'NO',
        'nuova caledonia' : 'NC',
        'nuova zelanda' : 'NZ',
        'oman' : 'OM',
        'paesi bassi' : 'NL',
        'pakistan' : 'PK',
        'palau' : 'PW',
        'palestina' : 'PS',
        'panama' : 'PA',
        'papua nuova guinea' : 'PG',
        'paraguay' : 'PY',
        'perù' : 'PE',
        'polinesia francese' : 'PF',
        'polonia' : 'PL',
        'porto rico' : 'PR',
        'portogallo' : 'PT',
        'monaco' : 'MC',
        'qatar' : 'QA',
        'regno unito' : 'GB',
        'rd del congo' : 'CD',
        'rep. ceca' : 'CZ',
        'rep. centrafricana' : 'CF',
        'rep. del congo' : 'CG',
        'rep. dominicana' : 'DO',
        'riunione' : 'RE',
        'romania' : 'RO',
        'ruanda' : 'RW',
        'russia' : 'RU',
        'sahara occidentale' : 'EH',
        'saint kitts e nevis' : 'KN',
        'saint lucia' : 'LC',
        'saint vincent e grenadine' : 'VC',
        'saint-barthélemy' : 'BL',
        'saint-martin' : 'MF',
        'saint-pierre e miquelon' : 'PM',
        'samoa' : 'WS',
        'samoa americane' : 'AS',
        'san marino' : 'SM',
        'são tomé e príncipe' : 'ST',
        'senegal' : 'SN',
        'serbia' : 'RS',
        'seychelles' : 'SC',
        'sierra leone' : 'SL',
        'singapore' : 'SG',
        'sint maarten' : 'SX',
        'siria' : 'SY',
        'slovacchia' : 'SK',
        'slovenia' : 'SI',
        'somalia' : 'SO',
        'spagna' : 'ES',
        'sri lanka' : 'LK',
        'stati uniti' : 'US',
        'sudafrica' : 'ZA',
        'sudan' : 'SD',
        'sudan del sud' : 'SS',
        'suriname' : 'SR',
        'svalbard e jan mayen' : 'SJ',
        'svezia' : 'SE',
        'svizzera' : 'CH',
        'swaziland' : 'SZ',
        'taiwan' : 'TW',
        'tagikistan' : 'TJ',
        'tanzania' : 'TZ',
        'terre australi e antartiche francesi' : 'TF',
        'thailandia' : 'TH',
        'timor est' : 'TL',
        'togo' : 'TG',
        'tokelau' : 'TK',
        'tonga' : 'TO',
        'trinidad e tobago' : 'TT',
        'tunisia' : 'TN',
        'turchia' : 'TR',
        'turkmenistan' : 'TM',
        'turks e caicos' : 'TC',
        'tuvalu' : 'TV',
        'ucraina' : 'UA',
        'uganda' : 'UG',
        'ungheria' : 'HU',
        'uruguay' : 'UY',
        'uzbekistan' : 'UZ',
        'vanuatu' : 'VU',
        'venezuela' : 'VE',
        'vietnam' : 'VN',
        'wallis e futuna' : 'WF',
        'yemen' : 'YE',
        'zambia' : 'ZM',
    };
    return origins[`${origin}`] || origin;
}

module.exports = { translateCountryISO };
