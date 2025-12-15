import React from "react";
import GaugeChart from "react-gauge-chart";

const CurrentCredits = () => {
  const grade = 8.966;
  const increase = 18;

  return (
    <div className="border border-slate-200 rounded-[10px] px-4 py-8 w-[100vw] md:w-auto">
    <div className="bg-white shadow-md rounded-[10px] p-4 w-full md:w-[15vw] font-manrope text-center">
      <h2 className="text-[18px] font-semibold mb-2">Current Credits</h2>
      
      {/* Gauge Chart */}
      <div className="flex justify-center mb-2">
        <GaugeChart
          id="gauge-chart"
          nrOfLevels={2}
          arcPadding={0}    
          colors={["#FF5F6D", "#F8EFE2"]}
          arcWidth={0.2}
          percent={grade / 18} // Scale 0-10 to 0-1
          hideText={true}
        />
      </div>

      {/* Grade */}
      <p className="text-font-color">Your Grade: <span className="font-bold text-xl">{grade}</span></p>
      
      {/* Increase Info */}
      <div className="bg-[#F8E6AC] bg-opacity-30 text-font-color text-sm mt-2 rounded-xl py-1 px-2 flex justify-center items-center gap-1">
        <span className="font-semibold text-[#FE7474]">{increase}%</span> increase from last sem.
        <button className="ml-1 text-gray-87 hover:text-black">×</button>
      </div>
    </div>
    </div>
  );
};

export default CurrentCredits;
