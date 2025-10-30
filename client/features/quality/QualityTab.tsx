
import React from 'react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
// Fix: Import 'CartesianGrid' from 'recharts'.
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const completenessData = [
    { name: 'Populated', value: 78.5 },
    { name: 'Empty', value: 21.5 },
];
const COLORS_COMPLETENESS = ['#3B82F6', '#E5E7EB'];

const validationStatusData = [
    { name: 'Valid', value: 850 },
    { name: 'Catch-all', value: 98 },
    { name: 'Invalid', value: 29 },
    { name: 'Risky', value: 10 },
];
const COLORS_VALIDATION = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const confidenceScoreData = [
    { range: '80-100', count: 750 },
    { range: '60-80', count: 150 },
    { range: '40-60', count: 60 },
    { range: '20-40', count: 20 },
    { range: '0-20', count: 7 },
];

const fieldCompletenessData = [
    { name: 'Email', rate: 99 }, { name: 'First Name', rate: 95 },
    { name: 'Company', rate: 92 }, { name: 'Job Title', rate: 89 },
    { name: 'LinkedIn', rate: 78 }, { name: 'Phone', rate: 65 },
    { name: 'Skills', rate: 45 }, { name: 'Revenue', rate: 35 },
].sort((a,b) => b.rate - a.rate);

const QualityTab = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Data Quality</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardTitle>Completeness Score</CardTitle>
                    <div className="h-48 flex items-center justify-center">
                        <div className="relative w-36 h-36">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path className="text-slate-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-blue-500" strokeWidth="3" strokeDasharray={`${completenessData[0].value}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-slate-800">{completenessData[0].value}%</span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <CardTitle>Accuracy Rate</CardTitle>
                    <div className="h-48 flex flex-col items-center justify-center">
                         <p className="text-5xl font-bold text-green-500">92.3%</p>
                         <p className="text-sm font-semibold text-green-500 mt-2">↑ 2.1% vs last week</p>
                    </div>
                </Card>
                <Card>
                    <CardTitle>Validation Status</CardTitle>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={validationStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#8884d8" paddingAngle={5} dataKey="value">
                                    {validationStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_VALIDATION[index % COLORS_VALIDATION.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" iconSize={8} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Field-Level Completeness</CardTitle>
                    </CardHeader>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fieldCompletenessData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} unit="%" />
                                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="rate" fill="#3B82F6" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Confidence Score Distribution</CardTitle>
                    </CardHeader>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={confidenceScoreData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" name="Records" fill="#8B5CF6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default QualityTab;