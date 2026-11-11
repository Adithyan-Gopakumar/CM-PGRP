import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Building2, Search, Phone, Mail, User, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filteredDepts = departments.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.name_ml.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Government of Kerala
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Participating State Departments
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse the government departments integrated with the Chief Minister's Public Grievance Redressal Portal.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by department name or keyword..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading department directory...</div>
      ) : filteredDepts.length === 0 ? (
        <div className="py-16 text-center text-slate-500">No departments match your search query.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDepts.map((dept) => (
            <div key={dept.id} className="gov-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Department Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-emerald-100 text-emerald-900 border border-emerald-200">
                        {dept.code}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900">{dept.name}</h2>
                    </div>
                    <p className="text-xs text-emerald-800 font-semibold font-['Manjari'] mt-1">
                      {dept.name_ml}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {dept.description}
                </p>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Minister Portfolio:</span>
                    <span className="font-semibold text-slate-800">{dept.minister || 'Hon. Minister'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">State Nodal Officer:</span>
                    <span className="font-semibold text-slate-800">{dept.nodal_officer || 'Designated Chief Officer'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{dept.phone || '0471-2322300'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 truncate">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{dept.email}</span>
                  </div>
                </div>
              </div>

              {/* Bottom stats & Submit Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Total: </span>
                    <strong className="text-slate-700">{dept.total_grievances || 0}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Resolved: </span>
                    <strong className="text-emerald-700">{dept.resolved_grievances || 0}</strong>
                  </div>
                </div>

                <Link
                  to={`/citizen/submit?dept=${dept.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to {dept.code}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
