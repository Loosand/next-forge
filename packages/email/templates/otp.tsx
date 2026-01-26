import { Body, Head, Html, Preview, Text } from "@react-email/components";

type OTPTemplateProps = {
  readonly otp: string;
  readonly type: "sign-in" | "email-verification" | "forget-password";
};

const getSubjectText = (type: OTPTemplateProps["type"]) => {
  switch (type) {
    case "sign-in":
      return "Sign in to your account";
    case "email-verification":
      return "Verify your email address";
    case "forget-password":
      return "Reset your password";
    default:
      return "Verify your email address";
  }
};

export const OTPTemplate = ({ otp, type }: OTPTemplateProps) => (
  <Html>
    <Head />
    <Preview>{getSubjectText(type)}</Preview>
    <Body>
      <Text>Your verification code is:</Text>
      <Text
        style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "4px" }}
      >
        {otp}
      </Text>
      <Text>This code will expire in 5 minutes.</Text>
      <Text>
        If you didn't request this code, you can safely ignore this email.
      </Text>
    </Body>
  </Html>
);

OTPTemplate.PreviewProps = {
  otp: "123456",
  type: "email-verification",
} satisfies OTPTemplateProps;

export default OTPTemplate;
