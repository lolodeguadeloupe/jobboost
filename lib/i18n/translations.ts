export type Locale = 'fr' | 'en'

export const translations = {
  fr: {
    // Nav
    nav: {
      login: 'Connexion',
      signup: 'Essai gratuit',
      dashboard: 'Tableau de bord',
      logout: 'Déconnexion',
    },
    // Hero
    hero: {
      badge: '🚀 Propulsé par l\'IA',
      title: 'Décrochez votre prochain emploi',
      titleHighlight: '10x plus vite',
      subtitle: 'Collez une offre d\'emploi → JobBoost adapte votre CV et rédige votre lettre de motivation en secondes. Postulez sur LinkedIn, Indeed, HelloWork en 1 clic.',
      cta: 'Commencer gratuitement',
      ctaSub: 'Sans carte bancaire · 3 candidatures offertes',
      demo: 'Voir la démo',
    },
    // Features
    features: {
      title: 'Tout pour décrocher le job',
      subtitle: 'L\'IA fait le travail. Vous faites l\'entretien.',
      items: [
        { title: 'CV intelligent', desc: 'Uploadez votre CV une fois. L\'IA l\'adapte automatiquement à chaque offre.' },
        { title: 'Lettres en 10 sec', desc: 'Une lettre de motivation personnalisée et percutante pour chaque candidature.' },
        { title: 'Multi-plateformes', desc: 'LinkedIn, Indeed, HelloWork, Pôle Emploi — postulez partout depuis un seul endroit.' },
        { title: 'Suivi candidatures', desc: 'Kanban board pour suivre chaque candidature : envoyée, relance, entretien, offre.' },
        { title: 'Score de matching', desc: 'Voyez en % à quel point votre profil correspond à chaque offre avant de postuler.' },
        { title: 'Relances auto', desc: 'Rappels automatiques pour relancer au bon moment. Ne laissez plus tomber une opportunité.' },
      ],
    },
    // Pricing
    pricing: {
      title: 'Transparent. Sans surprise.',
      subtitle: 'Résiliable à tout moment.',
      monthly: '/mois',
      plans: [
        {
          name: 'Starter', price: 0, desc: 'Pour tester',
          features: ['3 candidatures/mois', 'CV adapté par IA', 'Lettre de motivation', 'Suivi basique'],
          cta: 'Commencer',
        },
        {
          name: 'Pro', price: 9.90, desc: 'Pour chercher activement', highlighted: true,
          features: ['30 candidatures/mois', 'CV adapté + optimisé ATS', 'Lettres premium', 'Suivi Kanban complet', 'Score de matching', 'Support prioritaire'],
          cta: 'Essai 7 jours gratuit',
        },
        {
          name: 'Unlimited', price: 19.90, desc: 'Pour les pros de la recherche',
          features: ['Candidatures illimitées', 'Tout Pro inclus', 'Relances automatiques', 'Analytics avancés', 'Export Excel', 'API access'],
          cta: 'Commencer',
        },
      ],
    },
    // Dashboard
    dashboard: {
      title: 'Tableau de bord',
      stats: {
        sent: 'Candidatures envoyées',
        pending: 'En attente',
        interviews: 'Entretiens',
        rate: 'Taux de réponse',
      },
      newApplication: 'Nouvelle candidature',
      tabs: { all: 'Toutes', pending: 'En attente', interview: 'Entretien', offer: 'Offre', rejected: 'Refusée' },
      status: { pending: 'Envoyée', interview: 'Entretien', offer: '🎉 Offre', rejected: 'Refusée', draft: 'Brouillon' },
    },
    // CV
    cv: {
      title: 'Mon CV',
      upload: 'Uploader mon CV',
      uploadDesc: 'PDF ou Word · Max 5MB',
      dragDrop: 'Glissez votre CV ici ou',
      browse: 'parcourir',
      parsed: 'CV analysé',
      sections: {
        personal: 'Informations personnelles',
        experience: 'Expériences',
        education: 'Formation',
        skills: 'Compétences',
        languages: 'Langues',
      },
    },
    // Apply
    apply: {
      title: 'Nouvelle candidature',
      pasteOffer: 'Collez l\'URL ou le texte de l\'offre',
      urlPlaceholder: 'https://linkedin.com/jobs/... ou texte de l\'offre',
      analyze: 'Analyser l\'offre',
      analyzing: 'Analyse en cours...',
      match: 'Matching',
      generateCv: 'Générer CV adapté',
      generateLetter: 'Générer lettre',
      send: 'Envoyer la candidature',
      preview: 'Aperçu',
    },
    // Common
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      download: 'Télécharger',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Succès !',
    },
  },

  en: {
    nav: {
      login: 'Login',
      signup: 'Start free',
      dashboard: 'Dashboard',
      logout: 'Logout',
    },
    hero: {
      badge: '🚀 AI-Powered',
      title: 'Land your next job',
      titleHighlight: '10x faster',
      subtitle: 'Paste a job posting → JobBoost tailors your CV and writes your cover letter in seconds. Apply on LinkedIn, Indeed, HelloWork in 1 click.',
      cta: 'Start for free',
      ctaSub: 'No credit card · 3 free applications',
      demo: 'Watch demo',
    },
    features: {
      title: 'Everything to land the job',
      subtitle: 'AI does the work. You do the interview.',
      items: [
        { title: 'Smart CV', desc: 'Upload your CV once. AI tailors it automatically for each job posting.' },
        { title: 'Letters in 10 sec', desc: 'A personalized, compelling cover letter for every application.' },
        { title: 'Multi-platform', desc: 'LinkedIn, Indeed, HelloWork, JobTeaser — apply everywhere from one place.' },
        { title: 'Application tracking', desc: 'Kanban board to track every application: sent, follow-up, interview, offer.' },
        { title: 'Match score', desc: 'See how well your profile matches each job before applying.' },
        { title: 'Auto follow-ups', desc: 'Automatic reminders to follow up at the right time. Never miss an opportunity.' },
      ],
    },
    pricing: {
      title: 'Simple, transparent pricing.',
      subtitle: 'Cancel anytime.',
      monthly: '/month',
      plans: [
        {
          name: 'Starter', price: 0, desc: 'Try it out',
          features: ['3 applications/month', 'AI-tailored CV', 'Cover letter', 'Basic tracking'],
          cta: 'Get started',
        },
        {
          name: 'Pro', price: 9.90, desc: 'For active job seekers', highlighted: true,
          features: ['30 applications/month', 'ATS-optimized CV', 'Premium letters', 'Full Kanban', 'Match score', 'Priority support'],
          cta: '7-day free trial',
        },
        {
          name: 'Unlimited', price: 19.90, desc: 'For power users',
          features: ['Unlimited applications', 'Everything in Pro', 'Auto follow-ups', 'Advanced analytics', 'Excel export', 'API access'],
          cta: 'Get started',
        },
      ],
    },
    dashboard: {
      title: 'Dashboard',
      stats: {
        sent: 'Applications sent',
        pending: 'Pending',
        interviews: 'Interviews',
        rate: 'Response rate',
      },
      newApplication: 'New application',
      tabs: { all: 'All', pending: 'Pending', interview: 'Interview', offer: 'Offer', rejected: 'Rejected' },
      status: { pending: 'Sent', interview: 'Interview', offer: '🎉 Offer', rejected: 'Rejected', draft: 'Draft' },
    },
    cv: {
      title: 'My CV / Resume',
      upload: 'Upload my CV',
      uploadDesc: 'PDF or Word · Max 5MB',
      dragDrop: 'Drag your CV here or',
      browse: 'browse',
      parsed: 'CV analyzed',
      sections: {
        personal: 'Personal info',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        languages: 'Languages',
      },
    },
    apply: {
      title: 'New application',
      pasteOffer: 'Paste the job URL or description',
      urlPlaceholder: 'https://linkedin.com/jobs/... or job description text',
      analyze: 'Analyze job',
      analyzing: 'Analyzing...',
      match: 'Match score',
      generateCv: 'Generate tailored CV',
      generateLetter: 'Generate letter',
      send: 'Send application',
      preview: 'Preview',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      download: 'Download',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
    },
  },
} as const

export function t(locale: Locale, path: string): string {
  const keys = path.split('.')
  let obj: unknown = translations[locale]
  for (const key of keys) {
    if (obj && typeof obj === 'object' && key in (obj as object)) {
      obj = (obj as Record<string, unknown>)[key]
    } else return path
  }
  return typeof obj === 'string' ? obj : path
}
