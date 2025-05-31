'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TerminologyTooltip } from '@/components/kinetics-lab/terminology-tooltip';
import { CATALYSTS, DEFAULT_SIMULATION_PARAMETERS } from '@/lib/chemistry';
import type { SimulationParameters } from '@/types';
import { Thermometer, Zap, Factory, Beaker, Sparkles, Play, PlusSquare } from 'lucide-react';

const formSchema = z.object({
  preExponentialFactor: z.coerce.number().positive('Must be positive'),
  activationEnergy: z.coerce.number().min(0, 'Cannot be negative'),
  temperature: z.coerce.number().gt(0, 'Must be above absolute zero (0 K)'),
  initialConcentration: z.coerce.number().min(0, 'Cannot be negative'),
  catalystId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface ParameterFormProps {
  onSubmit: (data: SimulationParameters) => void;
  onAddToGraph: (data: SimulationParameters) => void;
  initialValues?: Partial<SimulationParameters>;
}

export function ParameterForm({ onSubmit, onAddToGraph, initialValues = DEFAULT_SIMULATION_PARAMETERS }: ParameterFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preExponentialFactor: initialValues.preExponentialFactor,
      activationEnergy: initialValues.activationEnergy,
      temperature: initialValues.temperature,
      initialConcentration: initialValues.initialConcentration,
      catalystId: initialValues.catalystId,
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data as SimulationParameters);
  };
  
  const handleAddToGraphClick = () => {
    form.handleSubmit((data) => {
      onAddToGraph(data as SimulationParameters);
    })(); // Trigger validation and then call onAddToGraph
  };

  const inputFields = [
    { name: 'preExponentialFactor', label: 'Pre-exponential Factor (A)', unit: 's⁻¹', term: 'Pre-exponential Factor', icon: Zap },
    { name: 'activationEnergy', label: 'Activation Energy (Ea)', unit: 'kJ/mol', term: 'Activation Energy', icon: Thermometer },
    { name: 'temperature', label: 'Temperature (T)', unit: 'K', term: 'Temperature', icon: Factory },
    { name: 'initialConcentration', label: 'Initial Concentration ([C₀])', unit: 'mol/L', term: 'Initial Concentration', icon: Beaker },
  ] as const;


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-accent" />
          Simulation Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {inputFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium">
                      <field.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <TerminologyTooltip term={field.term}>
                        <span>{field.label} <span className="text-xs text-muted-foreground">({field.unit})</span></span>
                      </TerminologyTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...formField} placeholder={`Enter ${field.label.toLowerCase()}`} className="text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="catalystId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium">
                     <Sparkles className="mr-2 h-4 w-4 text-muted-foreground" />
                    <TerminologyTooltip term="Catalyst">
                       <span>Catalyst</span>
                    </TerminologyTooltip>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select a catalyst" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATALYSTS.map((catalyst) => (
                        <SelectItem key={catalyst.id} value={catalyst.id} className="text-sm">
                          {catalyst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto flex-grow bg-primary hover:bg-primary/90 text-primary-foreground">
                <Play className="mr-2 h-5 w-5" />
                Run Simulation
              </Button>
              <Button type="button" onClick={handleAddToGraphClick} variant="outline" className="w-full sm:w-auto flex-grow border-accent text-accent hover:bg-accent/10">
                <PlusSquare className="mr-2 h-5 w-5" />
                Add to Graph
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
