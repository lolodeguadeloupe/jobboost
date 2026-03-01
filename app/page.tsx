import Link from 'next/link'
import { Check, Zap, FileText, Send, BarChart3, Bell, ArrowRight, Star } from 'lucide-react'

const features = [
  { icon: FileText, titleFr: 'CV intelligent', titleEn: 'Smart CV', descFr: 'Uploadez votre CV une fois. L\'IA l\'adapte automatiquement à chaque offre.', descEn: 'Upload once. AI tailors it automatically for every job posting.' },
  { icon: Zap, titleFr: 'Lettre en 10 sec', titleEn: 'Letter in 10 sec', descFr: 'Une lettre de motivation personnalisée et percutante générée par IA.', descEn: 'AI-generated personalized cover letter for every application.' },
  { icon: Send, titleFr: 'Multi-plateformes', titleEn: 'Multi-platform', descFr: 'LinkedIn, Indeed, HelloWork — postulez partout depuis un seul endroit.', descEn: 'LinkedIn, Indeed, HelloWork — apply everywhere from one place.' },
  { icon: BarChart3, titleFr: 'Suivi Kanban', titleEn: 'Kanban tracking', descFr: 'Suivez chaque candidature de l\'envoi à l\'offre.', descEn: 'Track every application from send to offer.' },
  { icon: Star, titleFr: 'Score de matching', titleEn: 'Match score', descFr: 'Voyez en % à quel point votre profil correspond à l\'offre.', descEn: 'See how well your profile matches each job posting.' },
  { icon: Bell, titleFr: 'Relances auto', titleEn: 'Auto follow-ups', descFr: 'Rappels automatiques pour ne jamais rater une opportunité.', descEn: 'Automatic reminders to never miss an opportunity.' },
]

