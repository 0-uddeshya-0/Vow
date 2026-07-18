# OneDrive photo sync — setup (owner only, ~20 min, Phase 4)

Guest photos land in Firebase Storage immediately (works today, free plan).
This optional pipeline mirrors every upload into the couple's OneDrive:
`Storage finalize → Cloud Function → Microsoft Graph → OneDrive/Vow/<event>/`,
with a 30-minute retry sweep (max 5 attempts) for flaky uploads.

**Honest status: the code in `functions/` compiles but has NEVER been deployed
or exercised** — it needs the two paid/external steps below that only the
account owner can perform. Until then, photos are safe in Storage and can be
downloaded from the console or the admin panel at any time.

## 1. Firebase Blaze

Console → ⚙️ → Usage and billing → upgrade **vow-1809** to Blaze.
(Functions don't run on Spark. At 20 guests the real cost rounds to €0.)

## 2. Azure app registration (for Microsoft Graph)

1. [portal.azure.com](https://portal.azure.com) → Microsoft Entra ID → App registrations → **New**.
   - Supported account types: **Personal Microsoft accounts** (the couple's OneDrive is personal).
   - Redirect URI (Web): `http://localhost:8765/callback`
2. Copy the **Application (client) ID**. Certificates & secrets → **New client secret** → copy its value.
3. API permissions → Microsoft Graph → Delegated → add `Files.ReadWrite`, `offline_access`.

## 3. One-time consent → refresh token

In a browser, signed in as the couple's Microsoft account (fill CLIENT_ID):

```
https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost:8765/callback&scope=Files.ReadWrite%20offline_access
```

Approve → the browser redirects to `localhost:8765/callback?code=…` (an error page is fine — copy the `code` from the URL). Exchange it:

```bash
curl -s https://login.microsoftonline.com/consumers/oauth2/v2.0/token \
  -d client_id=CLIENT_ID -d client_secret=CLIENT_SECRET \
  -d grant_type=authorization_code -d code=CODE \
  -d redirect_uri=http://localhost:8765/callback \
  -d scope="Files.ReadWrite offline_access"
```

Keep the `refresh_token` from the response. **Never commit any of these values.**

## 4. Deploy

```bash
npm i -g firebase-tools && firebase login
cd functions && npm install
firebase functions:secrets:set MS_CLIENT_ID      # paste value
firebase functions:secrets:set MS_CLIENT_SECRET
firebase functions:secrets:set MS_REFRESH_TOKEN
npm run deploy
```

Verify: upload a photo on the site → within a minute it appears in
`OneDrive/Vow/demo-wedding/` and the admin Photos tab shows it as **synced**.
Failures show a `syncError` on the photo doc and retry automatically.
