import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var config = require('./config.json')

function Film(props){
      return (
        <div className="Film">
            <div className="film-title">Title: {props.film.Title}</div>
            <img className="film-poster" src={props.film.Poster}/>
        </div>
      )
}


class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inputValue: '',
            searched: false,
            /* Film Stuffz */
            film: {}
        }
    }

    renderResults(){
        console.log(this.state)
        const { error, searched, film } = this.state;
        if (!searched) {
          return <div>Type in a film to begin</div>;
        } else if (error) {
          return <div>Error: {error.message}</div>;
        } else if (film === null || film === {}) {
            return <div> Film Not Found</div>
        } else {
            return <Film film={this.state.film}/>
        }        
    }

    findFilm(evt){
        var queryEndpoint = 'http://www.omdbapi.com/'
            + '?apikey=' + config.apiKey 
            + '&s=' + this.state.inputValue 
            + '&type=movie' 
            + '&r=json'
            console.log(queryEndpoint)
        fetch(queryEndpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    var film;
                    if (result.Search !== undefined
                      && Array.isArray(result.Search)
                      && result.Search.length > 0){
                        film = result.Search[0]
                    } else {
                        film = null
                    }
                    console.log(film)
                    this.setState({
                        searched: true,
                        film: film
                    })
                },
                (error) => {
                    this.setState({
                        searched: true,
                        error
                    });
                }
            )
    }

    render(){
      return (
        <div>
            <input
                className="input"
                value={this.state.inputValue} 
                onChange={evt=>this.updateInputValue(evt)}
             />
            <button className="search" onClick={()=>this.findFilm()}>Go!</button>
            
            {this.renderResults()}
        </div>
      )
  }

  updateInputValue(evt){
    this.setState({
      inputValue: evt.target.value
    });    
  }
}

function App(){

        console.log(config)
  return (

    <div>
        <h1>Pretentious-o-Meter 2.0</h1>
        <Search /> 
    </div>
    )   
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);



