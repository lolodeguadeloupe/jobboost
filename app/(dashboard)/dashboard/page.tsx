import Link from 'next/link'
import { Briefcase, CalendarCheck, Trophy, TrendingUp, Plus, ArrowRight, Building2, MapPin, Calendar } from 'lucide-react'

const STATS = [
  { label: 'Candidatures totales', value: 12, icon: Briefcase,    color: 'text-blue-600',   bg: 'bg-blue-50' },
  { label: 'Entretiens obtenus',   value: 3,  icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Offres reçues',        value: 1,  icon: Trophy,        color: 'text-green-600',  bg: 'bg-green-50' },
  { label: 'Taux de réponse',      value: '42%', icon: TrendingUp,  color: 'text-orange-600', bg: 'bg-orange-50' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Envoyée',   color: 'bg-blue-100 text-blue-700' },
  interview: { label: 'Entretien', color: 'bg-purple-100 text-purple-700' },
  offer:     { label: 'Offre 🎉',  color: 'bg-green-100 text-green-700' },
  rejected:  { label: 'Refusée',   color: 'bg-red-100 text-red-600' },
  draft:     { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
}

const DEMO_APPLICATIONS = [
  { id: '1', title: 'Développeur Full-Stack',  company: 'Spendesk',   location: 'Paris',     status: 'interview', date: '2024-03-08' },
  { id: '2', title: 'Lead Frontend React',     company: 'Alan',       location: 'Remote',    status: 'pending',   date: '2024-03-06' },
  { id: '3', title: 'Product Engineer',        company: 'Pennylane',  location: 'Paris',     status: 'offer',     date: '2024-03-01' },
  { id: '4', title: 'Software Engineer',       company: 'Contentsquare', location: 'Lyon',  status: 'pending',   date: '2024-02-28' },
  { id: '5', title: 'Backend Engineer Node.js', company: 'PayFit',    location: 'Bordeaux',  status: 'rejected',  date: '2024-02-25' },
]

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 mt-1">Voici un aperçu de votre recherche d'emploi.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-3xl font-bold ${color} mb-0.5`}>{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Candidatures récentes</h2>
          <Link href="/dashboard/candidatures" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {DEMO_APPLICATIONS.map(app => {
            const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft
            return (
              <div key={app.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{app.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{app.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span>
                    <span className="flex items-center gap-1 hidden sm:flex"><Calendar className="w-3 h-3" />{new Date(app.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <span className={`ml-4 text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg mb-1">Prêt à postuler ?</h3>
          <p className="text-blue-200 text-sm">Ajoutez une nouvelle candidature en quelques secondes.</p>
        </div>
        <Link href="/dashboard/apply"
          className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors shrink-0">
          <Plus className="w-4 h-4" /> Nouvelle candidature
        </Link>
      </div>
    </div>
  )
}
