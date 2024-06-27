import React from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useEffect } from 'react'

const Homepage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) { history.push("/chats") };

  }, [history]);


  return (
    <Container maxW='xl'>
      <Box
        display='flex'
        bg={'white'}
        p={'3'}
        justifyContent={'center'}
        alignItems={'center'}
        w={'100%'}
        m={'10px 0 15px 0'}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >
        <Text
          fontWeight={'bold'}
          fontSize={'x-large'}
          fontFamily={'Open Sans'}
          color={'gray'}
        >
          Information Security Project
        </Text>
      </Box>


      <Box
        bg={'white'}
        w={'100%'}
        p={'4'}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >

        <Tabs variant='soft-rounded' colorScheme='blue'>
          <TabList mb={'1em'}>
            <Tab width={'50%'}>Sign Up</Tab>
            <Tab width={'50%'}>Login</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SignUp>
              </SignUp>
            </TabPanel>
            <TabPanel>
              <Login></Login>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box
        display='flex'
        bg={'white'}
        opacity={"75%"}
        p={'1'}
        justifyContent={'center'}
        alignItems={'center'}
        w={'100%'}
        m={"10px auto"}
        borderRadius={'lg'}
      >
        <Text
          fontWeight={'500'}
          fontSize={'x-large'}
          fontFamily={'Open Sans'}
          color={'gray'}
        >
          Wardah | Junaid | Muteeb
        </Text>
      </Box>

    </Container>
  )
}

export default Homepage
