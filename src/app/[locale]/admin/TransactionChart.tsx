'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const sampleData = [
  { name: 'T2', doanhThu: 4000 },
  { name: 'T3', doanhThu: 3000 },
  { name: 'T4', doanhThu: 2000 },
  { name: 'T5', doanhThu: 2780 },
  { name: 'T6', doanhThu: 1890 },
  { name: 'T7', doanhThu: 2390 },
  { name: 'CN', doanhThu: 3490 },
];

interface Props {
  data?: { name: string; doanhThu: number }[];
}

export default function TransactionChart({ data }: Props) {
  const chartData = data && data.length > 0 ? data : sampleData;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip 
             contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
             itemStyle={{ color: '#00f2fe', fontWeight: 'bold' }}
             cursor={{ stroke: '#4facfe', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Area type="monotone" dataKey="doanhThu" name="Doanh Thu (K VNĐ)" stroke="#00f2fe" strokeWidth={3} fillOpacity={1} fill="url(#colorDoanhThu)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
