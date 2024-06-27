import React, { useState } from 'react'
import { Button, FormControl, FormLabel, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { Input, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from "react-router-dom"

const Login = () => {
    const [show, setShow] = useState(false);

    const [password, setPassword] = useState();

    const [email, setEmail] = useState();

    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const history = useHistory();


    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Fill ALL the fields",
                status: "warning",
                isClosable: true,
                position: "bottom",
                duration: 5000
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("/api/user/login", { email, password }, config);
            toast({
                title: "Login Successful!",
                isClosable: true,
                position: "bottom",
                status: "success",
                duration: 5000
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            history.push("/chats")
        } catch (error) {
            toast({
                title: "Error!",
                isClosable: true,
                position: "bottom",
                status: "error",
                duration: 5000
            });
            setLoading(false);
            return;
        }
    }

    const handleClick = () => { setShow(!show); }



    return (

        <VStack spacing={'10px'}>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}>
                </Input>
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'}
                        placeholder='Enter Password'
                        onChange={(e) => setPassword(e.target.value)}>
                    </Input>
                    <InputRightElement width="4.5rem">
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick} >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button mt={'5'} colorScheme='blue' width={'100%'} p={'1.5rem'} isLoading={loading} onClick={submitHandler}>Login</Button>

        </VStack>

    )
}

export default Login
