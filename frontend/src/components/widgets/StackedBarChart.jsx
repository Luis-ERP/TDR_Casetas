import { ResponsiveBar } from '@nivo/bar';

export default function StackedBarChart({
        data, 
        keys, 
        indexBy,
        xLabel='',
        yLabel='',
        yAxisEnabled=true,
        labelsEnabled=true, 
        colors="#163253",
        label=()=>{},
        onClick=()=>{},
    }) {
    return (
        <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 10, right: 130, bottom: 50, left: 10 }}
        padding={0.15}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={colors}
        borderRadius={3}
        borderColor={{ theme: 'labels.text.fill' }}
        valueFormat=" >-$,"
        axisTop={null}
        axisRight={null}
        onClick={onClick}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: xLabel,
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={yAxisEnabled ? {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: yLabel,
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 100
        } : null}
        enableLabel={labelsEnabled}
        label={label}
        labelSkipWidth={2}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                tickRotation: 90,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
        groupMode="grouped"
        />
    );
}
