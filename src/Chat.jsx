import React, { useEffect } from "react";
import { useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Container, Divider, Form, Icon, Card, Button,Input, Message } from 'semantic-ui-react'
const chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [friend,setFriend] = useState(1);
    const sendMessage = async () => {
        if (currentMessage !== "" && username) {
            const info = {
                message: currentMessage,
                author: username,
                room: room,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }

            await socket.emit("send_message", info)
            setMessageList((list) => [...list, info])
            setCurrentMessage("");
        }
    }
    useEffect(() => {
        const messageHandle=(data)=>{
            setMessageList((list)=>[...list, data])
        }
        socket.on("receive_message", messageHandle)
        
        socket.on("room_users_count", data => {
            setFriend(data.usersCount)
            console.log(`En la sala ${data.room} hay ${data.usersCount} usuarios.`);
            // Actualiza el front-end para mostrar la cantidad de usuarios en la sala.
        });
        return ()=>socket.off("receive_message", messageHandle)//limpiamos que no haga 2 veces la llamada
    }, [socket])
    return (
        <>
            <Card fluid>
                <Card.Content header={`Chat en vivo | Sala ${room}`}/>
                    <ScrollToBottom>
                <Card.Content style={{height: "400px", padding: "5px"}}>

                
                    {
                        messageList.map((item) => {
                            return (
                <span key={item.time}> 

                    <Message style={{textAlign:username===item.author?'right':'left'
                    
                }}
                        success={username===item.author}
                        info={username!==item.author}
                >
                        <Message.Header>{item.message}</Message.Header>
                        <p>Enviado por {item.author} a las<i>{item.time}</i></p>
                        
                    </Message>
                    <Divider/>
                </span>
                        )
                    })
                    }
                </Card.Content>
                    </ScrollToBottom>
                <Card.Content extra>
                    <Form>

                    <Form.Field>
                <Input
                action={
                    {
                        color: 'teal',
                        labelPosition: 'right',
                        icon: 'send',
                        content: 'Enviar',
                        onClick: sendMessage
                    }
                }
                value={currentMessage}
                type="text" placeholder="Mensaje..."
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            sendMessage()
                        }
                    }}
                    />
                    </Form.Field>
                    </Form>
                    <Icon name='user' />{friend}
                </Card.Content>
            </Card>
        </>
    );
}

export default chat;