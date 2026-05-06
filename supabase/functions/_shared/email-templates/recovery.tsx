/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'

interface Props { siteName: string; confirmationUrl: string }

export const RecoveryEmail = ({ siteName, confirmationUrl }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Redefina sua senha do {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Redefinir senha</Heading>
        <Text style={text}>
          Recebemos um pedido para redefinir sua senha do Real Life Academy. Clique no botão abaixo para criar uma nova senha.
        </Text>
        <Button style={button} href={confirmationUrl}>Redefinir senha</Button>
        <Text style={footer}>
          Se você não pediu essa redefinição, pode ignorar este email — sua senha continuará a mesma.
        </Text>
      </Container>
    </Body>
  </Html>
)
export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#080808', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 20px' }
const button = { backgroundColor: '#ff2d78', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '6px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
const footer = { fontSize: '12px', color: '#999', margin: '32px 0 0' }
