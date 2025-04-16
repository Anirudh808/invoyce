import React from "react";
import {
  Html,
  // Text,
  Body,
  Head,
  // Container,
  Preview,
  Heading,
  Tailwind,
  // Img,
  // Section,
  Link,
  // Button,
} from "@react-email/components";

function Email() {
  return (
    <Html>
      <Head></Head>
      <Preview>See this email!</Preview>
      <Tailwind>
        <Body className={`bg-white`}>
          <Heading>Hello!</Heading>
          <Link href="http://localhost:3000">Click Me!</Link>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default Email;
