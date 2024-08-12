import React from "react";

const tips = `
1. Upload you CV/application 📃
2. Input your test scores and dream university 🎓
3. Chat with the AI 🤖
`;

const Tips: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-yellow-100 rounded-md">
      <h2 className="text-xl font-bold text-yellow-800">Tips for Using the Tool</h2>
      <div className="text-yellow-600 mt-2">
        {tips.split('\n').map((tip, index) => (
          <p key={index}>{tip}</p>
        ))}
      </div>
    </div>
  );
};

export default Tips;
