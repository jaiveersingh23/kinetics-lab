
export interface SimulationParameters {
  preExponentialFactor: number;
  activationEnergy: number; // kJ/mol
  temperature: number; // K
  initialConcentration: number; // mol/L
  catalystId: string;
}

export interface SimulationResult {
  rateConstant: number; // k
  reactionRate: number; // rate
  effectiveActivationEnergy: number; // kJ/mol
}

export interface Catalyst {
  id: string;
  name: string;
  activationEnergyReductionKjMol: number; // kJ/mol, positive value means reduction
}

export interface ChartDataPoint {
  temperature: number; // K
  rate: number; // mol/L·s
  k: number; // s⁻¹ (rate constant)
}

export interface ChartDataset {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color: string; // CSS color string for the line
  params: SimulationParameters & { effectiveActivationEnergy: number };
}
