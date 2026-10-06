// src/Components/Common/SearchableDropdown.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createGetRequest } from '../../Hooks/Services/Requests';
import useTranslate from '../../Hooks/Translation/useTranslate';

const SearchableDropdown = ({
  endpoint,
  idField,
  nameField,
  nameFieldAr,
  label,
  placeholder,
  value,
  onChange,
  error,
  touched,
  disabled = false,
  required = false,
  className = '',
  isReadOnly, // Added for parent compatibility
  isLoading, // Added for parent compatibility
  searchParamName, // e.g., "Filter.searchText" for server-side search
  queryParams = {}, // Additional query parameters for API requests
  pageSize = 1000, // Default to 1000 to load all items
}) => {
  const { lang, t } = useTranslate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  // ── Pagination state ───────────────────────────────────────────────────────
  const pageRef = useRef(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (endpoint) {
      pageRef.current = 1;
      fetchData(1, true);
    }
  }, [endpoint, JSON.stringify(queryParams)]);

  // Fetch from server whenever search term changes (debounced)
  useEffect(() => {
    if (!endpoint) return;
    const timer = setTimeout(() => {
      pageRef.current = 1;
      fetchData(1, true);
    }, 300); // debounce
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async (page = 1, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // ✅ Build base params from queryParams prop
      const params = new URLSearchParams(queryParams);

      // Always send search text to the server
      if (searchTerm.trim()) {
        const paramName = searchParamName || 'searchText';
        params.set(paramName, searchTerm.trim());
      }

      // Add pagination params - prioritize queryParams or prop, default to 1000
      const effectivePageSize =
        queryParams?.PageSize ||
        queryParams?.pageSize ||
        queryParams?.pagesize ||
        pageSize ||
        1000;

      params.set('PageNumber', page);
      params.set('PageIndex', page);
      params.set('PageSize', effectivePageSize);

      const queryString = params.toString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await createGetRequest(url, {});

      let items = [];
      let totalPages = 1;
      let hasNext = false;

      const rawData = response?.data !== undefined ? response.data : response;

      if (Array.isArray(rawData)) {
        items = rawData;
        totalPages = 1;
        hasNext = false;
      } else if (rawData && typeof rawData === 'object') {
        const rawItems =
          rawData.value?.items ||
          rawData.value?.Items ||
          rawData.items ||
          rawData.Items ||
          rawData.data ||
          rawData.Data ||
          [];

        if (Array.isArray(rawItems)) {
          items = rawItems;
        }

        const totalCount =
          rawData.value?.totalCount ??
          rawData.value?.TotalCount ??
          rawData.totalCount ??
          rawData.TotalCount ??
          (Array.isArray(items) ? items.length : 0);

        totalPages =
          rawData.value?.totalPages ??
          rawData.value?.TotalPages ??
          rawData.totalPages ??
          rawData.TotalPages ??
          (totalCount ? Math.ceil(totalCount / effectivePageSize) : 1);

        hasNext =
          rawData.value?.hasNextPage ??
          rawData.value?.HasNextPage ??
          rawData.hasNextPage ??
          rawData.HasNextPage ??
          (totalCount ? page * effectivePageSize < totalCount : page < totalPages);
      }

      if (reset) {
        setData(items);
      } else {
        setData((prev) => {
          // Avoid duplicates by filtering out items already present
          const existingIds = new Set(prev.map((item) => item[idField]));
          const newItems = items.filter((item) => !existingIds.has(item[idField]));
          return [...prev, ...newItems];
        });
      }

      pageRef.current = page;
      setHasMore(Boolean(hasNext || (totalPages > 1 && page < totalPages)));
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ── Infinite scroll handler ────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || loadingMore || !hasMore) return;

    // When scrolled within 30px of the bottom, load more
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 30) {
      fetchData(pageRef.current + 1, false);
    }
  }, [loadingMore, hasMore]);

  const getDisplayName = (item) => {
    if (lang === 'ar' && nameFieldAr && item[nameFieldAr]) {
      return item[nameFieldAr];
    }
    return item[nameField];
  };

  const selectedItem = data.find(
    (item) =>
      value !== null &&
      value !== undefined &&
      value !== '' &&
      String(item[idField]) === String(value)
  );

  // Client-side instant filter fallback
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.trim().toLowerCase();
    const matches = data.filter((item) => {
      const en = String(item[nameField] || '').toLowerCase();
      const ar = String(item[nameFieldAr] || '').toLowerCase();
      return en.includes(term) || ar.includes(term);
    });
    return matches.length > 0 ? matches : data;
  }, [data, searchTerm, nameField, nameFieldAr]);

  // Disable interactions if readOnly
  const isDisabled = disabled || isReadOnly;

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-Cairo mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          disabled={isDisabled}
          className={`
            w-full px-4 py-2.5 text-left
            border rounded-lg font-Cairo text-sm
            flex items-center justify-between
            focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200
            ${error && touched ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
            ${isDisabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-[#1e1e1e]'}
          `}
        >
          <span className={selectedItem ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
            {selectedItem ? getDisplayName(selectedItem) : placeholder || t('Select')}
          </span>
          <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line text-gray-400 dark:text-gray-500`}></i>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div
              className="overflow-y-auto max-h-48"
              ref={listRef}
              onScroll={handleScroll}
            >
              {isLoading || loading ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">Loading...</div>
              ) : filteredData.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">No options found</div>
              ) : (
                <>
                  {filteredData.map((item) => {
                    const isSelected =
                      value !== null &&
                      value !== undefined &&
                      value !== '' &&
                      String(item[idField]) === String(value);

                    return (
                      <button
                        key={item[idField]}
                        type="button"
                        onClick={() => {
                          // ✅ Pass both the ID value AND the full item object
                          onChange(item[idField], item);
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                        className={`
                          w-full px-4 py-2 text-left text-sm hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors
                          ${isSelected ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold' : 'text-gray-900 dark:text-white'}
                        `}
                      >
                        {getDisplayName(item)}
                      </button>
                    );
                  })}
                  {loadingMore && (
                    <div className="px-4 py-2 text-sm text-gray-400 text-center">Loading more…</div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && touched && <p className="text-red-500 text-xs mt-1 font-Cairo">{error}</p>}
    </div>
  );
};

export default SearchableDropdown;
