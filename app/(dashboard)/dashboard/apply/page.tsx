'use client'
import { useState } from 'react'
import { Link2, Pencil, Send, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'draft',     label: 'Brouillon' },
  { value: 'pending',   label: 'Envoyée' },
  { value: 'interview', label: 'Entretien' },
  { value: 'offer',     label: 'Offre reçue' },
  { value: 'rejected',  label: 'Refusée' },
]

export default function ApplyPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'url' | 'manual'>('url')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    url: '',
    title: '',
    company: '',
    location: '',
    status: 'pending',
    notes: '',
  })

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/candidatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_url: form.url || null,
          title: form.title,
          company: form.company,
          location: form.location,
          status: form.status,
          notes: form.notes,
        }),
      })
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/candidatures'), 1500)
    } catch {
      // handle silently
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="bg-green-100 rounded-full p-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Candidature enregistrée !</h2>
        <p className="text-gray-500 text-sm">Redirection vers vos candidatures…</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle candidature</h1>
        <p className="text-gray-500 mt-1">Ajoutez une offre par URL ou manuellement.</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>
          <Link2 className="w-4 h-4" /> Par URL
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>
          <Pencil className="w-4 h-4" /> Manuellement
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* URL mode */}
        {mode === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de l'offre</label>
            <input
              type="url"
              value={form.url}
              onChange={e => set('url', e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1.5">LinkedIn, Welcome to the Jungle, Indeed, etc.</p>
          </div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Intitulé du poste *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Ex : Développeur Full-Stack"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Entreprise</label>
              <input
                type="text"
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder="Ex : Spendesk"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Localisation</label>
              <input
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="Ex : Paris / Remote"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
          <select
            value={form.status}
            onChange={e => set('status', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={4}
            placeholder="Remarques, contacts, prochaines étapes…"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60">
          {loading ? (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? 'Enregistrement…' : 'Enregistrer la candidature'}
        </button>
      </form>
    </div>
  )
}
