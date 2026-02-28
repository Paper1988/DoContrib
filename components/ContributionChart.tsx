'use client'

import { Card, CardContent, Typography } from '@mui/material'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

interface ContributionData {
    userId: string
    name: string
    wordsAdded: number
    wordsDeleted: number
    editSessions: number
}

interface ContributionChartProps {
    data: ContributionData[]
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']

export default function ContributionChart({ data }: ContributionChartProps) {
    const pieData = data.map((item, index) => ({
        name: item.name,
        value: item.wordsAdded,
        color: COLORS[index % COLORS.length],
    }))

    const barData = data.map((item) => ({
        name: item.name.split(' ')[0], // 只取名字第一部分
        新增: item.wordsAdded,
        刪除: item.wordsDeleted,
        編輯次數: item.editSessions,
    }))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 貢獻度圓餅圖 */}
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="white">
                        貢獻度分佈
                    </Typography>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent! * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 詳細統計長條圖 */}
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="white">
                        詳細統計
                    </Typography>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={barData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.2)"
                                />
                                <XAxis dataKey="name" stroke="white" />
                                <YAxis stroke="white" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(31, 41, 55, 0.9)',
                                        border: 'none',
                                        color: 'white',
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="新增" fill="#82ca9d" />
                                <Bar dataKey="刪除" fill="#ff7c7c" />
                                <Bar dataKey="編輯次數" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
