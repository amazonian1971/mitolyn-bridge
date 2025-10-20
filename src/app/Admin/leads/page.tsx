'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LeadData {
  id: string;
  email: string;
  source: string;
  utm_source: string;
  utm_campaign: string;
  converted: boolean;
  created_at: string;
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    converted: 0,
    conversionRate: 0,
    todayLeads: 0
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        setLeads(data);
        
        // Calculate stats
        const total = data.length;
        const converted = data.filter(l => l.converted).length;
        const today = data.filter(l => {
          const leadDate = new Date(l.created_at).toDateString();
          const todayDate = new Date().toDateString();
          return leadDate === todayDate;
        }).length;

        setStats({
          total,
          converted,
          conversionRate: total > 0 ? (converted / total * 100) : 0,
          todayLeads: today
        });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Leads Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Converted</p>
          <p className="text-2xl font-bold">{stats.converted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Today's Leads</p>
          <p className="text-2xl font-bold">{stats.todayLeads}</p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Source</th>
              <th className="px-4 py-2 text-left">Campaign</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="px-4 py-2">{lead.email}</td>
                <td className="px-4 py-2">{lead.utm_source || 'direct'}</td>
                <td className="px-4 py-2">{lead.utm_campaign || '-'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    lead.converted 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.converted ? 'Converted' : 'Lead'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}