import React from 'react';
import Tooltips from '@mui/material/Tooltip';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function BarAndLine(data) {
  return (
    <div className="Chart Data" style={{ background: '#242424' }}>
      <h2 style={{ margin: '20px' }}>
        {data.title}
        <Tooltips
          title={
            <div style={{ whiteSpace: 'pre-line' }}>{data.tooltip || ''}</div>
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
        width={1200}
        height={400}
        data={data.data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 50,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <YAxis
          yAxisId="left"
          dataKey="volume"
          type="number"
          orientation="left"
          domain={[0, 2000]}
          label={{ value: 'volume', angle: 270, position: 'insideLeft' }}
        />
        <Bar yAxisId="left" dataKey="volume" barSize={20} fill="#413ea0" />
        <XAxis dataKey="date" scale="band" />
        <Tooltip />
        <Legend />
        <Line yAxisId="right" type="monotone" dataKey="price" stroke="green" />
        <YAxis
          yAxisId="right"
          type="number"
          dataKey="price"
          orientation="right"
          domain={[0, 2000]}
          label={{ value: 'price', angle: 90, position: 'insideRight' }}
        />
      </ComposedChart>
    </div>
  );
}
