
'use client';

import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Line } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartDataset, ChartDataPoint } from '@/types';
import { FileSpreadsheet } from 'lucide-react';

interface KineticsDataChartProps {
  datasets: ChartDataset[];
  temperaturePoints: number[];
  valueToPlot: 'rate' | 'k';
  chartTitle: string;
  chartDescription: string;
  yAxisLabel: string;
}

interface TransformedChartData {
  temperature: number;
  [key: string]: number; // datasetId: value (rate or k)
}

export function KineticsDataChart({ 
  datasets, 
  temperaturePoints, 
  valueToPlot,
  chartTitle,
  chartDescription,
  yAxisLabel 
}: KineticsDataChartProps) {
  if (!datasets.length) {
    return (
      <Card className="shadow-lg flex flex-col min-h-[400px] md:min-h-[500px]">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <FileSpreadsheet className="mr-2 h-6 w-6 text-accent" />
            {chartTitle}
          </CardTitle>
          <CardDescription>Add simulation results to the graph to visualize data.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">No data to display. Add datasets from simulations.</p>
        </CardContent>
      </Card>
    );
  }

  const transformedData: TransformedChartData[] = temperaturePoints.map(temp => {
    const point: TransformedChartData = { temperature: temp };
    datasets.forEach(ds => {
      const dataPoint = ds.data.find(d => d.temperature === temp);
      if (dataPoint) {
        point[ds.id] = valueToPlot === 'rate' ? dataPoint.rate : dataPoint.k;
      }
    });
    return point;
  });

  const chartConfig = datasets.reduce((config, ds) => {
    config[ds.id] = {
      label: ds.name,
      color: ds.color,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="shadow-lg flex flex-col h-full min-h-[400px] md:min-h-[500px]">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
           <FileSpreadsheet className="mr-2 h-6 w-6 text-accent" />
           {chartTitle}
        </CardTitle>
         <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-6 pr-0">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={transformedData}
              margin={{
                top: 5,
                right: 30,
                left: 20, // Adjusted for potentially longer y-axis labels
                bottom: 25, // Adjusted for x-axis label
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="temperature"
                type="number"
                domain={['dataMin', 'dataMax']}
                label={{ value: 'Temperature (K)', position: 'insideBottom', dy:15, fill: 'hsl(var(--foreground))' }}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
              />
              <YAxis
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', dx: -5, fill: 'hsl(var(--foreground))' }}
                tickFormatter={(value) => value.toExponential(1)}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                stroke="hsl(var(--border))"
              />
              <RechartsTooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                formatter={(value: number, name: string) => {
                   const configEntry = chartConfig[name];
                   return [value.toExponential(3), configEntry ? configEntry.label : name];
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value, entry) => <span style={{ color: entry.color }}>{chartConfig[value]?.label || value}</span> } />
              {datasets.map((ds) => (
                <Line
                  key={ds.id}
                  type="monotone"
                  dataKey={ds.id}
                  stroke={ds.color}
                  strokeWidth={2}
                  dot={false}
                  name={ds.name}
                  animationDuration={500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Ensure the filename is kinetics-data-chart.tsx if it's renamed.
// For this operation, assuming the original file name is still rate-chart.tsx for the diff tool.
// If you intend to rename, please provide the new path for `rate-chart.tsx`.
// For now, modifying in place.
