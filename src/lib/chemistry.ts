import type { Catalyst, SimulationParameters } from '@/types';

export const GAS_CONSTANT_J_MOL_K = 8.314; // J/(mol·K)

export const CATALYSTS: Catalyst[] = [
  { id: 'none', name: 'No Catalyst', activationEnergyReductionKjMol: 0 },
  { id: 'catalystA', name: 'Catalyst A (-20 kJ/mol Ea)', activationEnergyReductionKjMol: 20 },
  { id: 'catalystB', name: 'Catalyst B (-40 kJ/mol Ea)', activationEnergyReductionKjMol: 40 },
  { id: 'catalystC', name: 'Catalyst C (-60 kJ/mol Ea)', activationEnergyReductionKjMol: 60 },
];

export function getCatalystById(id: string): Catalyst | undefined {
  return CATALYSTS.find(c => c.id === id);
}

export function calculateEffectiveActivationEnergy(baseEaKjMol: number, catalystId: string): number {
  const catalyst = getCatalystById(catalystId);
  const reduction = catalyst ? catalyst.activationEnergyReductionKjMol : 0;
  return Math.max(0, baseEaKjMol - reduction); // Ea cannot be negative
}

export function calculateRateConstant(
  preExponentialFactor: number,
  activationEnergyKjMol: number, // Ea in kJ/mol
  temperature: number // T in Kelvin
): number {
  if (temperature <= 0) return 0; // Avoid division by zero or nonsensical results
  const activationEnergyJMol = activationEnergyKjMol * 1000; // Convert kJ/mol to J/mol
  const exponent = -activationEnergyJMol / (GAS_CONSTANT_J_MOL_K * temperature);
  return preExponentialFactor * Math.exp(exponent);
}

export function calculateReactionRate(
  rateConstant: number,
  initialConcentration: number
): number {
  // Assuming a first-order reaction for simplicity: rate = k * [Concentration]
  return rateConstant * initialConcentration;
}

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  preExponentialFactor: 1e10, // s^-1 (typical for first order)
  activationEnergy: 75, // kJ/mol
  temperature: 298, // K (room temperature)
  initialConcentration: 1, // mol/L
  catalystId: 'none',
};

export const GRAPH_TEMPERATURE_RANGE = {
  min: 250, // K
  max: 450, // K
  step: 10, // K
};

export function generateTemperaturePoints(): number[] {
  const points: number[] = [];
  for (let t = GRAPH_TEMPERATURE_RANGE.min; t <= GRAPH_TEMPERATURE_RANGE.max; t += GRAPH_TEMPERATURE_RANGE.step) {
    points.push(t);
  }
  return points;
}
