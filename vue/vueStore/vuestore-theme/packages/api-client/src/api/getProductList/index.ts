
import { gql } from "@apollo/client/core";
import { FilterProductListingInput } from '../../types';

type Variables = {
    first: 10,
    page: 1,
    input: FilterProductListingInput;
  };

export async function getProductList(context, params) {
  const inputFilters = params?.input?.filters || {};
  inputFilters.categorySlug = params?.input?.categorySlug || '';

  const variables: Variables = {
    page: params.input.page || 1,
    first: params.input.itemsPerPage,
    input: inputFilters
  };

  try {
        return await context.client
        .query({
            query: gql`
            query getProductListing ($input: FilterProductListingInput, $first: Int = 10, $page: Int = 1) {
                getProductListing(input: $input, first: $first, page: $page) {
                    paginatorInfo {
                        count
                        currentPage
                        lastPage
                        total
                    }
                    data {
                        id
                        type
                        isInWishlist
                        attributeFamilyId
                        sku
                        parentId
                        productFlats {
                            id
                            sku
                            productNumber
                            name
                            description
                            shortDescription
                            urlKey
                            new
                            featured
                            status
                            visibleIndividually
                            thumbnail
                            price
                            cost
                            specialPrice
                            specialPriceFrom
                            specialPriceTo
                            weight
                            color
                            colorLabel
                            size
                            sizeLabel
                            locale
                            channel
                            productId
                            parentId
                            minPrice
                            maxPrice
                            metaTitle
                            metaKeywords
                            metaDescription
                            width
                            height
                            depth
                            createdAt
                            updatedAt
                        }
                        cacheBaseImage {
                            smallImageUrl
                            mediumImageUrl
                            largeImageUrl
                            originalImageUrl
                        }
                        cacheGalleryImages {
                            smallImageUrl
                            mediumImageUrl
                            largeImageUrl
                            originalImageUrl
                        }
                        priceHtml {
                            id
                            type
                            html
                            regular
                            special
                        }
                        reviews {
                            id
                            title
                            rating
                            comment
                            status
                            productId
                            customerId
                            customerName
                            createdAt
                            updatedAt
                        }
                    }
                }
            }`,
            variables: variables
        });
  } catch (error) {
    console.log('Error getProductList:');
    console.log(error);
    throw error.graphQLErrors?.[0].message || error.networkError?.result || error;
  }
}
