import "./App.css";
import MovieList from './MovieList';
import logo from "./logo.svg";
import React, {setState,useState} from 'react';

function App(props) {
  const [username,setUsername] = useState('');
  const [list,setList] = useState('');
  const handleSubmit = e =>{
    e.preventDefault();
    const data = {
      username: username
    };
    
    if (data.username === '') {
      alert('blank search is invalid!')
      return;

    }
    fireAPI(data.username,0).then(function(value){
      setList(value.data.map(item => (
        <div key={item.title}>
          <p>{item.title}</p>
          <p>再生数: {item.viewCounter}</p>
        </div>
      )))
    });
    
  };
  let customer;
  async function fireAPI(keyword,offset) {
    let jsons = [];
   return await fetch('https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q='+keyword+'&targets=title&_context=nicocheck&_sort=lastCommentTime&fields=title,viewCounter&_limit=100&_offset='+offset, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
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
        <React.StrictMode>
    <MovieList value={list}/>
  </React.StrictMode>
      </article>
    </div>
  );
};

export default App;
