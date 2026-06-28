import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { Webhook } from 'npm:standardwebhooks@1.0.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { SignupEmail } from '../_shared/email-templates/signup.tsx'
import { InviteEmail } from '../_shared/email-templates/invite.tsx'
import { MagicLinkEmail } from '../_shared/email-templates/magic-link.tsx'
import { RecoveryEmail } from '../_shared/email-templates/recovery.tsx'
import { EmailChangeEmail } from '../_shared/email-templates/email-change.tsx'
import { ReauthenticationEmail } from '../_shared/email-templates/reauthentication.tsx'

// Supabase "Send Email Hook" — substitui o webhook do Lovable.
// Verificação via standard-webhooks (headers webhook-id/timestamp/signature),
// segredo configurado no dashboard (Auth > Hooks) e exposto como SEND_EMAIL_HOOK_SECRET.
// O envio em si é assíncrono: enfileira em pgmq (auth_emails) e o process-email-queue
// despacha via Resend.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature',
}

const EMAIL_SUBJECTS: Record<string, string> = {
  signup: 'Confirme seu email',
  invite: 'Você foi convidado',
  magiclink: 'Seu link de acesso',
  recovery: 'Redefinir sua senha',
  email_change: 'Confirme seu novo email',
  reauthentication: 'Seu código de verificação',
}

const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
}

// Configuração de remetente/marca
const SITE_NAME = 'Treinamento X1 - João Lucas'
const SENDER_DOMAIN = 'notify.joaolucasps.co'
const ROOT_DOMAIN = 'joaolucasps.co'
const FROM_DOMAIN = 'joaolucasps.co'

interface HookUser {
  email: string
  new_email?: string
}
interface HookEmailData {
  token?: string
  token_hash?: string
  token_hash_new?: string
  redirect_to?: string
  email_action_type: string
  site_url?: string
}

// Monta a URL de verificação que aponta para o endpoint do Supabase Auth.
function buildConfirmationUrl(supabaseUrl: string, data: HookEmailData): string {
  const tokenHash = data.token_hash_new || data.token_hash || ''
  const params = new URLSearchParams({
    token: tokenHash,
    type: data.email_action_type,
  })
  if (data.redirect_to) params.set('redirect_to', data.redirect_to)
  return `${supabaseUrl}/auth/v1/verify?${params.toString()}`
}

async function handleWebhook(req: Request): Promise<Response> {
  const hookSecretRaw = Deno.env.get('SEND_EMAIL_HOOK_SECRET')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!hookSecretRaw || !supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Verifica a assinatura do webhook (standard-webhooks).
  const payloadText = await req.text()
  let user: HookUser
  let email_data: HookEmailData
  try {
    const secret = hookSecretRaw.replace('v1,whsec_', '')
    const wh = new Webhook(secret)
    const headers = Object.fromEntries(req.headers)
    const verified = wh.verify(payloadText, headers) as { user: HookUser; email_data: HookEmailData }
    user = verified.user
    email_data = verified.email_data
  } catch (error) {
    console.error('Invalid webhook signature', { error: error instanceof Error ? error.message : String(error) })
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const emailType = email_data.email_action_type
  console.log('Received auth event', { emailType, email: user.email })

  const EmailTemplate = EMAIL_TEMPLATES[emailType]
  if (!EmailTemplate) {
    console.error('Unknown email type', { emailType })
    return new Response(JSON.stringify({ error: `Unknown email type: ${emailType}` }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const templateProps = {
    siteName: SITE_NAME,
    siteUrl: `https://${ROOT_DOMAIN}`,
    recipient: user.email,
    confirmationUrl: buildConfirmationUrl(supabaseUrl, email_data),
    token: email_data.token,
    email: user.email,
    oldEmail: user.email,
    newEmail: user.new_email,
  }

  const html = await renderAsync(React.createElement(EmailTemplate, templateProps))
  const text = await renderAsync(React.createElement(EmailTemplate, templateProps), { plainText: true })

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const messageId = crypto.randomUUID()

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: emailType,
    recipient_email: user.email,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'auth_emails',
    payload: {
      message_id: messageId,
      to: user.email,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: EMAIL_SUBJECTS[emailType] || 'Notificação',
      html,
      text,
      purpose: 'transactional',
      label: emailType,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('Failed to enqueue auth email', { error: enqueueError, emailType })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: emailType,
      recipient_email: user.email,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return new Response(JSON.stringify({ error: 'Failed to enqueue email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  console.log('Auth email enqueued', { emailType, email: user.email })
  return new Response(JSON.stringify({ success: true, queued: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  try {
    return await handleWebhook(req)
  } catch (error) {
    console.error('Webhook handler error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
