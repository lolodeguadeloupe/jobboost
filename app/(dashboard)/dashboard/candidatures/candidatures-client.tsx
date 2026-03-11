'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, ExternalLink, Calendar, Building2, MapPin, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

const STATUS_CONFIG = {
  draft:     { label: 'Brouillon',   color: 'bg-gray-100 text-gray-600' },
  pending:   { label: 'Envoyée',     color: 'bg-blue-100 text-blue-700' },
  interview: { label: 'Entretien',   color: 'bg-purple-100 text-purple-700' },
  offer:     { label: '🎉 Offre',    color: 'bg-green-100 text-green-700' },
  rejected:  { label: 'Refusée',     color: 'bg-red-100 text-red-600' },
}

export default function CandidaturesClient() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/candidatures')
      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch {
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/candidatures/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    // Optimistic update
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const filtered = applications.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter
    const title = a.job_offers?.title || ''
    const company = a.job_offers?.company || ''
    const matchSearch = !search || title.toLowerCase().includes(search.toLowerCase()) || company.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
          <p className="text-gray-500 text-sm mt-1">Suivez votre recherche d'emploi</p>
        </div>
        <Link href="/dashboard/apply" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouvelle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total envoyées',       value: stats.total,    color: 'text-gray-900' },
          { label: 'En attente',           value: stats.pending,  color: 'text-blue-600' },
          { label: 'Entretiens',           value: stats.interview,color: 'text-purple-600' },
          { label: 'Taux de réponse',      value: `${stats.rate}%`, color: 'text-green-600' },
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
            placeholder="Rechercher un poste ou une entreprise…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'interview', 'offer', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {f === 'all' ? 'Toutes' : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label || f}
              {f !== 'all' && <span className="ml-1 opacity-60">({applications.filter(a => a.status === f).length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-lg mb-2">Aucune candidature</h3>
          <p className="text-gray-400 mb-6">Commencez à postuler !</p>
          <Link href="/dashboard/apply" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
            Nouvelle candidature
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
                      <h3 className="font-semibold text-gray-900">{job?.title || 'Poste inconnu'}</h3>
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
                      <a href={job.source_url} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                    <div className="relative group">
                      <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:border-blue-300 transition-colors">
                        Modifier <ChevronDown className="w-3 h-3" />
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
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${job.match_score}%` }} />
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
