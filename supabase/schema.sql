
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: links
-- ============================================================
CREATE TABLE IF NOT EXISTS public.links (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast slug lookup (used on every redirect)
CREATE UNIQUE INDEX IF NOT EXISTS links_slug_idx ON public.links(slug);

-- Index for user dashboard queries
CREATE INDEX IF NOT EXISTS links_user_id_idx ON public.links(user_id);

-- ============================================================
-- TABLE: clicks
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clicks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id     UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  referrer    TEXT,
  device      TEXT,
  country     TEXT,
  user_agent  TEXT,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS clicks_link_id_idx ON public.clicks(link_id);
CREATE INDEX IF NOT EXISTS clicks_timestamp_idx ON public.clicks(timestamp DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on both tables
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- ── links policies ──────────────────────────────────────────

-- Users can only read their own links
CREATE POLICY "users_select_own_links"
  ON public.links FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert links for themselves
CREATE POLICY "users_insert_own_links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own links
CREATE POLICY "users_update_own_links"
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own links
CREATE POLICY "users_delete_own_links"
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- Allow anon to read links by slug (needed for /r/[slug] redirect)
CREATE POLICY "anon_select_links_by_slug"
  ON public.links FOR SELECT
  USING (true);

-- ── clicks policies ──────────────────────────────────────────

-- Allow anon to insert clicks only for valid, existing link IDs
CREATE POLICY "anon_insert_clicks"
  ON public.clicks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.links WHERE id = link_id
    )
  );

-- Users can only read clicks for their own links
CREATE POLICY "users_select_own_clicks"
  ON public.clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = clicks.link_id
        AND links.user_id = auth.uid()
    )
  );

-- Users can delete clicks (via cascade from link deletion)
CREATE POLICY "users_delete_own_clicks"
  ON public.clicks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = clicks.link_id
        AND links.user_id = auth.uid()
    )
  );
