import React, { useCallback, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { createGetRequest } from '../../Hooks/Services/Requests';
import useTranslate from '../../Hooks/Translation/useTranslate';

const defaultColors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function TimelineChart({
    api,
    filters = {},
    mapData,
    title,
    height = 450,
    selectedDate,
    extraHeaderContent,
    emptyMessage = 'No chart data available'
}) {
    const { t, currentLang } = useTranslate();
    const [chartData, setChartData] = useState({ series: [], hasData: false });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchChartData = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = typeof api === 'function'
                ? await api(filters)
                : await createGetRequest(api, filters);
            
            const mappedData = mapData(response?.data || response || {});
            
            // Check if there is actual data inside the series
            const hasData = mappedData.series.some(s => s.data && s.data.length > 0);
            
            setChartData({ series: mappedData.series || [], hasData });
        } catch (requestError) {
            console.error('Failed to fetch timeline chart data:', requestError);
            setChartData({ series: [], hasData: false });
            setError('Unable to load chart data');
        } finally {
            setIsLoading(false);
        }
    }, [api, filters, mapData]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    const isRtl = currentLang === 'ar';

    const minTime = selectedDate 
        ? new Date(`${selectedDate}T00:00:00`).getTime() 
        : new Date().setHours(0, 0, 0, 0);
    const maxTime = selectedDate
        ? new Date(`${selectedDate}T23:59:59.999`).getTime()
        : new Date().setHours(23, 59, 59, 999);

    const numCategories = new Set(
        (chartData.series || []).flatMap(s => 
            Array.isArray(s?.data) ? s.data.map(d => d?.x).filter(Boolean) : []
        )
    ).size;
    const computedHeight = Math.max(height, numCategories * 50 + 100);

    const options = {
        chart: {
            type: 'rangeBar',
            height: computedHeight,
            toolbar: { show: false },
            fontFamily: 'Cairo, sans-serif'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '80%',
                rangeBarGroupRows: true
            }
        },
        fill: {
            type: 'solid',
            opacity: 1
        },
        colors: chartData.series.map(s => s.color).filter(Boolean).length > 0 
                ? chartData.series.map(s => s.color) 
                : defaultColors,
        xaxis: {
            type: 'datetime',
            min: minTime,
            max: maxTime,
            tickAmount: 24,
            reversed: isRtl,
            labels: {
                datetimeUTC: false,
                format: 'HH:mm',
                style: {
                    colors: '#9ca3af'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontWeight: 600,
                    colors: '#6b7280'
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            markers: { radius: 12 },
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        tooltip: {
            theme: 'light',
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                const seriesData = w?.globals?.initialSeries?.[seriesIndex] || w?.config?.series?.[seriesIndex] || {};
                const data = seriesData?.data?.[dataPointIndex] || { x: 'Unknown', y: [0, 0] };
                const seriesName = seriesData?.name || 'Unknown';
                const color = w?.config?.colors?.[seriesIndex] || '#000';
                
                const start = data.y[0] ? new Date(data.y[0]) : new Date();
                const end = data.y[1] ? new Date(data.y[1]) : new Date();
                
                const formatTime = (date) => {
                    return date.toLocaleTimeString(currentLang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                };
                
                const rtlDir = currentLang === 'ar' ? 'rtl' : 'ltr';
                const marginSide = currentLang === 'ar' ? 'marginLeft' : 'marginRight';
                
                return `
                    <div style="padding: 12px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-left: 4px solid ${color}; direction: ${rtlDir}; text-align: ${currentLang === 'ar' ? 'right' : 'left'};">
                        <div style="font-weight: 700; margin-bottom: 8px; font-size: 14px; color: #374151;">${data.x}</div>
                        <div style="display: flex; align-items: center; margin-bottom: 6px; font-size: 13px; color: #4b5563;">
                            <span style="display: inline-block; width: 8px; height: 8px; background-color: ${color}; border-radius: 50%; ${marginSide}: 8px;"></span>
                            <span style="font-weight: 600;">${seriesName}</span>
                        </div>
                        <div style="font-size: 12px; color: #6b7280; font-family: monospace;">
                            ${formatTime(start)} — ${formatTime(end)}
                        </div>
                    </div>
                `;
            }
        },
        grid: {
            borderColor: '#f3f4f6',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: false } },
            padding: {
                left: 10,
                right: 10
            }
        }
    };

    return (
        <section className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500 dark:text-primary-300">
                        {t('Timeline analysis')}
                    </p>
                    {title && (
                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white font-Cairo">
                            {title}
                        </h2>
                    )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {extraHeaderContent}
                    <button
                        type="button"
                        onClick={fetchChartData}
                        disabled={isLoading}
                        aria-label={t('Refresh chart')}
                        className="w-full sm:w-auto inline-flex items-center justify-center h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        <i className={`ri-refresh-line text-lg ${isLoading ? 'animate-spin' : ''}`}></i>
                    </button>
                </div>
            </div>

            <div className="w-full" style={{ height: computedHeight }} dir={isRtl ? 'rtl' : 'ltr'}> 
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <i className="ri-loader-4-line text-3xl animate-spin"></i>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-red-500 dark:text-red-400">
                        <i className="ri-error-warning-line text-3xl"></i>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : !chartData.hasData ? (
                    <div className="h-full flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                        {emptyMessage}
                    </div>
                ) : (
                    <Chart 
                        options={options} 
                        series={chartData.series} 
                        type="rangeBar" 
                        height={computedHeight} 
                    />
                )}
            </div>
        </section>
    );
}
