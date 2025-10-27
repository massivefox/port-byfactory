import React from 'react';
import Tooltips from '@mui/material/Tooltip';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';

export default function LinedChart(chartData) {
  return (
    <div>
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

      <LineChart
        width={chartData.width}
        height={chartData.height}
        data={chartData.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        style={{ align: 'center' }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={chartData.xDataKey} />
        <YAxis type="number" domain={chartData.domain} />
        <Tooltip />
        <Legend />

        {chartData.yDataKey2 ? (
          <>
            <Line
              type="monotone"
              dataKey={chartData.yDataKey}
              stroke="#8884d8"
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey={chartData.yDataKey2}
              stroke="#8884d8"
              activeDot={{ r: 7 }}
            />
          </>
        ) : (
          <Line
            type="monotone"
            dataKey={chartData.yDataKey}
            stroke="#8884d8"
            activeDot={{ r: 7 }}
          >
            <LabelList dataKey={chartData.yDataKey} position="top" />
          </Line>
        )}
      </LineChart>
    </div>
  );
}
