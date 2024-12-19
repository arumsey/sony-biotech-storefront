/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Product, RefinedProduct } from '../types/interface';

const getProductPrice = (
  product: Product | RefinedProduct,
  currencySymbol: string,
  currencyRate: string | undefined,
  useMaximum = false,
  useFinal = false
): string => {
  let priceType;
  let price;
  if ('product' in product) {
    priceType = product?.product?.price_range?.minimum_price;

    if (useMaximum) {
      priceType = product?.product?.price_range?.maximum_price;
    }

    price = priceType?.regular_price;
    if (useFinal) {
      price = priceType?.final_price;
    }
  } else {
    priceType =
      product?.refineProduct?.priceRange?.minimum ??
      product?.refineProduct?.price;

    if (useMaximum) {
      priceType = product?.refineProduct?.priceRange?.maximum;
    }

    price = priceType?.regular?.amount;
    if (useFinal) {
      price = priceType?.final?.amount;
    }
  }

  const convertedPrice = currencyRate
    ? price?.value * parseFloat(currencyRate)
    : price?.value;

  if (currencySymbol) {
    return convertedPrice ? `${currencySymbol}${convertedPrice.toFixed(2)}` : '';
  }

  // if currency symbol is configurable within Commerce, that symbol is used
  let currency = price?.currency || 'USD';
  const format = new Intl.NumberFormat(document.documentElement.lang || 'en', {
    style: 'currency',
    currency,
  });
  return convertedPrice ? format.format(convertedPrice) : '';
};

export { getProductPrice };
