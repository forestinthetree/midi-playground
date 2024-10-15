import { Flex, Heading, Separator } from "@radix-ui/themes";
import type { FunctionComponent } from "react";

interface Props {
  title: string;
}

export const Header: FunctionComponent<Props> = ({ title }) => {
  return (
    <>
      <Flex gap="3" justify="between" align="center" width="100%" p="4">
        <Heading as="h1">{title}</Heading>
      </Flex>
      <Separator orientation="horizontal" size="4" decorative />
    </>
  );
};
