'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight, Chrome, Check } from 'lucide-react'

const PLANS = {
  starter: { name: 'Starter', price: 'Gratuit', color: 'text-gray-400' },
  pro: { name: 'Pro', price: '9,90€/mois', color: 'text-blue-400' },
  unlimited: { name: 'Unlimited', price: '19,90€/mois', color: 'text-purple-400' },
}

function InscriptionForm() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan') as keyof typeof PLANS | null
  const plan = planParam && PLANS[planParam] ? PLANS[planParam] : PLANS.starter

  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // TODO: Supabase auth
    await new Promise(r => setTimeout(r, 1200))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Compte créé ! 🎉</h2>
        <p className="text-white/50 mb-2">Vérifiez votre email pour confirmer votre compte.</p>
        <p className="text-white/30 text-sm mb-8">Un email de confirmation a été envoyé à <span className="text-white/60">{email}</span></p>
        <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-colors">
          Se connecter <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Plan sélectionné */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-2">
        <span className="text-white/50 text-sm">Plan sélectionné</span>
        <span className={`font-semibold text-sm ${plan.color}`}>{plan.name} — {plan.price}</span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Prénom</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Votre prénom"
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@example.com"
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            required
            minLength={8}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 transition-colors"
          />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {password && (
          <div className="mt-2 flex gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${password.length > i * 3 ? i < 2 ? 'bg-red-500' : i < 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-white/10'}`} />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !nom || !email || !password}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-lg"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      <p className="text-white/30 text-xs text-center mt-2">
        En créant un compte, vous acceptez nos{' '}
        <Link href="/terms" className="text-white/50 hover:text-white underline">CGU</Link>{' '}
        et notre{' '}
        <Link href="/privacy" className="text-white/50 hover:text-white underline">politique de confidentialité</Link>.
      </p>
    </form>
  )
}

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg">JobBoost</span>
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">AI</span>
        </Link>
        <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">
          Déjà inscrit ? <span className="text-blue-400 font-semibold">Se connecter</span>
        </Link>
      </nav>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Créer votre compte 🚀</h1>
            <p className="text-white/50">3 candidatures offertes · Aucune carte requise</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
            {/* Google SSO */}
            <button className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3.5 rounded-xl mb-6 hover:bg-gray-50 transition-colors shadow-sm">
              <Chrome className="w-5 h-5" />
              Continuer avec Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-sm">ou avec email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Suspense fallback={<div className="text-white/30 text-sm text-center py-4">Chargement...</div>}>
              <InscriptionForm />
            </Suspense>
          </div>

          <p className="text-center text-white/30 text-sm mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
