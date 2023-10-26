export type Naspi = {
    address: string
    home: string
    marital_status: number
    marital_date: string
    last_work_date: string
    iban: string
    p_iva: string
    income: number
    info: string
    status_id: number
    status: string
    indt: string
    type: number
    id: number
}

export type Receipt = {
    id: number
    address: string
    cap: string
    city: string
    code_file_front: string
    code_file_rear: string
    document_file_front: string
    document_file_rear: string
    home_address: string
    home_city: string
    iban: string
    income: number
    info: string
    last_work_date: date
    marital_date: date
    marital_status: number
    more_file: string
    pay_file: string
    privacy_file: string
    province: string
    receipt_file: string
    status: string
    vat: string
    work_file: string
}



export type DsAgricola = {
    address: string
    home: string
    marital_status: number
    marital_date: string
    last_work_date: string
    iban: string
    p_iva: string
    income: number
    info: string
    status_id: number
    status: string
    indt: string
}

export type User = {
    id: number
    name: string
    email: string
    mobile: string
    surname: string
    username: string
    fiscal_code: string
}