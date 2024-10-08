/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionalComponent, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { ProductCardShimmer } from '../components/ProductCardShimmer';
import { isGroupedProducts, useProducts, useSensor, useStore, useTranslation } from '../context';
import { PageSizeOption } from '../types/interface';
import {
  handleUrlPageSize,
  handleUrlPagination,
} from '../utils/handleUrlFilters';

import { Alert } from '../components/Alert';
import { Pagination } from '../components/Pagination';
import { PerPagePicker, PerPagePickerProps } from '../components/PerPagePicker';
import { ProductList } from '../components/ProductList';
import { ProductListShimmer } from "../components/ProductListShimmer";

interface Props {
  showFilters: boolean;
}

export const ProductsContainer: FunctionComponent<Props> = ({
  showFilters,
}) => {
  const productsCtx = useProducts();
  const { screenSize } = useSensor();
  const {
    config: { listView, currentCategoryUrlPath, currentCategoryId },
  } = useStore();

  const {
    variables,
    items,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    totalPages,
    totalCount,
    minQueryLength,
    minQueryLengthReached,
    pageSizeOptions,
    loading,
  } = productsCtx;

  useEffect(() => {
    if (currentPage < 1) {
      goToPage(1);
    }
  }, []);

  const productItemArray = Array.from<string>({ length: 8 });
  const isCategory = currentCategoryUrlPath || currentCategoryId;

  const goToPage = (page: number | string) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
      handleUrlPagination(page);
    }
  };

  const onPageSizeChange = (pageSizeOption: number) => {
    setPageSize(pageSizeOption);
    handleUrlPageSize(pageSizeOption);
  };
  const translation = useTranslation();

  const getPageSizeTranslation = (
    pageSize: number,
    pageSizeOptions: PageSizeOption[],
    PerPagePicker: FunctionalComponent<PerPagePickerProps>
  ) => {
    const pageSizeTranslation = translation.ProductContainers.pagePicker;
    const pageSizeTranslationOrder = pageSizeTranslation.split(' ');
    return pageSizeTranslationOrder.map((word: string, index: any) =>
      word === '{pageSize}' ? (
        <PerPagePicker
          pageSizeOptions={pageSizeOptions}
          value={pageSize}
          onChange={onPageSizeChange}
          key={index}
        />
      ) : (
        `${word} `
      )
    );
  };

  if (!minQueryLengthReached) {
    const templateMinQueryText = translation.ProductContainers.minquery;
    const title = templateMinQueryText
      .replace('{variables.phrase}', variables.phrase)
      .replace('{minQueryLength}', minQueryLength);
    return (
      <div className="ds-sdk-min-query__page mx-auto max-w-8xl py-12 px-4 sm:px-6 lg:px-8">
        <Alert title={title} type="warning" description="" />
      </div>
    );
  }

  if (!totalCount) {
    if (isCategory) {
      // @ts-ignore
      import(/* webpackIgnore: true */ '/scripts/scripts.js').then(({ renderErrorPage }) => {
        renderErrorPage('404');
      });
    }
    return (
      <div className="ds-sdk-no-results__page mx-auto max-w-8xl py-12 px-4 sm:px-6 lg:px-8">
        <Alert
          title={translation.ProductContainers.noresults}
          type="warning"
          description=""
        />
      </div>
    );
  }

  return (
    <>
      {loading ?
        listView ? (
          <div className="ds-sdk-product-list__grid flex-col w-full gap-8 pl-8">
            <ProductListShimmer items={productItemArray} />
          </div>
        ) : (
        <div
          style={{
            gridTemplateColumns: `repeat(${screenSize.columns}, minmax(0, 1fr))`,
          }}
          className="ds-sdk-product-list__grid mt-md grid grid-cols-1 gap-y-8 gap-x-md sm:grid-cols-2 md:grid-cols-3 xl:gap-x-4 pl-8"
        >
          {productItemArray.map((_, index) => (
            <ProductCardShimmer key={index} />
          ))}
        </div>
      ) : (
        <ProductList
          products={items}
          showFilters={showFilters}
        />
      )}
      {!isGroupedProducts(items) && (
        <div
          className={`flex flex-row justify-between max-w-full ${
            showFilters ? 'mx-auto' : 'mr-auto'
          } w-full h-full`}
        >
          <div>
            {getPageSizeTranslation(pageSize, pageSizeOptions, PerPagePicker)}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </div>
      )}
    </>
  );
};
