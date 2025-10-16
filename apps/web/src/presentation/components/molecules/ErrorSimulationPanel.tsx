'use client';

import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';
import { Settings, Play, Pause, RotateCcw } from 'lucide-react';

export interface ErrorSimulationPanelProps {
  onSetErrorSimulation: (enabled: boolean, errorRate: number) => void;
  onSetErrorTypes: (types: ('timeout' | 'server' | 'network')[]) => void;
  className?: string;
}

export function ErrorSimulationPanel({
  onSetErrorSimulation,
  onSetErrorTypes,
  className = ''
}: ErrorSimulationPanelProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [errorRate, setErrorRate] = useState(0.1);
  const [selectedErrorTypes, setSelectedErrorTypes] = useState<('timeout' | 'server' | 'network')[]>(['server']);

  const handleToggle = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    onSetErrorSimulation(newEnabled, errorRate);
  };

  const handleErrorRateChange = (rate: number) => {
    setErrorRate(rate);
    if (isEnabled) {
      onSetErrorSimulation(true, rate);
    }
  };

  const handleErrorTypeToggle = (type: 'timeout' | 'server' | 'network') => {
    const newTypes = selectedErrorTypes.includes(type)
      ? selectedErrorTypes.filter(t => t !== type)
      : [...selectedErrorTypes, type];
    
    setSelectedErrorTypes(newTypes);
    onSetErrorTypes(newTypes);
  };

  const handleReset = () => {
    setIsEnabled(false);
    setErrorRate(0.1);
    setSelectedErrorTypes(['server']);
    onSetErrorSimulation(false, 0.1);
    onSetErrorTypes(['server']);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg z-50 max-w-sm ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon icon={Settings} size="sm" className="text-primary" />
        <h3 className="font-semibold text-foreground">Error Simulation</h3>
        <Badge variant={isEnabled ? 'destructive' : 'secondary'}>
          {isEnabled ? 'ON' : 'OFF'}
        </Badge>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          onClick={handleToggle}
          variant={isEnabled ? 'destructive' : 'default'}
          size="sm"
          className="gap-2"
        >
          <Icon icon={isEnabled ? Pause : Play} size="sm" />
          {isEnabled ? 'Disable' : 'Enable'}
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Icon icon={RotateCcw} size="sm" />
          Reset
        </Button>
      </div>

      {/* Error Rate */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-foreground mb-1">
          Error Rate: {Math.round(errorRate * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={errorRate}
          onChange={(e) => handleErrorRateChange(parseFloat(e.target.value))}
          className="w-full"
          disabled={!isEnabled}
        />
      </div>

      {/* Error Types */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-foreground mb-2">
          Error Types:
        </label>
        <div className="flex flex-wrap gap-2">
          {(['server', 'timeout', 'network'] as const).map((type) => (
            <Button
              key={type}
              onClick={() => handleErrorTypeToggle(type)}
              variant={selectedErrorTypes.includes(type) ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Info */}
      <p className="text-xs text-secondary">
        This panel only appears in development mode.
      </p>
    </div>
  );
}
