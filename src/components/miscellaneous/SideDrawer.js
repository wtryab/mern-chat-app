import React, { useState } from 'react'
import { Text } from "@chakra-ui/layout";
import { Tooltip, MenuButton, Menu, MenuList, Box, Avatar, MenuItem, MenuDivider, useDisclosure, useToast, Spinner } from "@chakra-ui/react"
import { Button } from "@chakra-ui/button";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input
} from '@chakra-ui/react'

import ChatLoading from '../ChatLoading';
import axios from "axios"
import UserListItem from '../userAvatar/UserListItem';
const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const history = useHistory();
    const { user, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Search field can not be empty",
                status: "warning",
                duration: 5000,
                isClosable: true
                , position: "top-left"
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: "Error Occurred",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                position: "bottom-left",
                isClosable: true
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.post('/api/chat', { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false)
            onClose();

        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                position: "bottom-left",
                isClosable: true
            })
        }
    }

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Arial" fontWeight={"600"}>
                    ISF PROJECT
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon />
                            <MenuList></MenuList>
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p={1}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>

                            </ProfileModal>
                            <MenuDivider />

                            <MenuItem onClick={logoutHandler}>
                                Log Out
                            </MenuItem>
                        </MenuList>
                    </Menu>

                </div>
            </Box>

            <Drawer Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
                    <DrawerBody>

                        <Box display={"flex"} pb={2}>
                            <Input placeholder='Search by Name or Email' value={search}
                                mr={2}
                                onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />

                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>


            </Drawer>
        </>
    )
}

export default SideDrawer
