'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, ExternalLink, Calendar, Building2, MapPin, ChevronDown, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const STATUS_CONFIG = {
  draft:     { label: 'Draft / Brouillon',    color: 'bg-gray-100 text-gray-600',   en: 'Draft' },
  pending:   { label: 'Sent / Envoyée',       color: 'bg-blue-100 text-blue-700',   en: 'Sent' },
  interview: { label: 'Interview / Entretien', color: 'bg-purple-100 text-purple-700', en: 'Interview' },
  offer:     { label: '🎉 Offer / Offre',     color: 'bg-green-100 text-green-700', en: 'Offer' },
  rejected:  { label: 'Rejected / Refusée',   color: 'bg-red-100 text-red-600',     en: 'Rejected' },
}

export default function CandidaturesPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('applications')
      .select('*, job_offers(*)')
      .order('updated_at', { ascending: false })
    setApplications(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('applications').update({ status, last_action_at: new Date().toISOString() }).eq('id', id)
    await load()
  }

  const filtered = applications.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter
    const title = a.job_offers?.title || ''
    const company = a.job_offers?.company || ''
    const matchSearch = !search || title.toLowerCase().includes(search.toLowerCase()) || company.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rate: applications.length > 0 ? Math.round((applications.filter(a => a.status !== 'pending' && a.status !== 'draft').length / applications.length) * 100) : 0,
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications / Candidatures</h1>
          <p className="text-gray-500 text-sm mt-1">Track your job search · Suivez votre recherche</p>
        </div>
        <Link href="/dashboard/apply" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> New / Nouvelle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total sent / Envoyées', value: stats.total, color: 'text-gray-900' },
          { label: 'Pending / En attente', value: stats.pending, color: 'text-blue-600' },
          { label: 'Interviews', value: stats.interview, color: 'text-purple-600' },
          { label: 'Response rate / Taux de réponse', value: `${stats.rate}%`, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search job or company / Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'interview', 'offer', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {f === 'all' ? 'All / Toutes' : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label || f}
              {f !== 'all' && <span className="ml-1 opacity-60">({applications.filter(a => a.status === f).length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading... / Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-lg mb-2">No applications yet / Aucune candidature</h3>
          <p className="text-gray-400 mb-6">Start applying! / Commencez à postuler !</p>
          <Link href="/dashboard/apply" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
            New application / Nouvelle candidature
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const job = app.job_offers
            const statusCfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft
            return (
              <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{job?.title || 'Unknown position'}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                      {job?.company && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.company}</span>}
                      {job?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>}
                      {app.applied_at && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(app.applied_at).toLocaleDateString('fr-FR')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {job?.source_url && (
                      <a href={job.source_url} target="_blank" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                    {/* Changer le statut */}
                    <div className="relative group">
                      <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:border-blue-300 transition-colors">
                        Update <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-40 hidden group-hover:block">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <button key={key} onClick={() => updateStatus(app.id, key)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl">
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {job?.match_score && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Match score</span>
                      <span className="font-semibold text-blue-600">{job.match_score}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{width: `${job.match_score}%`}} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
