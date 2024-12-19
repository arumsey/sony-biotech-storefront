/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import useScalarFacet from '../../../hooks/useScalarFacet';
import {CategoryView, Facet as FacetType, PriceFacet} from '../../../types/interface';
import { InputButtonGroup } from '../../InputButtonGroup';
import {useMemo} from 'preact/hooks';

interface ScalarFacetProps {
  filterData: FacetType | PriceFacet;
}

export const ScalarFacet: FunctionComponent<ScalarFacetProps> = ({
  filterData,
}) => {
  const { isSelected, onChange } = useScalarFacet(filterData);

  const collapsedBuckets = useMemo(() => {
    const bucketType = filterData?.buckets[0]?.__typename;
    if (bucketType !== 'CategoryView') {
      return filterData.buckets;
    }
    // reduce buckets that share the same name
    const categoryBuckets = filterData.buckets as CategoryView[];
    return categoryBuckets.reduce((acc, bucket) => {
      const existingBucket = acc.find((b) => b.name === bucket.name);
      if (existingBucket) {
        existingBucket.count += bucket.count;
        existingBucket.path = Array.isArray(existingBucket.path) ? [...existingBucket.path, bucket.path as string] : [existingBucket.path, bucket.path as string];
        return acc;
      }
      return [...acc, bucket];

    }, [] as CategoryView[]);
  }, [filterData])

  return (
    <InputButtonGroup
      title={filterData.title}
      attribute={filterData.attribute}
      buckets={collapsedBuckets as any}
      type={'checkbox'}
      isSelected={isSelected}
      collapsible={true}
      onChange={(args) => onChange(args.value, args.selected)}
    />
  );
};
