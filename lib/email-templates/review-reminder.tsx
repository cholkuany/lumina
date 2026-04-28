// lib/email-templates/review-reminder.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components'

interface ReviewReminderEmailProps {
  customerName: string
  product: {
    id: string
    name: string
    image: string
    reviewUrl: string
  }
  daysAgo: number
  unsubscribeUrl: string
}

export function ReviewReminderEmail({
  customerName,
  product,
  daysAgo,
  unsubscribeUrl,
}: ReviewReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We&apos;d love to hear what you think about your purchase!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>LUMINA</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>Still enjoying your purchase?</Heading>

            <Text style={paragraph}>Hi {customerName},</Text>

            <Text style={paragraph}>
              It&apos;s been {daysAgo} days since you received your order, and we&apos;d love to
              hear what you think! Your review helps other customers and only takes a minute.
            </Text>

            {/* Product Card */}
            <Section style={productCard}>
              <Row>
                <Column style={productImageCol}>
                  <Img
                    src={product.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    style={productImage}
                  />
                </Column>
                <Column style={productInfoCol}>
                  <Text style={productName}>{product.name}</Text>
                  <Text style={productQuestion}>How would you rate it?</Text>
                  <Text style={stars}>☆ ☆ ☆ ☆ ☆</Text>
                  <Button style={reviewButton} href={product.reviewUrl}>
                    Write Your Review
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Incentive */}
            <Section style={incentiveSection}>
              <Text style={incentiveText}>
                🎁 <strong>Bonus:</strong> Earn 50 reward points when you leave a review!
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Thank you for being a valued LUMINA customer
            </Text>
            <Text style={footerLinks}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe from review reminders
              </Link>
            </Text>
            <Text style={footerCopyright}>
              © 2025 LUMINA. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#FFFDF9',
  fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '32px',
  fontWeight: '600',
  color: '#232323',
  letterSpacing: '2px',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '32px',
  marginBottom: '24px',
  border: '1px solid #E8E4DD',
}

const heading = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '28px',
  fontWeight: '600',
  color: '#232323',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4a4a4a',
  margin: '0 0 16px 0',
}

const productCard = {
  backgroundColor: '#F7F4EF',
  borderRadius: '12px',
  padding: '20px',
  marginTop: '24px',
}

const productImageCol = {
  width: '140px',
  verticalAlign: 'top' as const,
}

const productImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
}

const productInfoCol = {
  paddingLeft: '20px',
  verticalAlign: 'top' as const,
}

const productName = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#232323',
  margin: '0 0 8px 0',
}

const productQuestion = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 8px 0',
}

const stars = {
  fontSize: '24px',
  color: '#B8956C',
  letterSpacing: '4px',
  margin: '0 0 16px 0',
}

const reviewButton = {
  backgroundColor: '#232323',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  display: 'inline-block',
}

const incentiveSection = {
  textAlign: 'center' as const,
  marginTop: '24px',
  padding: '16px',
  backgroundColor: '#FEF3C7',
  borderRadius: '8px',
}

const incentiveText = {
  fontSize: '14px',
  color: '#92400E',
  margin: '0',
}

const hr = {
  borderColor: '#E8E4DD',
  margin: '24px 0',
}

const footer = {
  textAlign: 'center' as const,
  paddingTop: '16px',
}

const footerText = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 12px 0',
}

const footerLinks = {
  fontSize: '12px',
  margin: '0 0 12px 0',
}

const footerLink = {
  color: '#B8956C',
  textDecoration: 'none',
}

const footerCopyright = {
  fontSize: '11px',
  color: '#999999',
  margin: '0',
}

export default ReviewReminderEmail