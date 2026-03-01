-- JobBoost — Schéma Supabase

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Utilisateurs (auth.users géré par Supabase) ────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       text,
  email           text,
  locale          text DEFAULT 'fr',
  plan            text DEFAULT 'starter',           -- starter | pro | unlimited
  applications_used int DEFAULT 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text DEFAULT 'inactive',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─── CVs ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cvs (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name            text DEFAULT 'Mon CV',
  original_url    text,                             -- URL fichier dans Storage
  parsed_data     jsonb,                            -- données structurées extraites
  raw_text        text,                             -- texte brut extrait
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─── Offres d'emploi ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.job_offers (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title           text NOT NULL,
  company         text,
  location        text,
  contract_type   text,
  salary          text,
  source_url      text,
  source_platform text,                             -- linkedin | indeed | hellowork | manual
  description     text,
  skills_required text[],
  match_score     int,                              -- 0-100
  raw_html        text,
  created_at      timestamptz DEFAULT now()
);

-- ─── Candidatures ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.applications (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_offer_id    uuid REFERENCES public.job_offers(id) ON DELETE SET NULL,
  cv_id           uuid REFERENCES public.cvs(id) ON DELETE SET NULL,

  -- Contenu généré par IA
  tailored_cv_url text,                             -- CV adapté (PDF Storage)
  cover_letter    text,                             -- Lettre de motivation
  cover_letter_url text,                            -- Lettre (PDF Storage)

  -- Suivi
  status          text DEFAULT 'draft',             -- draft | sent | pending | interview | offer | rejected
  applied_at      timestamptz,
  last_action_at  timestamptz DEFAULT now(),
  notes           text,
  follow_up_date  date,
  interview_date  timestamptz,
  salary_offered  text,

  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─── Événements (timeline par candidature) ───────────────────────────────────

CREATE TABLE IF NOT EXISTS public.application_events (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id  uuid REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  user_id         uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type            text NOT NULL,                    -- sent | follow_up | interview | offer | rejected | note
  content         text,
  created_at      timestamptz DEFAULT now()
);

-- ─── Subscriptions events (Stripe webhooks) ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscription_events (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  stripe_event_id text UNIQUE,
  event_type      text,
  data            jsonb,
  created_at      timestamptz DEFAULT now()
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events  ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- CVs
CREATE POLICY "Own CVs" ON public.cvs FOR ALL USING (auth.uid() = user_id);

-- Job offers
CREATE POLICY "Own job offers" ON public.job_offers FOR ALL USING (auth.uid() = user_id);

-- Applications
CREATE POLICY "Own applications" ON public.applications FOR ALL USING (auth.uid() = user_id);

-- Events
CREATE POLICY "Own events" ON public.application_events FOR ALL USING (auth.uid() = user_id);

-- ─── Triggers ────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, locale)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'locale', 'fr')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at auto
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at   BEFORE UPDATE ON public.profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cvs_updated_at        BEFORE UPDATE ON public.cvs         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Storage ─────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('letters', 'letters', false) ON CONFLICT DO NOTHING;

CREATE POLICY "Auth upload CVs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth read own CVs" ON storage.objects FOR SELECT USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth upload letters" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'letters' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth read own letters" ON storage.objects FOR SELECT USING (bucket_id = 'letters' AND auth.uid()::text = (storage.foldername(name))[1]);
