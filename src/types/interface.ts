/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

// API Specific Types
export interface RequestError {
  message: string;
  locations: Array<{ line: number; column: number }>;
  path: Array<string>;
  extensions: {
    errorMessage: string;
    classification: string;
  };
}

export interface ClientProps {
  apiUrl: string;
  environmentId: string;
  websiteCode: string;
  storeCode: string;
  storeViewCode: string;
  apiKey: string;
  xRequestId?: string;
}

export interface StoreDetailsConfig {
  searchQuery?: string; // 'q' default search query param if not provided.
  allowAllProducts?: string | boolean;
  perPageConfig?: { pageSizeOptions?: string; defaultPageSizeOption?: string };
  minQueryLength?: string | number; // string if used on magento, number if used on data-service-graphql
  pageSize?: number;
  currencySymbol?: string;
  currencyRate?: string;
  currentCategoryUrlPath?: string;
  currentCategoryId?: string;
  categoryName?: string;
  groupConfig?: { groupBy: string; size: number; ignore: string[]; };
  headerViews: Array<'search' | 'switch' | 'sort'>;
  displaySearchBox?: boolean;
  displayOutOfStock?: string | boolean; // "1" will return from php escapeJs and boolean is returned if called from data-service-graphql
  displayPricing?: boolean;
  displayDiscount?: boolean;
  displayMode?: string;
  listView?: boolean;
  locale?: string;
  priceSlider?: boolean;
  imageCarousel?: boolean;
  optimizeImages?: boolean;
  imageBaseWidth?: number;
  accountType?: 'purchasing' | 'shopping';
  wishlists?: Array<{id: string, name: string}>;
  route?: RedirectRouteFunc; // optional product redirect func prop
  resolveCartId?: () => Promise<string | undefined>;
  refreshCart?: () => void;
  addToCart?: (
    sku: string,
    options: string[],
    quantity: number
  ) => Promise<void | undefined>;
  onCategoryChange?: (category: Category) => void;
}

// Types
export type BucketTypename =
  | 'ScalarBucket'
  | 'RangeBucket'
  | 'StatsBucket'
  | 'CategoryView';

export type RedirectRouteFunc = ({
  sku,
  urlKey,
  url,
}: {
  sku: string;
  urlKey: null | string;
  url: null | string;
}) => string;

export interface MagentoHeaders {
  environmentId: string;
  websiteCode: string;
  storeCode: string;
  storeViewCode: string;
  apiKey: string;
  xRequestId: string;
  customerGroup: string;
}

export interface ProductSearchQuery {
  phrase: string;
  pageSize?: number;
  currentPage?: number;
  displayOutOfStock?: string | boolean;
  filter?: SearchClauseInput[];
  sort?: ProductSearchSortInput[];
  xRequestId?: string;
  context?: QueryContextInput;
  data?: QueryData;
  categorySearch?: boolean;
  categoryId?: string;
}

export interface CategoriesQuery {
  ids: string[];
  roles?: string[];
  subtree?: {
    startLevel: number;
    depth: number;
  }
}

export interface RefineProductQuery {
  optionIds: string[];
  sku: string;
  context?: QueryContextInput;
}

export type QueryResponse<T> = Promise<T>;

export interface SearchClauseInput {
  attribute: string;
  in?: string[];
  eq?: string;
  range?: {
    from: number;
    to: number;
  };
}

export interface ProductSearchSortInput {
  attribute: string;
  direction: 'ASC' | 'DESC';
}

export interface QueryContextInput {
  customerGroup?: string;
  userViewHistory?: { sku: string; dateTime: string }[];
}

export interface QueryData {
  products: boolean;
  facets: boolean;
  suggestions: boolean;
}

export type ProductSearchPromise = QueryResponse<ProductSearchResponse>;

export type AttributeMetadata = {
  attribute: string;
  label: string;
  numeric: boolean;
};

export interface ProductSearchResponse {
  extensions: {
    'request-id': string;
  };
  data: {
    productSearch: {
      total_count: null | number;
      items: null | Array<Product>;
      facets: null | Array<Facet>;
      suggestions?: null | Array<string>;
      related_terms?: null | Array<string>;
      page_info: null | PageInfo;
    };
    attributeMetadata: {
      sortable: AttributeMetadata[];
    };
  };
  errors: Array<RequestError>;
}

export interface AttributeMetadataResponse {
  extensions: {
    'request-id': string;
  };
  data: {
    attributeMetadata: {
      sortable: AttributeMetadata[];
      filterableInSearch: AttributeMetadata[];
    };
  };
}

export interface CategoriesResponse {
  data: {
    categories: Category[];
  };
}

