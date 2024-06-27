import React, { useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { FormControl, IconButton, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from "../config/ChatLogics"
import { useState } from 'react';
import ProfileModal from "./miscellaneous/ProfileModal"
import { Input } from '@chakra-ui/react';
import axios from "axios"
import './styles.css'
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"

const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
        ChatState();

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const [newMessage, setNewMessage] = useState();

    const toast = useToast()

    const [socketConnected, setSocketConnected] = useState(false);

    const fetchMessages = async () => {


        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true);
            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            )
            //const decrypteddata=DoDecrypt(data)
            setMessages(data); // setMessages(decryptedata)
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
            console.log(messages);
        } catch (error) {
            toast({
                title: "Erorr Occurred",
                status: "error",
                description: "Failed to retrieve Messages",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    }



    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => {
            setSocketConnected(true);
        })
    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);


    useEffect(() => {
        socket.on('message received', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat) {

                //WHATEVER
            }
            setMessages([...messages, newMessageRecieved]);
        })
    })

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                setNewMessage("");
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                console.log(newMessage);
                console.log(user.token);
                const { data } = await axios.post('/api/message',
                    { content: newMessage, chatId: selectedChat._id }, config
                );

                console.log(data)

                socket.emit('new message', data);

                setMessages([...messages, data]);
            }
            catch (error) {
                console.log(error.message)
                toast({
                    title: "Erorr Occurred",
                    status: "error",
                    description: "Failed to send Message",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
        }
    }


    const typingHandler = (e) => {
        setNewMessage(e.target.value);

    }


    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w={"100%"}
                            fontFamily={"Arial"}
                            display={"flex"}
                            justifyContent={{ base: "space-between" }}
                            alignItems={"center"}

                        >
                            <IconButton display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {
                                <>
                                    {getSender(user, selectedChat.users

                                    )}
                                    <ProfileModal user={
                                        getSenderFull(user, selectedChat.users)
                                    } />
                                </>
                            }
                        </Text>
                        <Box
                            display={"flex"}
                            flexDirection="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {
                                loading ? (
                                    <Spinner
                                        size="xl"
                                        w={20}
                                        h={20}
                                        alignSelf="center"
                                        margin="auto" />
                                ) :
                                    (
                                        <div className='messages'>
                                            {<ScrollableChat messages={messages} />}
                                        </div>
                                    )
                            }
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) :
                    (
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            h="100%"
                        >
                            <Text fontSize={"3xl"} fontFamily={"Arial"}>
                                Click on a User to start Chatting
                            </Text>
                        </Box>
                    )
            }

        </>
    )
}

export default SingleChat
