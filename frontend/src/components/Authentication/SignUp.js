import React, { useState } from 'react'
import { Button, FormControl, FormLabel, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { Input, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from "react-router-dom"

const SignUp = () => {
    const [show, setShow] = useState(false);

    const handleClick = () => { setShow(!show); }

    const [name, setName] = useState();

    const [email, setEmail] = useState();

    const [confirmpassword, setConfirmPassword] = useState();

    const [password, setPassword] = useState();

    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const history = useHistory();

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !password || !confirmpassword || !email) {
            toast({
                title: "Fill all the fields",
                isClosable: true,
                position: "bottom",
                status: "warning",
                duration: 5000
            })
            setLoading(false);
            return;
        }
        else {
            if (password !== confirmpassword) {
                toast({
                    title: "Passwords do NOT match",
                    isClosable: true,
                    position: "bottom",
                    status: "warning",
                    duration: 5000
                })
                setLoading(false);
                return;
            }
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            };

            //entering data in database
            const { data } = await axios.post("/api/user", { name, email, password }, config);
            toast({
                title: "Registration Successful!",
                isClosable: true,
                position: "bottom",
                status: "success",
                duration: 5000
            });

            history.push("/chats");
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Ocurred!",
                isClosable: true,
                position: "bottom",
                status: "error",
                duration: 5000
            });
            setLoading(false);
        }

    }

    return (
        <VStack spacing={'10px'}>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Name'
                    onChange={(e) => setName(e.target.value)}>
                </Input>
            </FormControl>

            <FormControl id='semail' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}>
                </Input>
            </FormControl>

            <FormControl id='spassword' isRequired>
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

            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}>
                    </Input>
                    <InputRightElement width="4.5rem">
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick} >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <Button mt={'5'} colorScheme='blue' width={'100%'} p={'1.5rem'} onClick={submitHandler} isLoading={loading}>Sign Up</Button>
        </VStack>
    )
}

export default SignUp
