'use client';

import type { SimulationResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TerminologyTooltip } from '@/components/kinetics-lab/terminology-tooltip';
import { BarChart3, TrendingUp, CheckCircle } from 'lucide-react';

interface ResultsDisplayProps {
  result: SimulationResult | null;
}

const ResultItem: React.FC<{ icon: React.ElementType, label: string, term: string, value: string | number, unit: string }> = ({ icon: Icon, label, term, value, unit }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
    <div className="flex items-center">
      <Icon className="mr-3 h-5 w-5 text-accent" />
      <TerminologyTooltip term={term}>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </TerminologyTooltip>
    </div>
    {typeof value === 'number' ? (
      <span className="text-lg font-semibold text-primary">
        {value.toExponential(3)} <span className="text-xs text-muted-foreground">{unit}</span>
      </span>
    ) : (
      <span className="text-lg font-semibold text-primary">{value}</span>
    )}
  </div>
);


export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <BarChart3 className="mr-2 h-6 w-6 text-accent" />
          Simulation Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-2">
            <ResultItem
              icon={TrendingUp}
              label="Rate Constant (k)"
              term="Rate Constant"
              value={result.rateConstant}
              unit="s⁻¹"
            />
            <ResultItem
              icon={TrendingUp}
              label="Reaction Rate"
              term="Reaction Rate"
              value={result.reactionRate}
              unit="mol/L·s"
            />
             <ResultItem
              icon={CheckCircle}
              label="Effective Activation Energy (Ea)"
              term="Effective Activation Energy"
              value={result.effectiveActivationEnergy.toFixed(2)}
              unit="kJ/mol"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">Run a simulation to see results here.</p>
        )}
      </CardContent>
    </Card>
  );
}
