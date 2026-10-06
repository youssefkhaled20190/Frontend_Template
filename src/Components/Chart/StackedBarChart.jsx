import React, { useCallback, useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { createGetRequest } from '../../Hooks/Services/Requests';

const defaultColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const unwrapResponse = (response) => response?.data || response || {};

const defaultMapData = (response) => {
    const data = unwrapResponse(response);
    return {
        categories: data.categories || [],
        series: data.series || [],
        rows: data.rows || data.items || []
    };
};

const buildRows = (categories, series) => categories.map((category, index) => (
    series.reduce((row, item) => ({
        ...row,
        [item.dataKey]: Number(item.data?.[index] || 0)
    }), { category })
));

const TimelineSegment = ({ x, y, width, height, fill, payload, dataKey }) => (
    <rect
        x={x}
        y={y}
        width={Math.max(width, 0)}
        height={height}
        fill={payload?.segmentColors?.[dataKey] || fill}
        stroke="var(--chart-tooltip)"
        strokeWidth={1}
        rx={2}
    />
);

export default function StackedBarChart({
    api,
    filters = {},
    mapData = defaultMapData,
    title,
    categoryLabel = 'Category',
    valueSuffix = '',
    height = 360,
    horizontal = false,
    timeline = false,
    timeTicks = [],
    timeDomain = [0, 1440],
    timeFormatter = (value) => value,
    emptyMessage = 'No chart data available',
    className = ''
}) {
    const [chartData, setChartData] = useState({ categories: [], series: [], rows: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchChartData = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = typeof api === 'function'
                ? await api(filters)
                : await createGetRequest(api, filters);
            const mappedData = mapData(unwrapResponse(response));
            const categories = mappedData.categories || [];
            const series = (mappedData.series || []).map((item, index) => ({
                ...item,
                dataKey: item.dataKey || item.name || `series-${index}`
            }));
            const rows = mappedData.rows?.length
                ? mappedData.rows
                : buildRows(categories, series);

            setChartData({ categories, series, rows });
        } catch (requestError) {
            console.error('Failed to fetch stacked chart data:', requestError);
            setChartData({ categories: [], series: [], rows: [] });
            setError('Unable to load chart data');
        } finally {
            setIsLoading(false);
        }
    }, [api, filters, mapData]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    const hasData = chartData.rows.length > 0 && chartData.series.length > 0;
    const chartRows = horizontal ? [...chartData.rows].reverse() : chartData.rows;
    const formatValue = (value) => `${value}${valueSuffix}`;
    const timelineKeys = timeline
        ? chartData.rows.reduce((keys, row) => [...new Set([...keys, ...(row.segmentKeys || [])])], [])
        : [];

    return (
        <section className={`bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 sm:p-6 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500 dark:text-primary-300">
                        Stacked analysis
                    </p>
                    {title && (
                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white font-Cairo">
                            {title}
                        </h2>
                    )}
                </div>
                <button
                    type="button"
                    onClick={fetchChartData}
                    disabled={isLoading}
                    aria-label="Refresh chart"
                    className="self-start sm:self-auto inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    <i className={`ri-refresh-line text-lg ${isLoading ? 'animate-spin' : ''}`}></i>
                </button>
            </div>

            <div className="w-full" style={{ height }}>
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <i className="ri-loader-4-line text-3xl animate-spin"></i>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-red-500 dark:text-red-400">
                        <i className="ri-error-warning-line text-3xl"></i>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : !hasData ? (
                    <div className="h-full flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                        {emptyMessage}
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartRows}
                            layout={horizontal ? 'vertical' : 'horizontal'}
                            margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={!horizontal} stroke="var(--chart-grid)" />
                            {timeline ? (
                                <>
                                    <XAxis
                                        type="number"
                                        domain={timeDomain}
                                        ticks={timeTicks}
                                        interval={0}
                                        minTickGap={0}
                                        tickFormatter={timeFormatter}
                                        tick={{ fontSize: 10 }}
                                        stroke="var(--chart-axis)"
                                    />
                                    <YAxis type="category" dataKey="category" width={92} stroke="var(--chart-axis)" />
                                </>
                            ) : horizontal ? (
                                <>
                                    <XAxis type="number" tickFormatter={formatValue} stroke="var(--chart-axis)" />
                                    <YAxis type="category" dataKey="category" width={92} stroke="var(--chart-axis)" />
                                </>
                            ) : (
                                <>
                                    <XAxis dataKey="category" tickLine={false} stroke="var(--chart-axis)" />
                                    <YAxis tickFormatter={formatValue} tickLine={false} stroke="var(--chart-axis)" />
                                </>
                            )}
                            <Tooltip
                                shared={timeline ? false : undefined}
                                cursor={{ fill: 'var(--chart-hover)' }}
                                formatter={(value, name, item) => [
                                    timeline
                                        ? item?.payload?.segmentDetails?.[name] || `${formatValue(value)} minutes`
                                        : formatValue(value),
                                    timeline ? item?.payload?.segmentLabels?.[name] || name : name
                                ]}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid var(--chart-border)',
                                    backgroundColor: 'var(--chart-tooltip)',
                                    color: 'var(--chart-text)'
                                }}
                            />
                            {!timeline && <Legend iconType="circle" />}
                            {timeline ? timelineKeys.map((key, index) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    stackId="timeline"
                                    fill={defaultColors[index % defaultColors.length]}
                                    shape={<TimelineSegment />}
                                    isAnimationActive={false}
                                    legendType="none"
                                />
                            )) : chartData.series.map((item, index) => (
                                <Bar
                                    key={item.dataKey}
                                    dataKey={item.dataKey}
                                    name={item.name || item.dataKey}
                                    stackId="total"
                                    fill={item.color || defaultColors[index % defaultColors.length]}
                                    radius={index === chartData.series.length - 1 ? [4, 4, 0, 0] : 0}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {timeline && (
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {chartData.series.map((item) => (
                        <span key={item.dataKey} className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color || defaultColors[0] }}></span>
                            {item.name || item.dataKey}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
}
