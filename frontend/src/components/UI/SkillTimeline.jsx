import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const SkillTimeline = () => {
  const [selectedYear, setSelectedYear] = useState('2025-26');

  const dataByYear = {
    '2025-26': [
      { month: 'Jan', value: 120, shortMonth: 'Jan' },
      { month: 'Feb', value: 100, shortMonth: 'Feb' },
      { month: 'Mar', value: 370, shortMonth: 'Mar' },
      { month: 'Apr', value: 80, shortMonth: 'Apr' },
      { month: 'May', value: 50, shortMonth: 'May' },
      { month: 'Jun', value: 200, shortMonth: 'Jun' },
      { month: 'Jul', value: 500, shortMonth: 'Jul' },
      { month: 'Aug', value: 470, shortMonth: 'Aug' },
      { month: 'Sep', value: 100, shortMonth: 'Sep' },
      { month: 'Oct', value: 350, shortMonth: 'Oct' },
      { month: 'Nov', value: 420, shortMonth: 'Nov' },
      { month: 'Dec', value: 400, shortMonth: 'Dec' }
    ],
    '2024-25': [
      { month: 'Jan', value: 80, shortMonth: 'Jan' },
      { month: 'Feb', value: 150, shortMonth: 'Feb' },
      { month: 'Mar', value: 280, shortMonth: 'Mar' },
      { month: 'Apr', value: 320, shortMonth: 'Apr' },
      { month: 'May', value: 180, shortMonth: 'May' },
      { month: 'Jun', value: 250, shortMonth: 'Jun' },
      { month: 'Jul', value: 380, shortMonth: 'Jul' },
      { month: 'Aug', value: 450, shortMonth: 'Aug' },
      { month: 'Sep', value: 300, shortMonth: 'Sep' },
      { month: 'Oct', value: 220, shortMonth: 'Oct' },
      { month: 'Nov', value: 350, shortMonth: 'Nov' },
      { month: 'Dec', value: 280, shortMonth: 'Dec' }
    ],
    '2023-24': [
      { month: 'Jan', value: 60, shortMonth: 'Jan' },
      { month: 'Feb', value: 90, shortMonth: 'Feb' },
      { month: 'Mar', value: 150, shortMonth: 'Mar' },
      { month: 'Apr', value: 200, shortMonth: 'Apr' },
      { month: 'May', value: 180, shortMonth: 'May' },
      { month: 'Jun', value: 220, shortMonth: 'Jun' },
      { month: 'Jul', value: 300, shortMonth: 'Jul' },
      { month: 'Aug', value: 280, shortMonth: 'Aug' },
      { month: 'Sep', value: 250, shortMonth: 'Sep' },
      { month: 'Oct', value: 320, shortMonth: 'Oct' },
      { month: 'Nov', value: 290, shortMonth: 'Nov' },
      { month: 'Dec', value: 340, shortMonth: 'Dec' }
    ]
  };

  const highlightConfig = {
    '2025-26': { month: 'Nov', color: '#f97316' },
    '2024-25': { month: 'Aug', color: '#ef4444' },
    '2023-24': { month: 'Dec', color: '#8b5cf6' }
  };

  const currentData = dataByYear[selectedYear];
  const currentHighlight = highlightConfig[selectedYear];

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.shortMonth === currentHighlight.month) {
      return (
        <>
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={380}
            stroke={currentHighlight.color}
            strokeWidth={2}
            strokeDasharray="4,4"
          />
          <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={currentHighlight.color}
            stroke="#fff"
            strokeWidth={2}
          />
        </>
      );
    }
    return null;
  };

  const maxValue = Math.max(...currentData.map(item => item.value));
  const yAxisMax = Math.ceil(maxValue / 100) * 100;

  return (
    <div className="bg-white rounded-[10px] shadow-sm px-4 pt-5 pb-6 mt-5 md:mt-0 md:ml-[-2%] w-[100vw] md:w-[34vw] font-manrope mx-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[20px] font-bold text-font-color">Skill Timeline</h2>
        <select 
          value={selectedYear}
          onChange={handleYearChange}
          className="bg-[#f3f3f3] border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="2025-26">2025-26</option>
          <option value="2024-25">2024-25</option>
          <option value="2023-24">2023-24</option>
        </select>
      </div>

      <div className="h-[25vh] md:w-full w-[100vw]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5eead4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#5eead4" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="shortMonth"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            
            <YAxis 
              domain={[0, yAxisMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#skillGradient)"
              dot={false}
              animationDuration={800}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="transparent"
              fill="transparent"
              dot={<CustomDot />}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        Highlighted: {currentHighlight.month} ({selectedYear})
      </div>
    </div>
  );
};

export default SkillTimeline;