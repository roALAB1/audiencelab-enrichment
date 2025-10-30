
import React, { useContext } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import { CreditSystemContext } from '../../App';
import { ActivityLog } from '../../types';
import { CheckCircle, AlertTriangle } from '../../components/ui/icons';

const kpiData = [
    { title: "Total Enrichments", value: "12,450", trend: "+12%", subtitle: "This month" },
    { title: "Match Rate", value: "85.4%", trend: " ", subtitle: "Average match rate" },
    { title: "Data Quality Score", value: "92/100", trend: "", subtitle: "Overall quality" },
];

const enrichmentTrendData = [
    { name: 'Day 1', Total: 400, Successful: 340, Failed: 60 },
    { name: 'Day 5', Total: 300, Successful: 255, Failed: 45 },
    { name: 'Day 10', Total: 500, Successful: 425, Failed: 75 },
    { name: 'Day 15', Total: 470, Successful: 400, Failed: 70 },
    { name: 'Day 20', Total: 580, Successful: 493, Failed: 87 },
    { name: 'Day 25', Total: 690, Successful: 586, Failed: 104 },
    { name: 'Day 30', Total: 800, Successful: 720, Failed: 80 },
];

const fieldCompletionData = [
    { name: 'Email', completion: 99 }, { name: 'First Name', completion: 95 },
    { name: 'Last Name', completion: 94 }, { name: 'Job Title', completion: 89 },
    { name: 'Company', completion: 92 }, { name: 'Phone', completion: 65 },
    { name: 'LinkedIn URL', completion: 78 }, { name: 'Skills', completion: 45 },
].sort((a, b) => b.completion - a.completion);

const recentActivityData: ActivityLog[] = [
    { id: '1', timestamp: '2024-10-29 15:45', user: 'john.doe@example.com', type: 'Enrichment', source: 'leads_october.csv', records: 987, matchRate: 87.1, creditsUsed: 5160, status: 'Success', duration: '1m 52s' },
    { id: '2', timestamp: '2024-10-29 11:20', user: 'jane.smith@example.com', type: 'Enrichment', source: 'webinar_attendees.csv', records: 250, matchRate: 92.4, creditsUsed: 1800, status: 'Success', duration: '32s' },
    { id: '3', timestamp: '2024-10-28 18:05', user: 'admin@example.com', type: 'Export', source: 'Audience: High-Value', records: 456, matchRate: 0, creditsUsed: 0, status: 'Success', duration: '5s' },
    { id: '4', timestamp: '2024-10-28 14:30', user: 'john.doe@example.com', type: 'Enrichment', source: 'test_list.csv', records: 15, matchRate: 60.0, creditsUsed: 0, status: 'Failed', duration: '12s' },
];

const OverviewTab = () => {
    const creditSystem = useContext(CreditSystemContext);
    if (!creditSystem) return null;
    const { credits } = creditSystem;
    const creditPercentage = (credits.used_this_month / credits.plan_limit) * 100;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map(item => (
                    <Card key={item.title}>
                        <h4 className="text-sm font-medium text-slate-500">{item.title}</h4>
                        <div className="flex items-baseline justify-between mt-2">
                            <p className="text-3xl font-bold text-slate-800">{item.value}</p>
                            <p className="text-sm font-semibold text-green-500">{item.trend}</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
                    </Card>
                ))}
                <Card>
                    <h4 className="text-sm font-medium text-slate-500">Credits Used</h4>
                    <div className="flex items-baseline justify-between mt-2">
                        <p className="text-3xl font-bold text-slate-800">{credits.used_this_month.toLocaleString()}</p>
                    </div>
                     <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${creditPercentage}%` }}></div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Enrichment Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={enrichmentTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                                <Legend iconSize={10} />
                                <Line type="monotone" dataKey="Successful" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="Failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="Total" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Field Completion</CardTitle>
                    </CardHeader>
                     <div className="h-80 overflow-y-auto pr-2">
                        <div className="space-y-3">
                        {fieldCompletionData.map(field => (
                            <div key={field.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm text-slate-600">{field.name}</p>
                                    <p className="text-sm font-semibold text-slate-800">{field.completion}%</p>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${field.completion > 80 ? 'bg-green-500' : field.completion > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                        style={{ width: `${field.completion}%` }}>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </Card>
            </div>
            
            <Card>
                 <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Records</th>
                                <th scope="col" className="px-6 py-3">Match Rate</th>
                                <th scope="col" className="px-6 py-3">Credits Used</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivityData.map(log => (
                                <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4">{log.timestamp}</td>
                                    <td className="px-6 py-4">{log.user}</td>
                                    <td className="px-6 py-4">{log.records}</td>
                                    <td className="px-6 py-4">{log.matchRate}%</td>
                                    <td className="px-6 py-4">{log.creditsUsed.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default OverviewTab;
