/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { CategoryFilters } from '../components/CategoryFilters';
import { SelectedFilters } from '../components/Facets';
import FilterButton from '../components/FilterButton';
import Loading from '../components/Loading';
import Shimmer from '../components/Shimmer';
import {
  useProducts,
  useSearch,
  useSensor,
  useStore,
  useTranslation,
} from '../context';
import { ProductsContainer } from './ProductsContainer';
import { ProductsHeader } from './ProductsHeader';
import X from '../icons/x-lg.svg';
import './App.css';

export const App: FunctionComponent = () => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();
  const {screenSize} = useSensor();
  const translation = useTranslation();
  const { config: { displayMode, headerViews, listView }} = useStore();
  const [showFilters, setShowFilters] = useState(!screenSize.mobile);

  useEffect(() => {
    if (screenSize.mobile) {
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  }, [screenSize]);

  const loadingLabel = translation.Loading.title;

  const renderFilterView = !screenSize.mobile && showFilters && productsCtx.facets.length > 0;
  const filterButtonTitle = translation.Filter.showTitle;

  if (displayMode === 'PAGE') {
    return <></>;
  }

  return (
    <div className="ds-widgets bg-body py-2">
      {renderFilterView ? (
        <div className="flex gap-8">
          <div className="ds-widgets_filters w-[21%]">
            <div className="flex flex-col bg-gray-200 rounded">
              <SelectedFilters direction="vertical"/>
              <CategoryFilters
                loading={productsCtx.loading}
                pageLoading={productsCtx.pageLoading}
                facets={productsCtx.facets}
                totalCount={productsCtx.totalCount}
                categoryName={productsCtx.categoryName ?? ''}
                phrase={productsCtx.variables.phrase ?? ''}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filterCount={searchCtx.filterCount}
              />
            </div>
          </div>
          <div
            className={`ds-widgets_results flex flex-col items-center w-full h-full`}
          >
            {!!headerViews.length && (
              <ProductsHeader
                facets={productsCtx.facets}
                totalCount={productsCtx.totalCount}
                screenSize={screenSize}
              />
            )}
            <ProductsContainer showFilters={showFilters}/>
          </div>
      </div>
      ) : (
      <div className="flex flex-col">
        <div className="ds-widgets_results flex flex-col items-center w-full h-full">
          <div className={`ds-widgets_filterButton flex w-full h-full ${showFilters ? 'hidden' : 'block'}`}>
            {!productsCtx.loading &&
              productsCtx.facets.length > 0 && (
                <div className="flex w-full h-full mb-sm">
                  <FilterButton
                    displayFilter={() => setShowFilters(true)}
                    type="desktop"
                    title={filterButtonTitle}
                  />
                </div>
              )}
          </div>
          {productsCtx.loading ? (
            screenSize.mobile ? (
              <Loading label={loadingLabel} />
            ) : (
              <Shimmer listView={listView} />
            )
          ) : (
            <>
              {!!headerViews.length && (
                <div className="flex w-full h-full">
                  <ProductsHeader
                    facets={productsCtx.facets}
                    totalCount={productsCtx.totalCount}
                    screenSize={screenSize}
                  />
                </div>
              )}
              <SelectedFilters/>
              <ProductsContainer
                showFilters={showFilters && productsCtx.facets.length > 0}
              />
              {showFilters && (
                <div class="fullscreen absolute w-screen h-screen bg-white">
                  <div class="flex flex-row justify-end items-center h-[48px] p-sm">
                    <button
                      type="button"
                      className="inline-flex w-[16px] h-[16px]"
                    >
                      <span className="sr-only">Dismiss</span>
                      <X
                        className="w-[16px] h-[16px]"
                        aria-hidden="true"
                        onClick={() => setShowFilters(false)}
                      />
                    </button>
                  </div>
                  <div class="flex flex-col bg-gray-200">
                    <CategoryFilters
                      loading={productsCtx.loading}
                      pageLoading={productsCtx.pageLoading}
                      facets={productsCtx.facets}
                      totalCount={productsCtx.totalCount}
                      categoryName={productsCtx.categoryName ?? ''}
                      phrase={productsCtx.variables.phrase ?? ''}
                      showFilters={showFilters}
                      setShowFilters={setShowFilters}
                      filterCount={searchCtx.filterCount}
                    />
                  </div>
                  </div>
                  )}
                </>
              )}
            </div>
            </div>
      )}
    </div>
  );
}

export default App;
