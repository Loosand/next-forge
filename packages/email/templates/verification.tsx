import {
  Body,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

type VerificationTemplateProps = {
  readonly url: string;
};

export const VerificationTemplate = ({ url }: VerificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body>
      <Text>Thanks for signing up! Please click the link below to verify your email address:</Text>
      <Text>
        <Link href={url}>{url}</Link>
      </Text>
      <Text>If you didn't create an account, you can safely ignore this email.</Text>
    </Body>
  </Html>
);

VerificationTemplate.PreviewProps = {
  url: "https://example.com/api/auth/verify-email?token=abc123",
};

export default VerificationTemplate;
