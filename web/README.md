# Alumni web UI

A lightweight, dependency-free web experience for alumni to register, sign in, and manage their account using [Supabase](https://supabase.com) Auth. The UI is built with vanilla HTML, CSS, and JavaScript modules so you can host it anywhere that serves static files.

## Project structure

```
web/
├── config.example.js   # Copy to config.js and fill in your project credentials
├── index.html          # Markup for the landing, auth, and profile views
├── styles.css          # Tailored styles with light/dark scheme support
└── scripts/
    ├── main.js         # Event wiring, validation, and view transitions
    ├── auth.js         # Thin Supabase Auth wrapper functions
    └── supabaseClient.js # Shared Supabase client instance
```

## Prerequisites

- A Supabase project with email/password authentication enabled.
- A Postgres `profiles` table is optional, but you can expose additional user metadata via Supabase Auth (e.g., full name, graduation year).

> **Note:** Never embed your database connection string (e.g., `postgresql://...`) in frontend code. The web UI only needs the **project URL** and the **public anon key**, both available in the Supabase dashboard under **Project Settings → API**.

## Configuration

1. Duplicate the configuration template and edit it with your Supabase credentials:

   ```bash
   cp config.example.js config.js
   ```

2. Open `config.js` and paste:

   ```js
   export const supabaseUrl = "https://YOUR-PROJECT-REF.supabase.co";
   export const supabaseAnonKey = "YOUR_PUBLIC_ANON_KEY";
   ```

   - `supabaseUrl` is the **Project URL** (starts with `https://`).
   - `supabaseAnonKey` is the **anon public key**. It is safe for the browser but keep your `service_role` key on the server only.

3. Optionally pre-fill metadata captured during sign-up by enabling the `Full name`, `Program`, and `Graduation year` fields in your Supabase Auth user settings or syncing to a `profiles` table via triggers.

## Local development

Serve the `web/` folder using any static file server. Two quick options:

```bash
# Using Python (built-in)
python -m http.server --directory web 5173

# Using npm's http-server (install once: npm install -g http-server)
http-server web -p 5173
```

Navigate to `http://localhost:5173` and exercise the flows:

- **Register**: provide email/password plus optional metadata. A confirmation email is sent if your project requires it.
- **Login**: authenticate with the verified credentials.
- **Forgot password**: expand the accordion to request a reset email.
- **Profile view**: once signed in, the UI displays the metadata available on the current user session. Extend it to fetch tables (e.g., `profiles`, `events`) as needed.

## Supabase setup checklist

- ✅ Enable Row Level Security and create policies that allow authenticated users to read and update their own rows.
- ✅ Configure the email templates (confirmation, reset) so links reference your deployed domain.
- ✅ If you maintain a `profiles` table, create a trigger to populate it on new user registration or sync it with the Auth metadata (`full_name`, `program`, `grad_year`).
- ✅ Use [Supabase CLI](https://supabase.com/docs/guides/cli) migrations to keep schema changes versioned.

## Deployment tips

- Host the contents of `web/` on any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, etc.).
- Set `config.js` through environment-aware deployment tooling if your host supports secret injection. Otherwise, upload a handcrafted `config.js` per environment and keep it out of version control (already ignored by `.gitignore`).
- When updating the UI, bust caches by enabling immutable fingerprinted assets or instructing your host to respect short-lived cache headers for `config.js`.

## Extending the experience

- Fetch additional data: call `supabase.from("profiles")` (or other tables) once the session is available in `scripts/main.js`.
- Add role-based admin views: inspect `user.app_metadata` to gate privileged UI features.
- Integrate realtime updates: subscribe via `supabase.channel` to listen for announcements or event changes.
- Wire push notifications or scheduled jobs through Supabase Edge Functions.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| "Supabase credentials are missing" error in console | `config.js` was not created or is empty | Copy `config.example.js`, ensure the exports exist, and restart the server |
| Password reset email does not arrive | Email provider disabled or redirect URL misconfigured | Confirm Auth > Email settings and add your domain to the allowed redirect URLs |
| Session disappears on refresh | Third-party cookies blocked or project domain mismatch | Verify the site is served from a domain listed in Supabase Auth > URL configuration |

For further customization, start by editing the modules inside `web/scripts/`—each file is documented and intentionally minimal to adapt to alumni-specific workflows.
