# DoodleDrift Supabase Setup

DoodleDrift is a static GitHub Pages app, so it cannot safely keep private database credentials in the repo. The app is wired for Supabase Auth with the public anon key, which lets real visitors create accounts, sign in, and store profile metadata in Supabase's hosted auth database.

## Activate Hosted Accounts

1. Create a free Supabase project.
2. Open Project Settings > API.
3. Copy the Project URL and the anon/public key.
4. Put them in `apps/doodledrift/supabase-config.json`:

```json
{
  "url": "https://YOUR_PROJECT_ID.supabase.co",
  "anonKey": "YOUR_ANON_PUBLIC_KEY"
}
```

5. Open Authentication > URL Configuration.
6. Set Site URL to `https://cosmicbubblegumgirl.github.io/vercel-apps-github-pages/apps/doodledrift/login.html`.
7. Add this redirect URL: `https://cosmicbubblegumgirl.github.io/vercel-apps-github-pages/apps/doodledrift/*`.
8. Open Authentication > Providers > Email. Leave confirmation on for public use, or turn it off while testing immediate sign-ins.

Do not commit a service role key. Only the anon/public key belongs in this static app.

When `supabase-config.json` is blank, DoodleDrift keeps using its local browser-storage fallback so the static demo still works.
