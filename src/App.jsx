import { IconButton } from "@chakra-ui/button";
import { Flex, Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Textarea, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import axios from "axios";
import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ColorModeSwitcher = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={`Switch to ${text} mode`}
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      {...props}
    />
  );
};

const Card = ({ title, description }) => <Box p='6' borderWidth='1px' borderRadius='lg'>
  <Box display='flex' alignItems='baseline'>
    <Box
      color='white.500'
      fontWeight='semibold'
      letterSpacing='wide'
      fontSize='xs'
      textTransform='uppercase'
      ml='2'
    >
      {title}
    </Box>
  </Box>
  <Box display='flex' mt='2' alignItems='center'>
    <Box as='span' ml='2' color='white.400' fontSize='sm'>
      {description}
    </Box>
  </Box>
</Box>

function App() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(10);
  const [stackDir, setStackDir] = useState('column');
  const [topic, setTopic] = useState('');
  const [data, setData] = useState([]);

  const onSearch = async () => {
    // Call Base API
    const ans = await axios.post('http://127.0.0.1:3000/', { text: query })
    // Then Print Suggested Topic
    setTopic(`Predicted Topic: ${ans.data.title}`)
    setRows(1);
    setStackDir('row');
    setData(ans.data.data);
  }
  return (
    <Box w="100vw" h="100vh" px="8px" >
      <Flex
        h="60px"
        w="100%"
        align="center"
        justify="space-between"
        className="nav"
      >
        <Flex>
          <Heading
            sx={{
              display: "inline-block",
            }}
            onClick={() => {
              setRows(10);
              setTopic('')
              setData([])
              setStackDir('column');
            }}
            fontSize={{ base: "24px", lg: "36px" }}
          >
            Research Helper
          </Heading>
        </Flex>
        <Flex>
          <Box w="2"></Box>
          <ColorModeSwitcher />
        </Flex>
      </Flex>
      <Flex
        direction={'column'}
        sx={{
          height: 'calc(100vh - 90px)',
          width: data.length ? '50%' : '60%',
          marginX: data.length ? '10%' : 'auto'
        }}
        justify={data.length ? 'start' : 'center'}
      >
        <Stack direction={stackDir} spacing={2}>
          <Textarea
            value={query}
            resize={'none'}
            rows={rows}
            placeholder={"Type your Abstract here..."}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ borderColor: 'white.700' }}
          />
          <Button onClick={onSearch}>Search</Button>
        </Stack>
        <Box h={4} />
        <Stack direction={'column'} spacing={2}>
          <Text fontSize={"20px"} padding={4}>{topic}</Text>
          {data.map(item => <Card title={item.title} description={item.snippet} />)}
        </Stack>
      </Flex>
    </Box >
  )
}

export default App
