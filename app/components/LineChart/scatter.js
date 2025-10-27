import React from 'react';
import Tooltips from '@mui/material/Tooltip';
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

export default function ScatterCharts(chartData) {
  console.log('asdsads');
  return (
    <>
      <div className="Chart Data" style={{ background: '#242424' }}>
        <h2 style={{ margin: '20px', textAlign: 'left' }}>
          {chartData.title}
          <Tooltips
            title={
              <div style={{ whiteSpace: 'pre-line' }}>
                {chartData.tooltip || ''}
              </div>
            }
            arrow
            placement="right-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
              style={{ marginLeft: '6px' }}
            >
              <rect width="256" height="256" fill="none" />
              <circle
                cx="128"
                cy="128"
                r="96"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
              <polyline
                points="120 124 128 124 128 176 136 176"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
              <circle cx="126" cy="84" r="16" />
            </svg>
          </Tooltips>
        </h2>
        <ComposedChart
          width={1000}
          height={400}
          margin={{
            top: 20,
            right: 80,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <Tooltip />
          <Legend />

          <XAxis dataKey="date" allowDuplicatedCategory={false} />
          <YAxis
            unit="KLAY"
            type="number"
            label={{ value: 'Volume', position: 'top' }}
          />
          <ZAxis dataKey="date" name="date" />
          <Scatter name="date" dataKey="y" fill="red" data={chartData.data} />
          <Line
            dataKey="y"
            data={chartData.y}
            stroke="blue"
            dot={false}
            activeDot={false}
            legendType="none"
            name="lower"
          />
        </ComposedChart>
      </div>
    </>
  );
}
