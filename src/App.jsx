
import './App.css'
import io from 'socket.io-client'
import { useState } from 'react'
import Chat from "./Chat";
import { Container, Divider,Form,Icon,Card,Button } from 'semantic-ui-react'

const socket = io.connect("http://localhost:3001")
function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    let sala={
      username:username,
      room:room
    }
    if (username !== "" && room !== "") {
      socket.emit("join_room", sala)//el join_room es el nombre de evento que va a recoger el servidor
      //le envio room
      setShowChat(true)
    }

  }

  return (

    <Container>
      

      <div className='joinChatContainer'>

        
        
        

      </div>
      {
        !showChat ? (
          <Card fluid>
        <Card.Content header='Unirme al chat' />
        <Card.Content>
          <Form>
            <Form.Field>
              <label>Username</label>
              <input type="text" placeholder='Daniel...' onChange={(e) => setUsername(e.target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Sala</label>
              <input type="text" placeholder='Sala ID...' onChange={(e) => setRoom(e.target.value)} />
            </Form.Field>
            
            <Button type='submit' onClick={joinRoom}>Unirme</Button>
          </Form>
        </Card.Content>
        <Card.Content extra>
          <Icon name='user' />4 Friends
        </Card.Content>
      </Card>
        ):(
          <Chat socket={socket} username={username} room={room} />
        )
      }
      

    </Container>

  )
}

export default App
