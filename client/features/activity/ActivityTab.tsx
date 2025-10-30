
import React, { useState } from 'react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import { ActivityLog } from '../../types';
import { Search } from '../../components/ui/icons';

const mockActivityData: ActivityLog[] = [
    { id: '1', timestamp: '2024-10-29 15:45:12', user: 'john.doe@example.com', type: 'Enrichment', source: 'leads_october.csv', records: 987, matchRate: 87.1, creditsUsed: 5160, status: 'Success', duration: '1m 52s' },
    { id: '2', timestamp: '2024-10-29 11:20:34', user: 'jane.smith@example.com', type: 'Enrichment', source: 'webinar_attendees.csv', records: 250, matchRate: 92.4, creditsUsed: 1800, status: 'Success', duration: '32s' },
    { id: '3', timestamp: '2024-10-28 18:05:00', user: 'admin@example.com', type: 'Export', source: 'Audience: High-Value', records: 456, matchRate: 0, creditsUsed: 0, status: 'Success', duration: '5s' },
    { id: '4', timestamp: '2024-10-28 14:30:15', user: 'john.doe@example.com', type: 'Enrichment', source: 'test_list.csv', records: 15, matchRate: 60.0, creditsUsed: 0, status: 'Failed', duration: '12s' },
    { id: '5', timestamp: '2024-10-27 09:15:45', user: 'jane.smith@example.com', type: 'Enrichment', source: 'q3_prospects.csv', records: 5000, matchRate: 75.3, creditsUsed: 25000, status: 'Partial', duration: '12m 30s' },
];

const ActivityTab = () => {
    const [activities, setActivities] = useState(mockActivityData);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Activity Log</h1>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <CardTitle>All Activities</CardTitle>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <select className="border border-slate-300 rounded-lg py-2">
                                <option>All Statuses</option>
                                <option>Success</option>
                                <option>Partial</option>
                                <option>Failed</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                {['Timestamp', 'User', 'Type', 'Source', 'Records', 'Match Rate', 'Credits Used', 'Status', 'Duration', 'Actions'].map(h => (
                                     <th key={h} scope="col" className="px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map(log => (
                                <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
                                    <td className="px-6 py-4">{log.user}</td>
                                    <td className="px-6 py-4">{log.type}</td>
                                    <td className="px-6 py-4 font-medium text-slate-700">{log.source}</td>
                                    <td className="px-6 py-4">{log.records.toLocaleString()}</td>
                                    <td className="px-6 py-4">{log.matchRate > 0 ? `${log.matchRate}%` : '-'}</td>
                                    <td className="px-6 py-4">{log.creditsUsed > 0 ? log.creditsUsed.toLocaleString() : '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            log.status === 'Success' ? 'bg-green-100 text-green-800' : 
                                            log.status === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{log.duration}</td>
                                    <td className="px-6 py-4">
                                        <button className="font-medium text-blue-600 hover:underline">Details</button>
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

export default ActivityTab;
