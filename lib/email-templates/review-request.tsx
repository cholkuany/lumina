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

interface ReviewRequestEmailProps {
  customerName: string
  orderNumber: string
  orderDate: string
  products: Array<{
    id: string
    name: string
    image: string
    reviewUrl: string
  }>
  unsubscribeUrl: string
}

export function ReviewRequestEmail({
  customerName,
  orderNumber,
  orderDate,
  products,
  unsubscribeUrl,
}: ReviewRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>How was your recent purchase? Leave a review!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>LUMINA</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>How was your purchase?</Heading>

            <Text style={paragraph}>Hi {customerName},</Text>

            <Text style={paragraph}>
              We hope you&apos;re enjoying your recent order (#{orderNumber}) from {orderDate}.
              Your feedback helps other shoppers make informed decisions and helps us improve.
            </Text>

            <Text style={paragraph}>
              Would you take a moment to review your purchase?
            </Text>
          </Section>

          {/* Products */}
          <Section style={productsSection}>
            {products.map((product) => (
              <Section key={product.id} style={productCard}>
                <Row>
                  <Column style={productImageCol}>
                    <Img
                      src={product.image}
                      alt={product.name}
                      width={80}
                      height={80}
                      style={productImage}
                    />
                  </Column>
                  <Column style={productInfoCol}>
                    <Text style={productName}>{product.name}</Text>
                    <Button style={reviewButton} href={product.reviewUrl}>
                      Write a Review
                    </Button>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          {/* Star Rating Preview */}
          <Section style={ratingSection}>
            <Text style={ratingText}>Rate your experience:</Text>
            <Text style={stars}>★ ★ ★ ★ ★</Text>
            <Text style={ratingSubtext}>Click any product above to leave a review</Text>
          </Section>

          <Hr style={hr} />

          {/* Benefits */}
          <Section style={benefitsSection}>
            <Heading style={benefitsHeading}>Why Review?</Heading>
            <Row>
              <Column style={benefitCol}>
                <Text style={benefitIcon}>🎁</Text>
                <Text style={benefitTitle}>Earn Rewards</Text>
                <Text style={benefitText}>Get 50 points per review</Text>
              </Column>
              <Column style={benefitCol}>
                <Text style={benefitIcon}>🤝</Text>
                <Text style={benefitTitle}>Help Others</Text>
                <Text style={benefitText}>Your insights matter</Text>
              </Column>
              <Column style={benefitCol}>
                <Text style={benefitIcon}>📸</Text>
                <Text style={benefitTitle}>Share Photos</Text>
                <Text style={benefitText}>Show off your purchase</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Thank you for shopping with LUMINA
            </Text>
            <Text style={footerLinks}>
              <Link href="https://lumina.com/help" style={footerLink}>Help Center</Link>
              {' · '}
              <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe</Link>
              {' · '}
              <Link href="https://lumina.com/privacy" style={footerLink}>Privacy Policy</Link>
            </Text>
            <Text style={footerAddress}>
              LUMINA Inc., 123 Commerce Street, New York, NY 10001
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

const productsSection = {
  marginBottom: '24px',
}

const productCard = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  border: '1px solid #E8E4DD',
}

const productImageCol = {
  width: '100px',
  verticalAlign: 'top' as const,
}

const productImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
}

const productInfoCol = {
  paddingLeft: '16px',
  verticalAlign: 'middle' as const,
}

const productName = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#232323',
  margin: '0 0 12px 0',
}

const reviewButton = {
  backgroundColor: '#B8956C',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '10px 20px',
  display: 'inline-block',
}

const ratingSection = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#F7F4EF',
  borderRadius: '12px',
  marginBottom: '24px',
}

const ratingText = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 8px 0',
}

const stars = {
  fontSize: '32px',
  color: '#B8956C',
  letterSpacing: '8px',
  margin: '0 0 8px 0',
}

const ratingSubtext = {
  fontSize: '12px',
  color: '#888888',
  margin: '0',
}

const hr = {
  borderColor: '#E8E4DD',
  margin: '24px 0',
}

const benefitsSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const benefitsHeading = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '20px',
  fontWeight: '600',
  color: '#232323',
  margin: '0 0 20px 0',
}

const benefitCol = {
  textAlign: 'center' as const,
  padding: '0 8px',
}

const benefitIcon = {
  fontSize: '24px',
  margin: '0 0 8px 0',
}

const benefitTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#232323',
  margin: '0 0 4px 0',
}

const benefitText = {
  fontSize: '12px',
  color: '#666666',
  margin: '0',
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
  color: '#888888',
  margin: '0 0 12px 0',
}

const footerLink = {
  color: '#B8956C',
  textDecoration: 'none',
}

const footerAddress = {
  fontSize: '11px',
  color: '#999999',
  margin: '0 0 8px 0',
}

const footerCopyright = {
  fontSize: '11px',
  color: '#999999',
  margin: '0',
}

export default ReviewRequestEmail