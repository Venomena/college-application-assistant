import React from 'react';

interface PredictionResultProps {
  result: string;
}

const parseFormattedText = (text: string) => {
  // Split the text into lines
  const lines = text.split('\n');

  return lines.map((line, index) => {
    // Replace section headers
    if (line.startsWith('##') && line.endsWith('##')) {
      return <h2 key={index} className="text-xl font-bold mb-2">{line.slice(2, -2).trim()}</h2>;
    }

    // Replace bold text
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace italic text
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Replace list items
    if (line.startsWith('- ')) {
      return <li key={index} dangerouslySetInnerHTML={{ __html: line.slice(2).trim() }} />;
    }

    return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
  });
};

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">Prediction Result</h2>
      <div className="text-gray-700 mt-2 space-y-2">
        <ul className="list-disc list-inside">
          {parseFormattedText(result)}
        </ul>
      </div>
    </div>
  );
};

export default PredictionResult;
