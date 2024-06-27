import React from "react";
import { Button, IconButton, useDisclosure, Text } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>
                        {children}
                    </span>
                ) : (
                    <IconButton
                        display={{ base: "flex" }}
                        icon={<ViewIcon />}
                        onClick={onOpen}
                    />
                )
            }


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"40px"}
                        fontFamily={"Arial"}
                        display={"flex"}
                        justifyContent={"center"}
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text
                            align={"center"} fontSize={"xl"}>
                            Email : {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
