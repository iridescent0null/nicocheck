import "./App.css";
import MovieList from './MovieList';
import logo from "./logo.svg";
import React, {setState,useState} from 'react';

function App(props) {
  const [username,setUsername] = useState('');
  const [list,setList] = useState('');
  const [offset,setOffset] = useState(0);
  const handleSubmit = e =>{
    e.preventDefault();
    setOffset(0)
    search(0);
  };
  /**
  * 
  * @param {*} pageMove when paging to right, should be +1. when left, -1.
  * @returns 
  */
  function search(pageMove){
    if (username === '') {
      alert('blank search is invalid!')
      return;

    }
    //setOffset(offset);
    fireAPI(username,offset+pageMove).then(function(value){      
      console.log({offset:offset});
      setList(value.data.map(item => (
        <div key={item.title}>
          <p>{item.title}</p>
          <p>再生数: {item.viewCounter}</p>
        </div>
      )))
    });
  }

  const pagingRight = e =>{
    e.preventDefault();
    // attempts to change state to use it immediately cannot be achived,
    // therefore change the state it after using it with manual change
    search(+1);
    setOffset(offset+1);
  }
  const pagingLeft = e =>{
    e.preventDefault();
    search(-1);
    setOffset(offset-1);
  }
  let customer;
  async function fireAPI(keyword,page) {
    let jsons = [];
   return await fetch('https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q='+keyword+'&targets=title&_context=nicocheck&_sort=lastCommentTime&fields=title,viewCounter&_limit=100&_offset='+(page*100), {
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
          <input type="button" value="<" onClick={pagingLeft}/>
          <input type="button" value=">" onClick={pagingRight}/>
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
