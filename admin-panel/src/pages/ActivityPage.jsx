import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { getActivityLogs } from '../services/api';

const ActivityPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLogs()
      .then(res => {
        if (res.logs) setLogs(res.logs);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black font-serif text-white">
          ACTIVITY AUDIT LOGS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical record of administrative actions logged in MySQL `activity_logs`.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading audit logs...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="p-4">ID</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
                <th className="p-4">Admin</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-4 text-slate-500">#{log.id}</td>
                  <td className="p-4 font-bold text-amber-400">{log.action}</td>
                  <td className="p-4 text-slate-200">{log.details}</td>
                  <td className="p-4 font-semibold text-slate-300">{log.admin_name || 'Admin'}</td>
                  <td className="p-4 text-slate-500 text-[11px]">{log.ip_address}</td>
                  <td className="p-4 text-slate-400 text-[11px]">{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ActivityPage;
