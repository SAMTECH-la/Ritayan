import React, { useState, useEffect } from 'react';
import { Users, BookOpen } from 'lucide-react';
import { getUsers } from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(res => {
        if (res.users) setUsers(res.users);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black font-serif text-white">
          USERS & READERS MONITOR
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered readers and active reading sessions stored in MySQL database.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading users list...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Comics Started</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-amber-400">#{u.id}</td>
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4 font-semibold text-emerald-400">{u.comics_started || 0} Comics</td>
                  <td className="p-4 text-slate-500 text-[11px]">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default UsersPage;