const plans = [
  { name: 'Starter', nameFr: 'Starter', price: 0, descFr: 'Pour tester', descEn: 'Try it out',
    featuresFr: ['3 candidatures/mois', 'CV adapté par IA', 'Lettre de motivation', 'Suivi basique'],
    featuresEn: ['3 applications/month', 'AI-tailored CV', 'Cover letter', 'Basic tracking'],
    ctaFr: 'Commencer gratuitement', ctaEn: 'Start for free' },
  { name: 'Pro', price: 9.90, descFr: 'Pour chercher activement', descEn: 'For active job seekers', highlighted: true,
    featuresFr: ['30 candidatures/mois', 'CV optimisé ATS', 'Lettres premium', 'Suivi Kanban', 'Score de matching', 'Support prioritaire'],
    featuresEn: ['30 applications/month', 'ATS-optimized CV', 'Premium letters', 'Full Kanban', 'Match score', 'Priority support'],
    ctaFr: 'Essai 7 jours gratuit', ctaEn: '7-day free trial' },
  { name: 'Unlimited', price: 19.90, descFr: 'Power users', descEn: 'Power users',
    featuresFr: ['Candidatures illimitées', 'Tout Pro inclus', 'Relances automatiques', 'Analytics avancés', 'Export Excel', 'API access'],
    featuresEn: ['Unlimited applications', 'Everything in Pro', 'Auto follow-ups', 'Advanced analytics', 'Excel export', 'API access'],
    ctaFr: 'Commencer', ctaEn: 'Get started' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">JobBoost</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features / Fonctionnalités</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing / Tarifs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 hidden sm:block">
              Login / Connexion
            </Link>
            <Link href="/inscription" className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1.5">
              Start free / Gratuit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #6366f1 0%, transparent 50%)`}} />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>🚀 AI-Powered · Propulsé par l'IA</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Land your next job<br />
            <span className="text-blue-300">Décrochez votre emploi</span><br />
            <span className="text-yellow-400">10x faster</span>
          </h1>
          <p className="text-xl text-white/70 mb-4 max-w-3xl mx-auto leading-relaxed">
            Paste a job posting → AI tailors your CV + writes your cover letter in seconds
          </p>
          <p className="text-lg text-white/50 mb-12 max-w-2xl mx-auto">
            Collez une offre → l'IA adapte votre CV et rédige votre lettre en quelques secondes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inscription" className="bg-yellow-400 text-gray-900 font-bold text-lg py-4 px-10 rounded-xl hover:bg-yellow-300 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-2xl">
              🚀 Start free / Commencer gratuit
            </Link>
            <a href="#features" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              See how it works / Comment ça marche
            </a>
          </div>
          <p className="text-white/30 text-sm mt-6">
            ✓ No credit card / Sans carte &nbsp;·&nbsp; ✓ 3 free applications / 3 candidatures offertes
          </p>
        </div>

        {/* Stats */}
        <div className="relative border-t border-white/10 mt-20">
          <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10x', label: 'Faster applications / Plus rapide', },
              { value: '85%', label: 'More interviews / Plus d\'entretiens', },
              { value: '< 30s', label: 'CV tailored / CV adapté', },
              { value: '0€', label: 'To start / Pour démarrer', },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-yellow-400">{s.value}</div>
                <div className="text-white/50 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works / Comment ça marche</h2>
          <p className="text-gray-500 mb-16">3 steps / 3 étapes</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '📄', titleEn: 'Upload your CV', titleFr: 'Uploadez votre CV', descEn: 'PDF or Word. AI reads and structures it.', descFr: 'PDF ou Word. L\'IA le lit et le structure.' },
              { step: '2', icon: '🔗', titleEn: 'Paste the job URL', titleFr: 'Collez l\'URL de l\'offre', descEn: 'LinkedIn, Indeed, HelloWork or any job site.', descFr: 'LinkedIn, Indeed, HelloWork ou tout autre site.' },
              { step: '3', icon: '🚀', titleEn: 'Get tailored CV + letter', titleFr: 'CV adapté + lettre prêts', descEn: 'Download and apply in 1 click.', descFr: 'Téléchargez et postulez en 1 clic.' },
            ].map(s => (
              <div key={s.step} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{s.step}</div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-lg mb-1">{s.titleEn}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3">{s.titleFr}</p>
                <p className="text-gray-500 text-sm">{s.descEn} · {s.descFr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything to land the job</h2>
            <p className="text-blue-600 font-semibold">Tout pour décrocher le job</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.titleEn} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">{f.titleEn}</h3>
                <p className="text-blue-600 text-sm font-medium mb-2">{f.titleFr}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple pricing / Tarifs simples</h2>
            <p className="text-gray-500">No surprise. Cancel anytime. · Sans surprise. Résiliable à tout moment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div key={plan.name} className={`bg-white rounded-2xl p-8 flex flex-col relative ${plan.highlighted ? 'ring-2 ring-blue-600 shadow-xl scale-105' : 'border border-gray-200'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-semibold">⭐ Most popular</div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.descEn} / {plan.descFr}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price === 0 ? 'Free' : `${plan.price}€`}</span>
                    {plan.price > 0 && <span className="text-gray-400 mb-1">/month · /mois</span>}
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.featuresEn.map((f, i) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{f}<br /><span className="text-gray-400 text-xs">{plan.featuresFr[i]}</span></span>
                    </li>
                  ))}
                </ul>
                <Link href={`/inscription?plan=${plan.name.toLowerCase()}`}
                  className={`text-center py-3 rounded-xl font-semibold transition-colors ${plan.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-gray-200 text-gray-700 hover:border-blue-300'}`}>
                  {plan.ctaEn} · {plan.ctaFr}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to land your dream job?<br /><span className="text-blue-200">Prêt à décrocher votre emploi idéal ?</span></h2>
          <Link href="/inscription" className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold text-lg py-5 px-12 rounded-xl hover:bg-yellow-300 transition-all hover:scale-105">
            🚀 Start for free — Commencer gratuitement
          </Link>
          <p className="text-blue-200 text-sm mt-6">✓ No credit card · Sans carte &nbsp;·&nbsp; ✓ 3 free applications · 3 candidatures gratuites</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/50 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-white">JobBoost AI</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy · Confidentialité</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms · CGU</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-sm">© 2025 JobBoost AI · Made with ❤️</p>
        </div>
      </footer>
    </div>
  )
}
