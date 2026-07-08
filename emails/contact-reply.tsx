import { Body, Container, Heading, Html, Text, Button } from '@react-email/components';

interface Props {
  name: string;
}

export default function ContactReplyEmail({ name }: Props) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Thank you for contacting Shalom Worship</Heading>

          <Text>Dear {name},</Text>

          <Text>Greetings in the name of our Lord Jesus Christ!</Text>

          <Text>Thank you for contacting Shalom Worship and for your support.</Text>

          <Button href="https://www.shalomworship.com">Visit Shalom Worship</Button>

          <Text>
            Blessings,
            <br />
            Shekhar
            <br />
            Community & Support Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
