import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io("http://localhost:4000");



function App() {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [name, setName] = useState("")
  const [submitName, setSubmitName] = useState("")

  useEffect(() => {
    socket.on("SMsg", (msg) => {
      setChat((prev) => [...prev, msg])
    })

    return () => {
      socket.off("SMsg")
    }
  }, [])

  const sendMessage = () => {
    socket.emit("CMsg", {
      "message": message,
      "name": name
    })

    setMessage("")
  }
  if (submitName) {
    return (
      <div className='chat-box'>

        <div className="all-message">
          {chat.map((v, i) => {
            return (
              <div className={name == v.name ? "own-message" : "other-message"}>
                <p className='user-name'>{v.name}</p>
                <p key={i}>{v.message}</p>
              </div>
            )
          })}
        </div>
        <div className="message-box">
          <div className="mini">
          <input placeholder='Type message here...' type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
          </div>
        </div>

      </div>
    )
  }
  else {
    return (
      <div className='name'>
        <div className="nameBox">
          <input type="text" placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={() => setSubmitName(name)}>Submit</button>

        </div>
      </div>
    )
  }
}

export default App
