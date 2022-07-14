import { Box, Button, Flex, Image, Link, Text, VStack } from "@chakra-ui/react";

interface StewardsCardProps {
  name?: string;
  stewardsSince?: string;
  workstream?: string;
  votingWeight?: number;
  votingParticipation?: number;
  gitcoinUsername?: string;
  profileImage?: string;
  statementLink?: string;
  delegateLink?: string;
  forumActivity?: number;
  forumActivityLink?: string;
  healthScore?: number;
}

// Ensure healh scores between 1 - 10, or '-' are returned
function getHealthcore(healthScore) {
  return healthScore > 0 ? (healthScore > 10 ? 10 : healthScore) : '-';
}

const StewardsCard = ({
  name,
  stewardsSince,
  forumActivity,
  workstream,
  votingWeight,
  votingParticipation,
  gitcoinUsername,
  profileImage,
  statementLink,
  delegateLink,
  forumActivityLink,
  healthScore,
}: StewardsCardProps) => {
  return (
    <VStack
      background="#321e5e"
      borderRadius="6px"
      // p="0.8rem"
      w={"full"}
      gap="0.8rem"
    >
      <Flex alignItems="center" w="full" justify="space-between">
        <Flex gap="1rem" alignItems="center">
          <Image
            borderRadius="1rem"
            w={{ sm: "100px", base: "70px" }}
            h={{ sm: "100px", base: "70px" }}
            src={profileImage ? `/assets/stewards/` + profileImage : '/assets/stewards/unknown.png'}
            alt={name ? name : '-'}
          />
          <Box textAlign="left">
            <Text fontSize={{ sm: "1.2rem", base: "0.9rem" }} fontWeight="bold">
              {name.length > 0 ? name : '-'}
            </Text>
            <Link
              isExternal
              href={"https://gitcoin.co/" + gitcoinUsername}
              color="#42c8b0"
              textDecoration="none"
              _hover={{ color: "#42c8b0" }}
              fontSize={{ sm: "1.2rem", base: "0.9rem" }}
            >
              {gitcoinUsername}
            </Link>
          </Box>
        </Flex>
        <Box marginRight="1rem">
          <Text fontSize={{ sm: "1.8rem", base: "1.2rem" }} fontWeight="bold">
            {getHealthcore(healthScore)}
          </Text>
          <Image
            src={
              "/assets/healthSvgs/health_" +
              getHealthcore(healthScore) +
              ".svg"
            }
            width={{ sm: "full", base: "5rem" }}
            alt={"Health score of " + getHealthcore(healthScore)}
          />
        </Box>
      </Flex>
      <Flex
        justify="space-between"
        alignItems="center"
        w="full"
        paddingX={"1rem"}
      >
        <Flex gap="1rem" alignItems="center">
          <Image
            w={{ sm: "40px", base: "30px" }}
            h={{ sm: "40px", base: "30px" }}
            src="/assets/calender.svg"
            alt="calender"
          />
          <Link
            isExternal
            href={statementLink}
            textDecoration="none"
            _hover={{ color: "white" }}
            fontSize={{ sm: "1.2rem", base: "0.9rem" }}
          >
            Stewards since
          </Link>
        </Flex>
        <Text fontSize={{ sm: "1.2rem", base: "0.9rem" }}>{stewardsSince}</Text>
      </Flex>
      <Flex
        justify="space-between"
        alignItems="center"
        w="full"
        paddingX={"1rem"}
      >
        <Flex gap="1rem" alignItems="center">
          <Image
            w={{ sm: "40px", base: "30px" }}
            h={{ sm: "40px", base: "30px" }}
            src="/assets/forum.svg"
            alt="calender"
          />
          <Link
            isExternal
            href={forumActivityLink}
            textDecoration="none"
            _hover={{ color: "white" }}
            fontSize={{ sm: "1.2rem", base: "0.9rem" }}
          >
            Forum activity
          </Link>
        </Flex>
        <Text fontSize={{ sm: "1.2rem", base: "0.9rem" }}>{forumActivity > 0 ? forumActivity : '-'}</Text>
      </Flex>
      <Flex
        justify="space-between"
        alignItems="center"
        w="full"
        paddingX={"1rem"}
      >
        <Flex gap="1rem" alignItems="center">
          <Image
            w={{ sm: "40px", base: "30px" }}
            h={{ sm: "40px", base: "30px" }}
            src="/assets/workstream.svg"
            alt="calender"
          />
          <Link
            isExternal
            href="https://gitcoindao.com"
            textDecoration="none"
            _hover={{ color: "white" }}
            fontSize={{ sm: "1.2rem", base: "0.9rem" }}
          >
            Workstream
          </Link>
        </Flex>
        <Text fontSize={{ sm: "1.2rem", base: "0.9rem" }}>
          {workstream ? workstream.length > 20 ? workstream.slice(0, 9) + "..." : workstream : '-'}
        </Text>
      </Flex>
      <Flex
        justify="space-between"
        alignItems="center"
        w="full"
        paddingX={"1rem"}
      >
        <Flex gap="1rem" alignItems="center">
          <Image
            w={{ sm: "40px", base: "30px" }}
            h={{ sm: "40px", base: "30px" }}
            src="/assets/weight.svg"
            alt="calender"
          />
          <Link
            isExternal
            href={delegateLink}
            textDecoration="none"
            _hover={{ color: "white" }}
            fontSize={{ sm: "1.2rem", base: "0.9rem" }}
          >
            Voting weight
          </Link>
        </Flex>
        <Text fontSize={{ sm: "1.2rem", base: "0.9rem" }}>{votingWeight > 0 ? votingWeight + '%' : '-'}</Text>
      </Flex>
      <Flex
        justify="space-between"
        alignItems="center"
        w="full"
        paddingX={"1rem"}
      >
        <Flex gap="1rem" alignItems="center">
          <Image
            w={{ sm: "40px", base: "30px" }}
            h={{ sm: "40px", base: "30px" }}
            src="/assets/participation.svg"
            alt="calender"
          />
          <Link
            isExternal
            href="https://snapshot.org/#/gitcoindao.eth"
            textDecoration="none"
            _hover={{ color: "white" }}
            fontSize={{ sm: "1.2rem", base: "0.9rem" }}
          >
            Vote participation
          </Link>
        </Flex>
        <Text fontSize={{ sm: "1.2rem", base: "0.9rem" }}>
          {votingParticipation > 0 ? votingParticipation + '%' : '-'}
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        w="full"
        justify="space-between"
        paddingX={"1rem"}
        paddingY={"1rem"}
      >
        <Button variant="statement" paddingX="1.5">
          <Link
            isExternal
            color="white"
            href={statementLink}
            textDecoration="none"
            fontSize={{ sm: "1.2rem", base: "0.9rem" }}
          >
            Statement
          </Link>
        </Button>
        <Button variant="delegate">
          <Link
            isExternal
            color="white"
            href={delegateLink}
            textDecoration="none"
            fontSize={{ sm: "1.2rem", base: "0.9rem" }}
          >
            Delegate
          </Link>
        </Button>
      </Flex>
    </VStack>
  );
};

export default StewardsCard;