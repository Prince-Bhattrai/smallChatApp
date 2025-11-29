import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [name, setName] = useState("");
  const [submitName, setSubmitName] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    socket.on("SMsg", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => socket.off("SMsg");
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const sendMessage = () => {
    if (!message) return;

    socket.emit("CMsg", {
      message,
      name,
    });

    setMessage("");
  };

  const sendLike = () => {
    socket.emit("CMsg", {
      message: "❤️",
      name,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (message) sendMessage();
      else sendLike();
    }
  };

  if (submitName) {
    return (
      <div className="chat-box">
        <div className="all-message">
          {chat.map((v, i) => (
            <div
              key={i}
              className={name === v.name ? "own-message" : "other-message"}
            >
              <p className="user-name">{v.name}</p>
              <p>{v.message}</p>
            </div>
          ))}

          <div ref={scrollRef}></div>
        </div>

        <div className="message-box">
          <div className="mini">
            <input
              placeholder="Type message here..."
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            {message ? (
              <button onClick={sendMessage}>Send</button>
            ) : (
              <button onClick={sendLike}>❤️</button>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="name">
        <div className="nameBox">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => setSubmitName(name)}>Add Name</button>
        </div>
      </div>
    );
  }
}

export default App;
