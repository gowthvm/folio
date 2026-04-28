'use client'

import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar 
} from 'recharts'

interface LazyChartsProps {
  progressData: { name: string; data: { date: string; progress: number }[] }[]
  categoryData: { name: string; value: number }[]
}

export function LazyCharts({ progressData, categoryData }: LazyChartsProps) {
  return (
    <>
      {progressData.length > 0 && (
        <div className="p-6 bg-paper-50 dark:bg-wiki-darker border border-ink-200/10 dark:border-wiki-border">
          <h2 className="font-serif text-lg font-semibold mb-4">Progress Over Time</h2>
          
          <ResponsiveContainer width="100%" height={300} minWidth={200}>
            <RechartsLineChart data={progressData[0]?.data || []}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fontFamily: 'monospace' }}
                stroke="#9CA3AF"
                tickFormatter={(value) => value.length > 10 ? value.slice(5) : value}
              />
              <YAxis 
                tick={{ fontSize: 10, fontFamily: 'monospace' }}
                stroke="#9CA3AF"
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#374151"
                strokeWidth={2}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      )}

      {categoryData.length > 0 && (
        <div className="p-6 bg-paper-50 dark:bg-wiki-darker border border-ink-200/10 dark:border-wiki-border">
          <h2 className="font-serif text-lg font-semibold mb-4">Time by Category</h2>
          
          <ResponsiveContainer width="100%" height={200} minWidth={150}>
            <RechartsBarChart data={categoryData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#9CA3AF" />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 10, fontFamily: 'monospace' }} 
                stroke="#9CA3AF"
                width={60}
                tickFormatter={(value) => value.length > 8 ? value.slice(0, 8) + '...' : value}
              />
              <Tooltip
                contentStyle={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="#374151" radius={[0, 4, 4, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  )
}

export { RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RechartsBarChart, Bar }