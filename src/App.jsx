import "./App.css";
import logo from "./logo.svg";
import React, {setState,useState} from 'react';

function App(props) {
  const [username,setUsername] = useState('');
  const handleSubmit = e =>{
    e.preventDefault();
    const data = {
      username: username
    };
    alert(data.username);
    fireAPI().then(function(value){
      console.log(value);
    });
    
  };
  let customer;
  async function fireAPI() {
   return await fetch('https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=永劫譚&targets=title&_context=nicocheck&_sort=lastCommentTime', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify({
    //   q: '永劫譚',
    //   targets: 'title'
    // })
  }).then(res => res.json());
  }
  return (
    <div className="App" role="main">
      <article className="App-article">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Welcome to React!</h3>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <form>
            <input type="text" onChange={e => setUsername(e.target.value)}/>
            <input type="submit" value="check!" onClick={handleSubmit}/>
        </form>
        <div>
          {new Date().toLocaleString()}
        </div>
        <div>
          {customer}
        </div>
      </article>
    </div>
  );
};

export default App;
