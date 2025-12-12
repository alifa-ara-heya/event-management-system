# Stripe Webhook Setup Guide

## For Development (Localhost)

### Step 1: Install Stripe CLI

```bash
# On macOS
brew install stripe/stripe-cli/stripe

# On Linux
# Download from: https://github.com/stripe/stripe-cli/releases
# Or use package manager
```

### Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate with your Stripe account.

### Step 3: Forward Webhooks to Your Local Backend

```bash
# Make sure your backend is running on port 5000 (or your configured port)
stripe listen --forward-to http://localhost:5000/webhook
```

This command will:

- Listen for webhook events from Stripe
- Forward them to your local backend at `/webhook`
- Display a webhook signing secret (starts with `whsec_`)

### Step 4: Set the Webhook Secret in Your Backend

Copy the webhook secret that Stripe CLI displays (it looks like `whsec_...`) and add it to your backend `.env` file:

```env
WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Restart Your Backend

After setting the webhook secret, restart your backend server.

## How It Works

1. **User completes payment** → Stripe processes the payment
2. **Stripe sends webhook** → Stripe CLI intercepts it
3. **Stripe CLI forwards** → Sends to `http://localhost:5000/webhook`
4. **Backend processes** → Updates payment status and adds participant
5. **User sees event** → Event appears in their "My Events" list

## Testing

1. Start your backend: `npm run dev` (or your start command)
2. Start Stripe CLI: `stripe listen --forward-to http://localhost:5000/webhook`
3. Make a test payment
4. Check your backend console for webhook logs
5. Check your database - the participant should be added automatically

## For Production (After Deployment)

### Step 1: Go to Stripe Dashboard

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**

### Step 2: Add Webhook Endpoint

1. Click **"Add endpoint"** or **"Add webhook endpoint"**
2. Enter your production webhook URL:
   ```
   https://yourdomain.com/webhook
   ```
   (Replace `yourdomain.com` with your actual production domain)

### Step 3: Select Events to Listen For

Select the event: **`checkout.session.completed`**

This is the event that fires when a payment is completed.

### Step 4: Get the Webhook Signing Secret

1. After creating the endpoint, click on it
2. In the **"Signing secret"** section, click **"Reveal"** or **"Click to reveal"**
3. Copy the signing secret (starts with `whsec_...`)

### Step 5: Set Environment Variable in Production

Add the webhook secret to your production environment variables:

```env
WEBHOOK_SECRET=whsec_production_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** This is different from your development webhook secret!

### Step 6: Test the Webhook

1. Make a test payment in production
2. Check the **"Webhooks"** tab in Stripe Dashboard
3. You should see the webhook event being sent
4. Check your backend logs to confirm it's being received

## Development vs Production

| Aspect     | Development                     | Production                       |
| ---------- | ------------------------------- | -------------------------------- |
| **Tool**   | Stripe CLI                      | Stripe Dashboard                 |
| **URL**    | `http://localhost:5000/webhook` | `https://yourdomain.com/webhook` |
| **Secret** | From `stripe listen` command    | From Stripe Dashboard            |
| **Setup**  | Run CLI command                 | Configure in Dashboard           |

## Important Notes

1. **Different Secrets**: Development and production use different webhook secrets
2. **HTTPS Required**: Production webhook URL must use HTTPS
3. **No CLI Needed**: Stripe CLI is only for local development
4. **Automatic**: Once configured, webhooks work automatically - no CLI process needed
5. **Test Mode vs Live Mode**: You can use Stripe test mode in production for testing without real payments

## Stripe Test Mode vs Live Mode

### Test Mode (For Testing)

- **No real money**: Uses test card numbers (e.g., `4242 4242 4242 4242`)
- **Separate webhook**: Requires a separate webhook endpoint in Stripe Dashboard
- **Test secret key**: Use `STRIPE_SECRET_KEY` starting with `sk_test_...`
- **Test webhook secret**: Use `WEBHOOK_SECRET` starting with `whsec_test_...`
- **Perfect for**: Testing payment flows, webhooks, and user experience before going live

### Live Mode (For Real Payments)

- **Real money**: Uses real credit cards and processes actual payments
- **Separate webhook**: Requires a separate webhook endpoint in Stripe Dashboard
- **Live secret key**: Use `STRIPE_SECRET_KEY` starting with `sk_live_...`
- **Live webhook secret**: Use `WEBHOOK_SECRET` starting with `whsec_live_...`
- **Perfect for**: Production use with real customers

### How to Use Test Mode in Production

1. **Set Test Mode in Stripe Dashboard**:

   - Toggle to "Test mode" in the top right of Stripe Dashboard
   - All operations will be in test mode

2. **Use Test API Keys**:

   ```env
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Create Test Webhook Endpoint**:

   - In Stripe Dashboard (Test mode) → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/webhook`
   - Select event: `checkout.session.completed`
   - Copy the test webhook secret

4. **Set Test Webhook Secret**:

   ```env
   WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. **Use Test Card Numbers**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

### Switching to Live Mode

When ready for real payments:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Update API Keys** to live keys (starting with `sk_live_...`)
3. **Create Live Webhook Endpoint** (separate from test webhook)
4. **Update Webhook Secret** to live secret (starting with `whsec_live_...`)
5. **Update Environment Variables** in production

### Best Practice

- **Development**: Always use test mode
- **Staging/Production Testing**: Use test mode with test webhook endpoint
- **Production (Real)**: Use live mode with live webhook endpoint

**Note**: Test and live modes are completely separate - you need separate webhook endpoints and secrets for each!

## Troubleshooting

### Development:

- **Webhook not received?** Make sure Stripe CLI is running and forwarding
- **Signature verification failed?** Check that `WEBHOOK_SECRET` matches what Stripe CLI shows
- **Participant not added?** Check backend logs for webhook processing errors

### Production:

- **Webhook not received?**
  - Check Stripe Dashboard → Webhooks → Events to see if webhook was sent
  - Verify your production URL is accessible and correct
  - Check that your backend is running and accessible
- **Signature verification failed?**
  - Ensure `WEBHOOK_SECRET` in production matches the one from Stripe Dashboard
  - Make sure you're using the production secret, not the development one
- **Participant not added?**
  - Check backend logs for webhook processing errors
  - Verify the webhook endpoint is receiving requests (check Stripe Dashboard)
  - Ensure your database is accessible from production
