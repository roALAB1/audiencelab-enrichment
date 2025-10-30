
import React from 'react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const volumeTrendData = [
  { name: 'Oct 1', Success: 220, Partial: 30, Failed: 15 },
  { name: 'Oct 5', Success: 280, Partial: 40, Failed: 20 },
  { name: 'Oct 10', Success: 200, Partial: 20, Failed: 10 },
  { name: 'Oct 15', Success: 278, Partial: 35, Failed: 18 },
  { name: 'Oct 20', Success: 189, Partial: 25, Failed: 12 },
  { name: 'Oct 25', Success: 239, Partial: 38, Failed: 22 },
  { name: 'Oct 30', Success: 349, Partial: 45, Failed: 25 },
];

const matchRateData = [
  { name: 'Email', rate: 95 },
  { name: 'Company', rate: 90 },
  { name: 'LinkedIn', rate: 75 },
  { name: 'Phone', rate: 60 },
  { name: 'Skills', rate: 45 },
];

const seniorityData = [
    { name: 'C-Level', value: 120 }, { name: 'VP', value: 250 },
    { name: 'Director', value: 400 }, { name: 'Manager', value: 800 },
    { name: 'Senior', value: 1200 }, { name: 'Entry', value: 900 },
];
const COLORS_SENIORITY = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3B0764'];

const departmentData = [
    { name: 'Sales', value: 400 }, { name: 'Marketing', value: 300 },
    { name: 'Engineering', value: 240 }, { name: 'HR', value: 180 },
    { name: 'Operations', value: 120 }, { name: 'Other', value: 90 },
];
const COLORS_DEPARTMENT = ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554'];


const AnalyticsTab = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Enrichment Volume Trend (Last 30 Days)</CardTitle>
                </CardHeader>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={volumeTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="Success" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="Partial" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="Failed" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Match Rate by Data Type</CardTitle>
                    </CardHeader>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={matchRateData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} unit="%" />
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip />
                                <Bar dataKey="rate" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Enriched Companies</CardTitle>
                    </CardHeader>
                    <div className="overflow-auto h-80">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="p-2">Company</th><th className="p-2">Records</th><th className="p-2">Match Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Acme Corp', records: 1250, rate: '92%' },
                                    { name: 'Globex Inc.', records: 980, rate: '88%' },
                                    { name: 'Stark Industries', records: 750, rate: '95%' },
                                    { name: 'Wayne Enterprises', records: 680, rate: '91%' },
                                    { name: 'Cyberdyne Systems', records: 550, rate: '85%' },
                                    { name: 'Hooli', records: 430, rate: '89%' },
                                ].map(c => (
                                    <tr key={c.name} className="border-t border-slate-100">
                                        <td className="p-2 font-medium">{c.name}</td>
                                        <td className="p-2">{c.records}</td>
                                        <td className="p-2">{c.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Seniority Distribution</CardTitle>
                    </CardHeader>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={seniorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {seniorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_SENIORITY[index % COLORS_SENIORITY.length]} />
                                ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Department Distribution</CardTitle>
                    </CardHeader>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                                {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_DEPARTMENT[index % COLORS_DEPARTMENT.length]} />
                                ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsTab;
