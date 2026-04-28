import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface PasswordResetEmailProps {
  resetUrl: string
  userName?: string
}

export function PasswordResetEmail({ resetUrl, userName }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your LUMINA password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>LUMINA</Heading>

          <Heading style={heading}>Reset your password</Heading>

          <Text style={paragraph}>
            Hi {userName ?? "there"},
          </Text>
          <Text style={paragraph}>
            We received a request to reset your password. Click the button
            below to choose a new one. This link expires in{" "}
            <strong>1 hour</strong>.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={paragraph}>
            If you didn&apos;t request this, you can safely ignore this email.
            Your password will not be changed.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            LUMINA · If the button doesn&apos;t work, copy and paste this link:
          </Text>
          <Text style={link}>{resetUrl}</Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f9f5f0",
  fontFamily: "'Georgia', serif",
}

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "480px",
  border: "1px solid #e8e0d8",
}

const logo = {
  fontSize: "28px",
  fontFamily: "'Georgia', serif",
  color: "#2c2c2c",
  textAlign: "center" as const,
  marginBottom: "24px",
  letterSpacing: "4px",
}

const heading = {
  fontSize: "22px",
  fontFamily: "'Georgia', serif",
  color: "#2c2c2c",
  marginBottom: "16px",
}

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#6b6560",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#c9a84c",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "6px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
}

const hr = {
  borderColor: "#e8e0d8",
  margin: "32px 0 16px",
}

const footer = {
  fontSize: "12px",
  color: "#a09890",
}

const link = {
  fontSize: "12px",
  color: "#c9a84c",
  wordBreak: "break-all" as const,
}