/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

import {
  QueryContextInput,
  RedirectRouteFunc,
  StoreDetailsConfig,
} from '../types/interface';
import { WithChildrenProps } from "../types/utils";

interface StoreProps extends WithChildrenProps {
  environmentId: string;
  environmentType: string;
  websiteCode: string;
  storeCode: string;
  storeViewCode: string;
  config: StoreDetailsConfig;
  context?: QueryContextInput;
  apiUrl: string;
  apiKey: string;
  mediaHost: string;
  route?: RedirectRouteFunc; // optional product redirect func prop
  searchQuery?: string; // 'q' default search query param if not provided.
}

const StoreContext = createContext<StoreProps>({
  environmentId: '',
  environmentType: '',
  websiteCode: '',
  storeCode: '',
  storeViewCode: '',
  apiUrl: '',
  apiKey: '',
  mediaHost: '',
  config: {
    headerViews: ['search', 'sort'],
  },
  context: {},
  route: undefined,
  searchQuery: 'q',
});

const StoreContextProvider = ({
  children,
  ...storeProps
}: StoreProps) => {

  const cleanedStoreProps: StoreProps = useMemo(
    () => {

      const {
        environmentId,
        environmentType,
        websiteCode,
        storeCode,
        storeViewCode,
        config,
        context,
        apiKey,
        mediaHost,
        route,
        searchQuery,
      } = storeProps;

      return {
        environmentId,
        environmentType,
        websiteCode,
        storeCode,
        storeViewCode,
        config,
        context: {
          customerGroup: context?.customerGroup ?? '',
          userViewHistory: context?.userViewHistory ?? [],
        },
        apiUrl: environmentType?.toLowerCase() === 'testing' ? TEST_URL : API_URL,
        apiKey:
          environmentType?.toLowerCase() === 'testing' && !apiKey
            ? SANDBOX_KEY
            : apiKey,
        mediaHost: mediaHost ? mediaHost : MEDIA_HOST,
        route,
        searchQuery,
      }
    },
    [storeProps]
  );

  return (
    <StoreContext.Provider value={{ ...cleanedStoreProps }}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  return useContext(StoreContext);
};

export { StoreContextProvider, useStore, StoreProps };
