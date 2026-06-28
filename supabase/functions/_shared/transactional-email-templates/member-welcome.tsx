import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Treinamento X1'

interface MemberWelcomeProps {
  name?: string
  email?: string
  password?: string
  magicLink?: string
  loginUrl?: string
}

const MemberWelcomeEmail = ({
  name,
  email,
  password,
  magicLink,
  loginUrl,
}: MemberWelcomeProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu acesso à área de membros do {SITE_NAME} está liberado</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bem-vindo(a){name ? `, ${name}` : ''}! 🎉</Heading>
        <Text style={text}>
          Seu pagamento foi confirmado e seu acesso à área de membros do{' '}
          <strong>{SITE_NAME}</strong> está liberado.
        </Text>

        {magicLink && (
          <Section style={ctaSection}>
            <Text style={text}>
              Clique no botão abaixo para entrar automaticamente (sem precisar de senha):
            </Text>
            <Button href={magicLink} style={button}>
              Acessar área de membros
            </Button>
            <Text style={small}>O link de acesso direto expira em 24 horas.</Text>
          </Section>
        )}

        <Hr style={hr} />

        <Heading as="h2" style={h2}>Seus dados de acesso</Heading>
        <Text style={text}>
          Caso prefira, você também pode entrar com email e senha:
        </Text>
        <Section style={credBox}>
          <Text style={credLine}><strong>Email:</strong> {email || 'seu email de compra'}</Text>
          {password && (
            <Text style={credLine}><strong>Senha:</strong> {password}</Text>
          )}
        </Section>
        {loginUrl && (
          <Text style={text}>
            Página de login: <a href={loginUrl} style={link}>{loginUrl}</a>
          </Text>
        )}

        <Text style={text}>
          Recomendamos alterar sua senha após o primeiro acesso, em "Minha conta".
        </Text>

        <Hr style={hr} />
        <Text style={footer}>Bons estudos,<br />Equipe {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: MemberWelcomeEmail,
  subject: 'Seu acesso ao Treinamento X1 está liberado 🎉',
  displayName: 'Boas-vindas área de membros',
  previewData: {
    name: 'João',
    email: 'joao@exemplo.com',
    password: 'Abc123XyZ!',
    magicLink: 'https://joaolucasps.co/membros/auth?token=abc',
    loginUrl: 'https://joaolucasps.co/membros/login',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#080808', margin: '0 0 16px' }
const h2 = { fontSize: '18px', fontWeight: 'bold', color: '#080808', margin: '24px 0 12px' }
const text = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const small = { fontSize: '12px', color: '#888', margin: '8px 0 0' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = {
  backgroundColor: '#ff2d78', color: '#ffffff', padding: '14px 28px',
  borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none',
  fontSize: '15px', display: 'inline-block',
}
const credBox = {
  backgroundColor: '#f6f6f6', padding: '16px', borderRadius: '6px',
  borderLeft: '3px solid #ff2d78', margin: '0 0 16px',
}
const credLine = { fontSize: '14px', color: '#080808', margin: '4px 0' }
const link = { color: '#ff2d78', textDecoration: 'underline' }
const hr = { borderColor: '#eaeaea', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#888', margin: '16px 0 0' }