export interface Category {
  id: string;
  name: string;
  path: string;
  urlPath: string;
  children: string[];
}

export interface Product {
  product: {
    __typename: string;
    name: string;
    sku: string;
    canonical_url: null | string;
    image: null | ProductMedia;
    small_image: null | ProductMedia;
    thumbnail: null | ProductMedia;
    price_range: {
      minimum_price: ProductPrice;
      maximum_price: ProductPrice;
    };
  };
  productView: {
    __typename: string;
    id: number;
    name: string;
    sku: string;
    url: null | string;
    urlKey: null | string;
    description: null | ComplexTextValue;
    shortDescription: null | ComplexTextValue;
    attributes: Array<{
      label: string;
      name: string;
      value: string;
    }> | null;
    images: null | ProductViewMedia[];
    price: {
      regular: ProductViewPrice;
      final: ProductViewPrice;
    };
    options:
      | null
      | {
          id: null | string;
          title: null | string;
          values: null | SwatchValues[];
        }[];
  };
  highlights: Array<Highlights>;
}

export type GroupedProducts = Record<string, {
  total_count: null | number;
  items: Product[];
}>;

export interface RefinedProduct {
  refineProduct: {
    __typename: string;
    id: number;
    uid: string;
    name: string;
    sku: string;
    description: null | ComplexTextValue;
    short_description: null | ComplexTextValue;
    attribute_set_id: null | number;
    meta_title: null | string;
    meta_keyword: null | string;
    meta_description: null | string;
    images: null | ProductViewMedia[];
    new_from_date: null | string;
    new_to_date: null | string;
    created_at: null | string;
    updated_at: null | string;
    price: {
      final: ProductViewPrice;
      regular: ProductViewPrice;
    };
    priceRange: {
      minimum: {
        final: ProductViewPrice;
        regular: ProductViewPrice;
      };
      maximum: {
        final: ProductViewPrice;
        regular: ProductViewPrice;
      };
    };
    gift_message_available: null | string;
    url: null | string;
    media_gallery: null | ProductViewMedia;
    custom_attributes: null | CustomAttribute;
    add_to_cart_allowed: null | boolean;
    options:
      | null
      | {
          id: null | string;
          title: null | string;
          values: null | SwatchValues[];
        }[];
  };
  highlights: Array<Highlights>;
}

export interface ComplexTextValue {
  html: string;
}
export interface Money {
  value: number;
  currency: string;
}

export interface ProductPrice {
  fixed_product_taxes: null | { amount: Money; label: string };
  regular_price: Money;
  final_price: Money;
  discount: null | { percent_off: number; amount_off: number };
}

export interface ProductViewPrice {
  amount: Money;
}

type ImageRoles = 'image' | 'small_image' | 'thumbnail' | 'swatch_image';

export interface ProductMedia {
  url: null | string;
  label: null | string;
  position: null | number;
  disabled: null | boolean;
}

export interface ProductViewMedia {
  url: null | string;
  label: null | string;
  position: null | number;
  disabled: null | boolean;
  roles: ImageRoles[];
}

export interface SwatchValues {
  title: string;
  id: string;
  type: string;
  value: string;
}

export interface CustomAttribute {
  code: string;
  value: string;
}

export interface Highlights {
  attribute: string;
  value: string;
  matched_words: Array<string>;
}

export interface PageInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
}

export interface Facet {
  __typename?: BucketTypename;
  title: string;
  attribute: string;
  type?: 'PINNED' | 'INTELLIGENT' | 'POPULAR';
  buckets: Array<RangeBucket | ScalarBucket | StatsBucket | CategoryView>;
}

interface AnyBucket {
  title: string;
}

export interface RangeBucket extends AnyBucket {
  __typename: 'RangeBucket';
  from: number;
  to: number;
  count: number;
}

export interface ScalarBucket extends AnyBucket {
  __typename: 'ScalarBucket';
  id?: string;
  count: number;
}

export interface StatsBucket extends AnyBucket {
  __typename: 'StatsBucket';
  min: number;
  max: number;
}

export interface CategoryView {
  __typename: 'CategoryView';
  title: string;
  name: string;
  path: string | string[];
  count: number;
}

export interface PriceFacet extends Facet {
  buckets: RangeBucket[];
}

export interface FacetFilter {
  attribute: string;
  in?: string[];
  eq?: string;
  range?: {
    from: number;
    to: number;
  };
}

export interface FeatureFlags {
  [key: string]: boolean;
}

export interface PageSizeOption {
  label: string;
  value: number;
}

export interface SortMetadata {
  label: string;
  attribute: string;
  numeric: boolean;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface GQLSortInput {
  direction: 'ASC' | 'DESC';
  attribute: string;
}
