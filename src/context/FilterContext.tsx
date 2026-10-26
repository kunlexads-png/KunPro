import React, { createContext, useContext, useState } from 'react';
import { GlobalFilterState } from '../types';

interface FilterContextType {
  filters: GlobalFilterState;
  setDateRange: (range: GlobalFilterState['dateRange']) => void;
  setBusinessUnit: (unit: string) => void;
  setRegion: (region: string) => void;
  setCurrency: (curr: string) => void;
  resetFilters: () => void;
}

const defaultFilters: GlobalFilterState = {
  dateRange: '30d',
  businessUnit: 'all',
  region: 'all',
  currency: 'USD',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilterState>(defaultFilters);

  const setDateRange = (dateRange: GlobalFilterState['dateRange']) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  };

  const setBusinessUnit = (businessUnit: string) => {
    setFilters((prev) => ({ ...prev, businessUnit }));
  };

  const setRegion = (region: string) => {
    setFilters((prev) => ({ ...prev, region }));
  };

  const setCurrency = (currency: string) => {
    setFilters((prev) => ({ ...prev, currency }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setDateRange,
        setBusinessUnit,
        setRegion,
        setCurrency,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within a FilterProvider');
  return ctx;
};
