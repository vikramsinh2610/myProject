export type AddressType = {
    address?: string
    city?: string
    cap?: string
    province?: string
}

// NASPI
export type NaspiFormProps = {
    phone?: string
    fiscal_code?: string
    address?: AddressType
    home?: AddressType
    same_address?: boolean
    marital_status: number
    marital_date?: Date
    last_work_date?: Date
    iban?: string
    p_iva?: string
    p_iva_check?: boolean
    income?: number
    info?: string
    "identity-f"?: any
    "identity-r"?: any
    "fiscality-f"?: any
    "fiscality-r"?: any
    "last-payment"?: any
    "last-contract"?: any
    "more"?: any
}

export type NaspiReceiptProps = {
    "agreement-file"?: any
    "receipt-file"?: any
}

export type NaspiErrorProps = {
    marital_status: number
    marital_date?: Date
    last_work_date?: string
    p_iva?: string
    income?: number
    info?: string
}

// DS AGRICOLA
export type DsAgricolaFormProps = {
    phone?: string
    address?: AddressType
    home?: AddressType
    marital_status: number
    marital_date?: Date
    last_work_date?: Date
    anf?: boolean
    more_works?: boolean
    more_work_name?: string
    payment_method: number
    iban?: string
    info?: string
}

export type DsAgricolaErrorProps = {
    marital_status: number
    marital_date?: Date
    last_work_date?: Date
    p_iva?: string
    income?: number
    info?: string
}

export type RegisterUserForm = {
    name?: string
    surname?: string
    email?: string
    password?: string
    password2?: string

}

// NASPI Com
export type NaspiComFormProps = {
    variation?: number
    event?: number
    contract?: string
    more?: string
}

/**
 * Naspi Anticipata
 */
export type NaspiAnticipataFormProps = {
    phone?: string
    email?: string
    address?: AddressType
    home?: AddressType
    same_address?: boolean
    marital_status: number
    marital_date?: Date
    protocol?: string
    protocol_date?: Date
    activity_type?: number
    activity_name?: string
    activity_date?: Date
    iban?: string
    more?: string
    "identity-f"?: any
    "identity-r"?: any
    "fiscality-f"?: any
    "fiscality-r"?: any
    "last-payment"?: any
    "last-contract"?: any
    "more"?: any
}