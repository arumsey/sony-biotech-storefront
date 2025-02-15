/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Fragment, FunctionComponent } from 'preact';

import { useCategories, useProducts, useSearch, useTranslation } from '../../context';
import Pill from '../Pill';
import { formatBinaryLabel, formatRangeLabel } from './format';

type SelectedFiltersProps = {
  direction?: 'horizontal' | 'vertical';
}

export const SelectedFilters: FunctionComponent<SelectedFiltersProps> = ({ direction = "horizontal" }) => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();
  const translation = useTranslation();
  const { categories }  = useCategories();

  const additionalCategoryNames = categories?.map(({ name, urlPath }) => ({
    name,
    value: urlPath,
    attribute: 'categories'
  }));
  const allCategoryNames = [...searchCtx.categoryNames, ...additionalCategoryNames];
  const usedPillLabels = new Set();

  return (
    <div className="w-full">
      {searchCtx.filters?.length > 0 && (
        <div className={`ds-plp-facets__pills pb-6 sm:pb-6 flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} flex-wrap justify-start`}>
          {searchCtx.filters.map((filter) => (
            <Fragment key={filter.attribute}>
              {filter.in?.map((option) => {
                const pillLabel = formatBinaryLabel(
                  filter,
                  option,
                  allCategoryNames as any
                );
                if (usedPillLabels.has(pillLabel)) {
                  return null;
                }
                usedPillLabels.add(pillLabel);
                return (
                  <Pill
                    key={formatBinaryLabel(
                      filter,
                      option,
                      allCategoryNames as any
                    )}
                    label={formatBinaryLabel(
                      filter,
                      option,
                      allCategoryNames as any
                    )}
                    type="transparent"
                    onClick={() => searchCtx.updateFilterOptions(filter, option)}
                  />
              )})}
              {filter.range && (
                <Pill
                  label={formatRangeLabel(
                    filter,
                    productsCtx.currencyRate,
                    productsCtx.currencySymbol
                  )}
                  type="transparent"
                  onClick={() => {
                    searchCtx.removeFilter(filter.attribute);
                  }}
                />
              )}
            </Fragment>
          ))}
          <div className="py-1">
            <button
              className="ds-plp-facets__header__clear-all pt-md border-none bg-transparent hover:border-none hover:bg-transparent
              focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none text-primary text-sm px-4"
              onClick={() => searchCtx.clearFilters()}
            >
              {translation.Filter.clearAll}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
