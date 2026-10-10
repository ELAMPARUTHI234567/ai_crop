import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard } from 'lucide-react';
import { API_URL } from '../config';

export default function Metrics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stats/dashboard`)
      .then(r => {
        if(!r.ok) throw new Error();
        return r.json()
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback for demo
        setStats({
          total_diagnoses: 0,
          crops: { "API Offline": 0 },
          common_diseases: [
            { disease: 'No Data', count: 0 }
          ]
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const pieData = [
    { name: 'No Data', value: 100 }
  ];
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];
  const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#22c55e'];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-forest-600 rounded flex justify-center items-center text-white font-bold">
          <LayoutDashboard className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Overview of your plant health diagnoses</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Diagnoses</span>
          </div>
          <span className="text-3xl font-extrabold text-blue-900">{stats.total_diagnoses}</span>
        </div>
        
        <div className="bg-teal-50 p-6 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-teal-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Tomato</span>
          </div>
          <span className="text-3xl font-extrabold text-teal-900">{stats.crops ? stats.crops["Tomato"] : 12}</span>
        </div>

        <div className="bg-orange-50 p-6 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-orange-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Chili</span>
          </div>
          <span className="text-3xl font-extrabold text-orange-900">{stats.crops ? stats.crops["Chili"] : 6}</span>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-purple-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Others</span>
          </div>
          <span className="text-3xl font-extrabold text-purple-900 text-center md:text-left">{stats.crops ? stats.crops["Others"] : 6}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Frequently Detected Diseases</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.common_diseases} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="disease" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.common_diseases.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-2">Crop Distribution</h3>
          <div className="flex-grow flex items-center justify-center relative h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend generated manually for exact mockup look */}
            <div className="absolute right-4 bottom-4 flex flex-col space-y-2 text-xs font-bold text-gray-700">
               {pieData.map((d, i) => (
                 <div key={i} className="flex items-center">
                   <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }}></div>
                   {d.name} ({d.value}%)
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
