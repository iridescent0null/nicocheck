import "./App.css";
import "./css/materialize.min.css";
import MovieList from './MovieList';
import logo from "./logo.svg";
import React, {setState,useState} from 'react';

function App(props) {
  const [username,setUsername] = useState('');
  const [list,setList] = useState('');
  const [offset,setOffset] = useState(0);
  const [existRight, setExsitRight] = useState(false);
  const [existLeft, setExistLeft] = useState(false);
  const handleSubmit = e =>{
    e.preventDefault();
    setOffset(0)
    search(0);
  };

  const handleCheck = e => {
    e.preventDefault();
    setOffset(0)
    searchSeekingAllItems();
  }

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

    fireAPI(username,offset+pageMove).then(function(value){      
      console.log({offset:offset,right:value.meta.totalCount-(offset+pageMove)*100});
      setExistLeft((offset+pageMove) > 0);
      setExsitRight((value.meta.totalCount-(offset+pageMove+1)*100) > 0);
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
  
  function searchSeekingAllItems(){
    //let alreadyCollectedItems;
    if (username === '') {
      alert('blank search is invalid!')
      return;
    }

    // first search
    fireAPI(username,0).then(function(value){ 
      if (value.meta.totalCount >1000) {
        alert("so many hits! ("+value.meta.totalCount + ") Getting statistics only initla 1000 items");
      }
      const results = [];
      results[0]=value.data;
      let alreadyConductedCount = 1;
      console.log(results);
      let intervalFunction;

      // while loop won't work here (using await is not valid)
      intervalFunction = setInterval (function() { 
      
        if (alreadyConductedCount > value.meta.totalCount/100 
        || alreadyConductedCount > 9) {
          // already done 
          clearInterval(intervalFunction);
          return;
        }

        fireAPI(username,alreadyConductedCount).then(function(innerValue){
          results.push(innerValue.data);
          alreadyConductedCount += 1;
          console.log({result:results,alreadyConductedCount:alreadyConductedCount});
        });

      },3000); // Kadokawa requires us to refrain promiscuous calls
  
    });

  };

  async function fireAPI(keyword,page) {
   return await fetch('https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q='+keyword+'&targets=title&_context=nicocheck&_sort=lastCommentTime&fields=title,viewCounter&_limit=100&_offset='+(page*100), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json());
  }
  return (
    <div className="App" role="main" class="container"> 
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
        <form class="row">
          <div class="col s12 row">
            <input class="col s12"  type="text" onChange={e => setUsername(e.target.value)}/>
            <input class="btn-small col s6" type="submit" value="browse!" onClick={handleSubmit}/>
            <input class="btn-small col s6" type="button" value="check!" onClick={handleCheck}/>
          </div>
        </form>
        <div>
          {new Date().toLocaleString()}
        </div>
          <input type="button" value="<" onClick={pagingLeft} disabled={!existLeft}/>
          <input type="button" value=">" onClick={pagingRight} disabled={!existRight}/>
        <React.StrictMode>
          <MovieList value={list}/>
        </React.StrictMode>
      </article>
    </div>
  );
};

export default App;
