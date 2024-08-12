import { useState, useEffect } from 'react';
import AcceptancePercentage from './AcceptancePercentage';
import PredictionResult from './PredictionResult';
import BeastModeTips from './BeastModeTips';
import CollapsibleWidget from './CollapsibleWidget';

interface StackedWidgetsProps {
  acceptancePercentage: string;
  result: string;
  beastModeTips: string;
  beastMode: boolean;
}

const StackedWidgets: React.FC<StackedWidgetsProps> = ({ acceptancePercentage, result, beastModeTips, beastMode }) => {
  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full mb-4">
        <AcceptancePercentage percentage={acceptancePercentage} />
      </div>
      <CollapsibleWidget title="Detailed Result">
        <PredictionResult result={result} />
      </CollapsibleWidget>
      {beastMode && (
        <CollapsibleWidget title="Beast Mode Tips">
          <BeastModeTips tips={beastModeTips} />
        </CollapsibleWidget>
      )}
    </div>
  );
};

export default StackedWidgets;