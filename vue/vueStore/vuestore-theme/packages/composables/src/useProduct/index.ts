import {
  Context,
  useProductFactory,
  UseProductFactoryParams
} from '@vue-storefront/core';
import type { Product } from '@vue-storefront/myshop-api';
import type { UseProductSearchParams as SearchParams } from '../types';


const params: UseProductFactoryParams<Product, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productsSearch: async (context: Context, params) => {
    switch (params.typeListing) {
      case 'productDetail':
        console.log('Mocked: useProduct.getProductDetail');
        const productDetailResults = await context.$myshop.api.getProductDetail(params);

        return productDetailResults;
      case 'newProduct':
        console.log('Mocked: useProduct.getNewProduct');
        const newProductResults = await context.$myshop.api.getNewProduct(params);

        return newProductResults;
      case 'featuredProduct':
        console.log('Mocked: useProduct.getFeaturedProduct');
        const featuredProductResults = await context.$myshop.api.getFeaturedProduct(params);

        return featuredProductResults;
      case 'relatedProduct':
        console.log('Mocked: useProduct.getRelatedProduct');
        const relatedProductResults = await context.$myshop.api.getNewProduct(params);

        return relatedProductResults;
    }
  }
  /*productsSearch: async (context: Context, params) => {
    console.info("inside search");
    const data = await context.$myshop.api.getFeaturedProduct(params);
    return data;
  }*/
};

export const useProduct = useProductFactory<Product, SearchParams>(params);
