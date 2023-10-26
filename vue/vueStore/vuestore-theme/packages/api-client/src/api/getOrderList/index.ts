
import { gql } from "@apollo/client/core";
import { FilterCustomerOrderInput } from '../../types';

type Variables = {
    first: 10,
    page: 1,
    input?: FilterCustomerOrderInput
  };

export async function getOrderList(context, params) {

  const variables: Variables = {
    first: params?.itemsPerPage || 10,
    page: params?.page || 1,
    input: params?.input
  };

  try {
    return await context.client
      .query({
        query: gql`
        query ordersList ($input: FilterCustomerOrderInput, $first: Int = 10, $page: Int = 1) {
            ordersList(input: $input, first: $first, page: $page) {
                paginatorInfo {
                    count
                    currentPage
                    lastPage
                    total
                }
                data {
                    id
                    incrementId
                    status
                    channelName
                    isGuest
                    customerEmail
                    customerFirstName
                    customerLastName
                    customerCompanyName
                    customerVatId
                    shippingMethod
                    shippingTitle
                    shippingDescription
                    couponCode
                    isGift
                    totalItemCount
                    totalQtyOrdered
                    baseCurrencyCode
                    channelCurrencyCode
                    orderCurrencyCode
                    grandTotal
                    baseGrandTotal
                    grandTotalInvoiced
                    baseGrandTotalInvoiced
                    grandTotalRefunded
                    baseGrandTotalRefunded
                    subTotal
                    baseSubTotal
                    subTotalInvoiced
                    baseSubTotalInvoiced
                    subTotalRefunded
                    baseSubTotalRefunded
                    discountPercent
                    discountAmount
                    baseDiscountAmount
                    discountInvoiced
                    baseDiscountInvoiced
                    discountRefunded
                    baseDiscountRefunded
                    taxAmount
                    baseTaxAmount
                    taxAmountInvoiced
                    baseTaxAmountInvoiced
                    taxAmountRefunded
                    baseTaxAmountRefunded
                    shippingAmount
                    baseShippingAmount
                    shippingInvoiced
                    baseShippingInvoiced
                    shippingRefunded
                    baseShippingRefunded
                    customerId
                    customerType
                    channelId
                    channelType
                    cartId
                    appliedCartRuleIds
                    shippingDiscountAmount
                    baseShippingDiscountAmount
                    createdAt
                    updatedAt
                    payment {
                        id
                        method
                        methodTitle
                        additional {
                            title
                            value
                        }
                        orderId
                        createdAt
                        updatedAt
                    }
                    billingAddress {
                        id
                        customerId
                        cartId
                        orderId
                        firstName
                        lastName
                        gender
                        companyName
                        address1
                        address2
                        postcode
                        city
                        state
                        country
                        email
                        phone
                        vatId
                        defaultAddress
                    }
                    shippingAddress {
                        id
                        customerId
                        cartId
                        orderId
                        firstName
                        lastName
                        gender
                        companyName
                        address1
                        address2
                        postcode
                        city
                        state
                        country
                        email
                        phone
                        vatId
                        defaultAddress
                    }
                    items {
                        id
                        sku
                        type
                        name
                        couponCode
                        weight
                        totalWeight
                        qtyOrdered
                        qtyShipped
                        qtyInvoiced
                        qtyCanceled
                        qtyRefunded
                        price
                        basePrice
                        total
                        baseTotal
                        totalInvoiced
                        baseTotalInvoiced
                        amountRefunded
                        baseAmountRefunded
                        discountPercent
                        discountAmount
                        baseDiscountAmount
                        discountInvoiced
                        baseDiscountInvoiced
                        discountRefunded
                        baseDiscountRefunded
                        taxPercent
                        taxAmount
                        baseTaxAmount
                        taxAmountInvoiced
                        baseTaxAmountInvoiced
                        taxAmountRefunded
                        baseTaxAmountRefunded
                        productId
                        productType
                        orderId
                        parentId
                        additional
                        createdAt
                        updatedAt
                        product {
                            id
                            type
                            attributeFamilyId
                            sku
                            parentId
                            createdAt
                            updatedAt
                        }
                        child {
                            id
                            sku
                            type
                            name
                            couponCode
                            weight
                            totalWeight
                            qtyOrdered
                            qtyShipped
                            qtyInvoiced
                            qtyCanceled
                            qtyRefunded
                            price
                            basePrice
                            total
                            baseTotal
                            totalInvoiced
                            baseTotalInvoiced
                        }
                        invoiceItems {
                            id
                            sku
                            type
                            name
                            description
                            qty
                            price
                            basePrice
                            total
                            baseTotal
                            taxAmount
                            baseTaxAmount
                            productId
                            productType
                            orderItemId
                            invoiceId
                            parentId
                        }
                        shipmentItems {
                            id
                            name
                            description
                            sku
                            qty
                            weight
                            price
                            basePrice
                            total
                            baseTotal
                            productId
                            productType
                            orderItemId
                            shipmentId
                        }
                        refundItems {
                            id
                            name
                            description
                            sku
                            qty
                            price
                            basePrice
                            total
                            baseTotal
                            taxAmount
                            baseTaxAmount
                            discountPercent
                            discountAmount
                            baseDiscountAmount
                            productId
                            productType
                            orderItemId
                            refundId
                            parentId
                        }
                    }
                    shipments {
                        id
                        status
                        totalQty
                        totalWeight
                        carrierCode
                        carrierTitle
                        trackNumber
                        emailSent
                        customerId
                        customerType
                        orderId
                        orderAddressId
                        createdAt
                        updatedAt
                    }
                }
            }
        }`,
        variables: variables
      });
  } catch (error) {
    console.log('Error getOrderList:');
    console.log(error);
    throw error.graphQLErrors?.[0].message || error.networkError?.result || error;
  }
}
