/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'

interface Props { siteName: string; siteUrl: string; recipient: string; confirmationUrl: string }

export const SignupEmail = ({ siteName, confirmationUrl }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Confirme seu email no {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirme seu email</Heading>
        <Text style={text}>
          Quase lá! Clique no botão abaixo para confirmar seu email e ativar seu acesso ao Real Life Academy.
        </Text>
        <Button style={button} href={confirmationUrl}>Confirmar email</Button>
        <Text style={footer}>Se você não criou esta conta, ignore este email.</Text>
      </Container>
    </Body>
  </Html>
)
export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#080808', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 20px' }
const button = { backgroundColor: '#ff2d78', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '6px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
const footer = { fontSize: '12px', color: '#999', margin: '32px 0 0' }
