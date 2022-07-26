import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Text,
  keyframes,
  usePrefersReducedMotion,
  Spinner,
  Box,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { InjectedConnector } from "wagmi/connectors/injected";
import Footer from "../components/Footer";
import InputLayout from "../components/InputLayout";
import SelectInput from "../components/SelectInput";
import StewardsCard from "../components/StewardsCard";

const blink = keyframes`
  0%{
    border: 2px solid #be59cf;
  }
  50% {
    border: 2px solid #42c8b0;
  }
  100% {
    border: 2px solid #be59cf;
  }
  `;

const Home: NextPage = () => {
  // const { address, isConnected } = useAccount();
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });
  // const { disconnect } = useDisconnect();

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [orderBy, setOrderBy] = useState(
    searchParams.get("orderBy") ?? "descending"
  );
  const [display, setDisplay] = useState(
    searchParams.get("display") ?? "health"
  );
  const [toogleTab, setToogleTab] = useState(1);
  const [time, setTime] = useState(searchParams.get("time") ?? "30d");
  const [stewardsData, setStewardsData] = useState([]);
  const [filteredStewardsData, setFilteredStewardsData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${blink} infinite 5s linear`;

  /**
   * Find a steward profile by the passed in wallet address and data to search through
   */
  function findStewardByAddress(address, data) {
    return data.find((e) => {
      return e.address.toLowerCase() === address.toLowerCase();
    });
  }

  /**
   * Calculate the forum activity
   */
  function getForumActivity(element) {
    return element.stats[0].forumTopicCount + element.stats[0].forumPostCount;
  }

  /**
   * Calculate the voting weight
   */
  function getVotingWeight(element) {
    return element.delegatedVotes / 1000000;
  }

  /**
   * Combine steward data from stewards_data.json, which is at the time of writing manually updated, and karma data, which is coming from the karma API.
   */
  async function getStewardsData() {
    const success = (res) => (res.ok ? res.json() : Promise.resolve({}));

    const karmaData = fetch(
      "/api.showkarma.xyz/api/dao/delegates?name=gitcoin&pageSize=250&offset=0&workstreamId=6,4,3,7,1,2,5&period=" +
        time
    ).then(success);
    const stewardsProfileData = fetch(
      "/assets/stewards/stewards_data.json"
    ).then(success);

    let ret = [];

    await Promise.all([karmaData, stewardsProfileData])
      .then(([karmaData, stewardsProfileData]) => {
        karmaData.data.delegates.forEach((element) => {
          element.profile = findStewardByAddress(
            element.publicAddress,
            stewardsProfileData.data
          );
          ret.push(element);
        });
      })
      .catch((err) => console.error(err));

    return ret;
  }

  function convertToNumber(val) {
    return Number(val);
  }

  /**
   * Apply some filtering to the stewards data
   */
  function filterStewardsData() {
    let clonedData = JSON.parse(JSON.stringify(stewardsData));

    if (search.length > 0) {
      clonedData = clonedData.filter((element) => {
        if (element.profile) {
          return (
            element.profile.name.toLowerCase().indexOf(search.toLowerCase()) >=
              0 ||
            element.profile.workstream
              .toLowerCase()
              .indexOf(search.toLowerCase()) >= 0 ||
            element.profile.gitcoin_username
              .toLowerCase()
              .indexOf(search.toLowerCase()) >= 0
          );
        }
      });
    }

    if (display === "health") {
      clonedData.sort(function (a, b) {
        return (
          convertToNumber(a.stats[0].gitcoinHealthScore) -
            convertToNumber(b.stats[0].gitcoinHealthScore) ||
          convertToNumber(a.stats[0].offChainVotesPct) -
            convertToNumber(b.stats[0].offChainVotesPct)
        );
      });
    } else if (display === "forum_activity") {
      clonedData.sort(function (a, b) {
        return (
          convertToNumber(getForumActivity(a)) -
          convertToNumber(getForumActivity(b))
        );
      });
    } else if (display === "voting_weight") {
      clonedData.sort(function (a, b) {
        return (
          convertToNumber(getVotingWeight(a)) -
          convertToNumber(getVotingWeight(b))
        );
      });
    }

    if (orderBy === "descending") {
      clonedData = clonedData.reverse();
    }

    setFilteredStewardsData(clonedData);
  }

  // Get data on load, as well as if the time changes
  useEffect(() => {
    getStewardsData().then((data) => {
      setIsLoading(true);
      setStewardsData(data);
      setIsLoading(false);
    });
  }, [time]);

  useEffect(() => {
    if (stewardsData.length > 0) {
      let lastUpdated = stewardsData[0].stats[0].updatedAt;

      stewardsData.map((data) => {
        if (data.stats[0].updatedAt.valueOf() > lastUpdated.valueOf()) {
          lastUpdated = data.stats[0].updatedAt;
        }
      });
      setLastUpdatedAt(lastUpdated);
    }
  }, [stewardsData]);

  // Filter when stewardsData changes
  useEffect(() => {
    filterStewardsData();
  }, [stewardsData]);

  // Set the query params and run the filter
  useEffect(() => {
    setSearchParams({
      search: search,
      display: display,
      orderBy: orderBy,
      time: time,
    });

    filterStewardsData();
  }, [search, orderBy, display, time]);

  return (
    <>
      <Head>
        <title>Steward Report Cards</title>
        <meta
          name="description"
          content="Report cards for Gitcoin stewards, including their participation weighting, streams they work in and their activity in forums."
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="assets/favicon.png"
        />
      </Head>
      <Flex mr={"auto"}>
        <Box
          bg={toogleTab === 1 ? "#291555" : "#190C35"}
          paddingX="5"
          paddingY="2"
          textColor={toogleTab === 1 ? "#BE59CF" : "#9C14B2"}
          fontWeight="semibold"
          fontSize="xl"
          borderTopRightRadius="10px"
          borderTopLeftRadius="10px"
          cursor="pointer"
          onClick={() => setToogleTab(1)}
          zIndex={toogleTab === 1 ? "1" : "0"}
        >
          Stewards
        </Box>
        <Box
          bg={toogleTab === 2 ? "#291555" : "#190C35"}
          paddingX="5"
          paddingY="2"
          textColor={toogleTab === 2 ? "#BE59CF" : "#9C14B2"}
          fontWeight="semibold"
          fontSize="xl"
          borderTopRightRadius="10px"
          borderTopLeftRadius="10px"
          cursor="pointer"
          onClick={() => setToogleTab(2)}
          zIndex={toogleTab === 2 ? "1" : "0"}
          marginLeft="-.5rem"
        >
          Workstreams
        </Box>
      </Flex>
      {toogleTab === 1 && (
        <Flex
          bg="#291555"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="2"
          textAlign="center"
          paddingTop="10"
        >
          <Heading mb="2rem" textAlign="center">
            Steward Health Cards
          </Heading>
          <Text mb="2rem">
            The Stewards of Gitcoin DAO play a vital role in driving the Gitcoin
            ecosystem forward through their work in governance and workstreams.
            In an effort to boost transparency the MMM-Workstream have created
            this site with health cards for each Steward that display metrics
            and links on their involvement and engagement in the DAO. Details
            and discussion can be found on the{" "}
            <Link href="https://gov.gitcoin.co/t/introducing-steward-report-cards/8712">
              governance forum
            </Link>
            , to learn more and get involved - visit{" "}
            <Link href="https://gitcoindao.com/">GitcoinDAO.com</Link>
          </Text>
          <Text mb="1rem">
            Data powered by <Link href="https://www.showkarma.xyz/">Karma</Link>
            .
          </Text>
          {lastUpdatedAt && (
            <Text mb="2rem">
              Data Last Updated on {lastUpdatedAt.toString().slice(0, 10)}
            </Text>
          )}

          <Grid
            mb="5rem"
            w="full"
            templateColumns={{ lg: "repeat(5, 1fr)", base: "repeat(1, 1fr)" }}
            gap={6}
          >
            <GridItem colSpan={{ lg: 2, base: 1 }}>
              <InputLayout label="Search">
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  border="none"
                  p={0}
                  focusBorderColor="none"
                  color="white"
                  fontSize="1.3rem"
                  placeholder="Name, Address, Workstream ..."
                />
              </InputLayout>
            </GridItem>
            <GridItem>
              <SelectInput
                label="Order by"
                options={[
                  { label: "Health", value: "health" },
                  { label: "Forum Activity", value: "forum_activity" },
                  { label: "Voting Weight", value: "voting_weight" },
                ]}
                defaultValue={display}
                onChange={setDisplay}
              />
            </GridItem>
            <GridItem>
              <SelectInput
                label="Display"
                options={[
                  { label: "Descending", value: "descending" },
                  { label: "Ascending", value: "ascending" },
                ]}
                defaultValue={orderBy}
                onChange={setOrderBy}
              />
            </GridItem>
            <GridItem animation={animation} borderRadius={"lg"}>
              <SelectInput
                label="Time"
                options={[
                  { label: "30 Days", value: "30d" },
                  { label: "Lifetime", value: "lifetime" },
                ]}
                defaultValue={time}
                onChange={setTime}
              />
            </GridItem>
          </Grid>

          {isLoading ? (
            <Spinner color="purple.500" size="xl" />
          ) : (
            <Grid
              w="full"
              templateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
                "2xl": "repeat(4, 1fr)",
              }}
              gap={"2rem"}
            >
              {filteredStewardsData.map((element, index) => (
                <GridItem key={index}>
                  <StewardsCard
                    name={element.profile ? element.profile.name : ""}
                    gitcoinUsername={
                      element.profile ? element.profile.gitcoin_username : "-"
                    }
                    profileImage={
                      element.profile ? element.profile.profile_image : ""
                    }
                    stewardsSince={
                      element.profile ? element.profile.steward_since : "-"
                    }
                    forumActivity={getForumActivity(element)}
                    workstream={
                      element.profile ? element.profile.workstream : ""
                    }
                    votingWeight={getVotingWeight(element)}
                    votingParticipation={element.stats[0].offChainVotesPct}
                    statementLink={
                      element.profile ? element.profile.statement_post : ""
                    }
                    delegateLink={
                      "https://www.withtally.com/voter/" +
                      element.publicAddress +
                      "/governance/gitcoin"
                    }
                    forumActivityLink={
                      element.profile
                        ? "https://gov.gitcoin.co/u/" +
                          element.profile.discourse_username
                        : "/"
                    }
                    healthScore={element.stats[0].gitcoinHealthScore}
                  />
                </GridItem>
              ))}
            </Grid>
          )}
          <Footer />
        </Flex>
      )}
      {toogleTab === 2 && (
        <Flex
          bg="#291555"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="2"
          textAlign="center"
          paddingTop="10"
          width="100%"
        >
          <Heading mb="2rem" textAlign="center">
            Workstreams
          </Heading>
        </Flex>
      )}
    </>
  );
};

export default Home;
