import { useEffect, useState } from 'react';
import { ResponsiveBoxPlot } from '@nivo/boxplot';

export default function DescriptiveChart({
    data,
    layout = 'horizontal',
}) {
    return (
        <ResponsiveBoxPlot
            data={data}
            layout={layout}
            margin={{ top: 10, right: 40, bottom: 60, left: 10 }}
            subGroupBy="subgroup"
            quantiles={[0.1, 0.25, 0.5, 0.75, 0.9]}
            innerPadding={10}
            enableGridX={true}
            axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 36,
                truncateTickAt: 0
            }}
            axisRight={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 0,
                truncateTickAt: 0
            }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'value',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
            }}
            colors={['#163355', '#fec52e']}
            borderRadius={2}
            borderWidth={2}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        '0.9'
                    ]
                ]
            }}
            medianWidth={2}
            medianColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        '0.9'
                    ]
                ]
            }}
            whiskerEndSize={0.75}
            whiskerColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            motionConfig="stiff"
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'row',
                    justify: false,
                    translateX: -22,
                    translateY: -50,
                    itemWidth: 60,
                    itemHeight: 20,
                    itemsSpacing: 3,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    symbolSize: 20,
                    symbolShape: 'square',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
        />
    )
}

