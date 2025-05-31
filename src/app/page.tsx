'use client';

import { useState } from 'react';
import { ParameterForm } from '@/components/kinetics-lab/parameter-form';
import { ResultsDisplay } from '@/components/kinetics-lab/results-display';
import { RateChart } from '@/components/kinetics-lab/rate-chart';
import type { SimulationParameters, SimulationResult, ChartDataset, ChartDataPoint, Catalyst } from '@/types';
import { 
  calculateRateConstant, 
  calculateReactionRate, 
  calculateEffectiveActivationEnergy,
  DEFAULT_SIMULATION_PARAMETERS,
  generateTemperaturePoints,
  getCatalystById
} from '@/lib/chemistry';
import { useToast } from "@/hooks/use-toast";
import { Briefcase } from 'lucide-react'; // Using Briefcase for KineticsLab name

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function KineticsLabPage() {
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [graphDatasets, setGraphDatasets] = useState<ChartDataset[]>([]);
  const [nextDatasetId, setNextDatasetId] = useState(1);
  const { toast } = useToast();

  const temperaturePoints = generateTemperaturePoints();

  const handleSimulate = (params: SimulationParameters) => {
    const effectiveEaKjMol = calculateEffectiveActivationEnergy(params.activationEnergy, params.catalystId);
    const k = calculateRateConstant(params.preExponentialFactor, effectiveEaKjMol, params.temperature);
    const rate = calculateReactionRate(k, params.initialConcentration);
    
    const result: SimulationResult = {
      rateConstant: k,
      reactionRate: rate,
      effectiveActivationEnergy: effectiveEaKjMol,
    };
    setCurrentResult(result);

    toast({
      title: "Simulation Complete",
      description: `Rate constant (k): ${k.toExponential(3)}, Reaction rate: ${rate.toExponential(3)}`,
    });
  };

  const handleAddToGraph = (params: SimulationParameters) => {
    if (graphDatasets.length >= 5) {
       toast({
        title: "Graph Limit Reached",
        description: "Maximum of 5 datasets can be displayed on the graph.",
        variant: "destructive",
      });
      return;
    }

    const effectiveEaKjMol = calculateEffectiveActivationEnergy(params.activationEnergy, params.catalystId);
    
    const chartData: ChartDataPoint[] = temperaturePoints.map(temp => {
      const k = calculateRateConstant(params.preExponentialFactor, effectiveEaKjMol, temp);
      const rate = calculateReactionRate(k, params.initialConcentration);
      return { temperature: temp, rate };
    });

    const catalyst = getCatalystById(params.catalystId);
    const datasetName = `Set ${nextDatasetId} (Ea: ${effectiveEaKjMol.toFixed(1)} kJ/mol${catalyst && catalyst.id !== 'none' ? ', Cat: ' + catalyst.name.split(' ')[1] : ''})`;

    const newDataset: ChartDataset = {
      id: `dataset-${nextDatasetId}`,
      name: datasetName,
      data: chartData,
      color: CHART_COLORS[(nextDatasetId -1) % CHART_COLORS.length],
      params: { ...params, effectiveActivationEnergy: effectiveEaKjMol },
    };

    setGraphDatasets(prevDatasets => [...prevDatasets, newDataset]);
    setNextDatasetId(prevId => prevId + 1);

    toast({
      title: "Dataset Added to Graph",
      description: `${datasetName} is now visualized.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center space-x-3">
          <Briefcase className="h-10 w-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            KineticsLab
          </h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Explore chemical reaction kinetics using the Arrhenius equation.
        </p>
      </header>

      <main className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <aside className="lg:w-2/5 xl:w-1/3 space-y-6 md:space-y-8">
          <ParameterForm 
            onSubmit={handleSimulate} 
            onAddToGraph={handleAddToGraph}
            initialValues={DEFAULT_SIMULATION_PARAMETERS}
          />
        </aside>
        
        <section className="lg:w-3/5 xl:w-2/3 space-y-6 md:space-y-8 flex flex-col">
          <ResultsDisplay result={currentResult} />
          <div className="flex-grow">
            <RateChart datasets={graphDatasets} temperaturePoints={temperaturePoints} />
          </div>
        </section>
      </main>
    </div>
  );
}
