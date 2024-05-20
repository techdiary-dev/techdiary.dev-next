import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./ErrorPage.module.css";

import React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  return (
    <Container className={classes.root}>
      <Title className={classes.title}>{error?.message} 🚧</Title>
      <Group justify="center" mt={"lg"}>
        <Button
          variant="subtle"
          size="md"
          onClick={() => (window.location.href = "/")}
        >
          হোম পেইজে ফিরে যান
        </Button>
      </Group>
    </Container>
  );
};

export default ErrorPage;
