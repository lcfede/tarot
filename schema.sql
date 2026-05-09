-- WARNING: This schema is for context only and is not meant to be run directly.
-- Table order and constraints may not be valid for execution.
-- Last updated: 2026-04-16

-- ============================================================
-- Tablas existentes
-- ============================================================

CREATE TABLE public.admin_users (
  user_id uuid NOT NULL,
  CONSTRAINT admin_users_pkey PRIMARY KEY (user_id),
  CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.certificates (
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  issued_at timestamp with time zone DEFAULT now(),
  CONSTRAINT certificates_pkey PRIMARY KEY (user_id),
  CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.oracle_docs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  source_type text NOT NULL CHECK (source_type = ANY (ARRAY['text'::text, 'pdf'::text, 'link'::text])),
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT oracle_docs_pkey PRIMARY KEY (id)
);

CREATE TABLE public.oracle_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  prompt_tokens integer NOT NULL DEFAULT 0,
  completion_tokens integer NOT NULL DEFAULT 0,
  total_tokens integer NOT NULL DEFAULT 0,
  question text,
  user_id uuid,
  CONSTRAINT oracle_usage_pkey PRIMARY KEY (id),
  CONSTRAINT oracle_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.profiles (
  user_id uuid NOT NULL,
  is_active boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT progress_pkey PRIMARY KEY (id),
  CONSTRAINT progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id),
  CONSTRAINT progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.purchase_errors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text,
  hotmart_transaction_id text,
  error_reason text NOT NULL,
  resolved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT purchase_errors_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  logged_in_at timestamp with time zone DEFAULT now(),
  device text,
  os text,
  browser text,
  country text,
  city text,
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- ============================================================
-- Tablas para el producto Lecturas (agregadas 2026-04-16)
-- ============================================================

-- Qué productos tiene cada usuario ('course' | 'readings')
-- INSERT solo via service role (webhooks). SELECT con RLS.
CREATE TABLE public.user_products (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  product    text NOT NULL CHECK (product = ANY (ARRAY['course'::text, 'readings'::text])),
  granted_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_products_pkey PRIMARY KEY (id),
  CONSTRAINT user_products_user_id_product_key UNIQUE (user_id, product),
  CONSTRAINT user_products_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Packs de tiradas comprados. pack_type: 1 | 3 | 6 tiradas.
-- INSERT solo via service role (webhook hotmart-lecturas).
CREATE TABLE public.reading_packs (
  id             uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL,
  pack_type      integer NOT NULL CHECK (pack_type = ANY (ARRAY[1, 3, 6])),
  sessions_total integer NOT NULL,
  sessions_used  integer NOT NULL DEFAULT 0,
  created_at     timestamp with time zone DEFAULT now(),
  CONSTRAINT reading_packs_pkey PRIMARY KEY (id),
  CONSTRAINT reading_packs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Cada tirada individual. INSERT desde cliente (RLS). UPDATE via service role (tarot-reader).
-- cards_json: [{ id, name, position, reversed }, ...]
CREATE TABLE public.reading_sessions (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  pack_id         uuid NOT NULL,
  spread_key      text NOT NULL,
  cards_json      jsonb NOT NULL,
  questions_total integer NOT NULL DEFAULT 10,
  questions_used  integer NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'active' CHECK (status = ANY (ARRAY['active'::text, 'completed'::text])),
  created_at      timestamp with time zone DEFAULT now(),
  CONSTRAINT reading_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT reading_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT reading_sessions_pack_id_fkey FOREIGN KEY (pack_id) REFERENCES public.reading_packs(id) ON DELETE CASCADE
);

-- RLS policies (todas las tablas nuevas tienen RLS habilitado)
-- user_products: solo lectura propia
-- reading_packs: solo lectura propia
-- reading_sessions: lectura + insert propios; update via service role
