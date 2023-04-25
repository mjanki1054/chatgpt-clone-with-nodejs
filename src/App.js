import { FaTrashAlt, FaCrown, FaSignOutAlt } from "react-icons/fa";
import { TbSettings } from "react-icons/tb";
import { ImUserTie } from "react-icons/im";
import { useState, useEffect } from "react";
import { FiMessageSquare } from "react-icons/fi";
// import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  // const [users, setUsers] = useState([]);

  const createNewChat = () => {
    setMessage(null);
    setValue("")
    setCurrentTitle(null);
  };
  const handleClick =(uniqueTitle)=>{
    setCurrentTitle(uniqueTitle);
    setValue("");
    setMessage(null);
  
  }
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8800/completions",
        options
      );
      const data = await response.json();
      const result = data.choices[0].message;
      setMessage(result);
      // setValue("");
      console.log(result);
      
    } catch (error) {
      console.error(error);
      console.log("you have got an error bro");
    }
   
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle, value]);

 
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li className="history-data" key={index} onClick={ ()=> handleClick(uniqueTitle)}> <FiMessageSquare/> {uniqueTitle}</li>
          ))}
        </ul>
        <nav>
        {/* <button><FaTrashAlt /> Clear conversations</button> */}
          <p>
            <FaTrashAlt /> Clear conversations
          </p>
          <p>
            <FaCrown /> Upgrade to plus
          </p>
          <p>
            <TbSettings /> Settings
          </p>
          <p>
            <ImUserTie /> Get help
          </p>
          <p>
            <FaSignOutAlt /> Log out
          </p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1 style={{color:'black'}}>Chat-GPT</h1>}
        <ul className="feed">

{currentChat?.map((chatMessage, index) => (
  <li key={index} className={chatMessage.role === 'user' ? 'question' : 'answer'}>
    <p className="role">{chatMessage.role}</p>
    <p>{chatMessage.content}</p>
  </li>
))}

        
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input className="input-value" name="question" value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>

          <p className="info">
            ChatGPT Mar 23 Version. Free Research Preview. ChatGPT may produce
            inaccurate information about people, places, or facts.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;