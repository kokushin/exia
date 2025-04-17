import React from "react";
import { ScenarioChoice } from "@/types";

type ChoiceProps = {
  choices: ScenarioChoice[];
  onSelect: (choice: ScenarioChoice) => void;
};

export const Choice: React.FC<ChoiceProps> = ({ choices, onSelect }) => {
  return (
    <>
      {/* 透過黒背景 */}
      <div className="fixed inset-0 bg-black bg-opacity-80 z-20" />

      {/* 選択肢コンテナ */}
      <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-6 px-8 z-20">
        {choices.map((choice, index) => (
          <button
            key={index}
            className="w-full max-w-xl bg-black bg-opacity-80 text-white py-4 px-6 border border-gray-700 hover:bg-opacity-100 hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
            onClick={() => onSelect(choice)}
          >
            <span className="text-white text-lg font-bold text-center">{choice.text}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Choice;
