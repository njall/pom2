import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var config = require('./config.json')


class Film extends React.Component{
    render(props){
        console.log(this.props)
      return (
        <div className="film">
            <div className="film-title">{this.props.film.Title}</div>
            <img className="film-poster" alt={this.props.film.Title} src={this.props.film.Poster}/>
        </div>
      )
    }
}


class FilmList extends React.Component{

    render(props){
        var suggestedFilms = [];
        console.log(this.props)
        this.props.films.map((film,i)=>{return suggestedFilms.push(
            <button key={i} onClick={this.props.loadFilmMethod.bind(this, film.imdbID)}>
                <div className="film">
                    <div className="film-title">{film.Title}</div>
                    <img className="film-poster" alt={film.Title} src={film.Poster}/>
                </div>
            </button>
        )})
        return (
            <div className="suggestions">
                <div>Which <em>{this.props.query}</em> did you mean?</div><br/>
                <div className="filmList">    
                    {suggestedFilms}
                </div>
            </div>
        )
    }
}

class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inputValue: '',
            searched: false,
            suggestedFilms: [],
            showResults: false,
            foundFilm: {}, 
            found: false        
        }
    }

    loadFilm(id){
        var queryEndpoint = 'http://www.omdbapi.com/'
            + '?apikey=' + config.apiKey 
            + '&i=' + id
            + '&type=movie' 
            + '&r=json'
            /*console.log(queryEndpoint)*/
        fetch(queryEndpoint)
            .then(res => res.json())
            .then(
                (result) => {       
                    console.log(result)
                    this.setState({
                        showResults: false,
                        suggestedFilms: [],
                        searched: false,
                        foundFilm: result,
                        found: true
                    })      
                }
            )
            
    }
    
    findFilms(evt){
        var queryEndpoint = 'http://www.omdbapi.com/'
            + '?apikey=' + config.apiKey 
            + '&s=' + this.state.inputValue 
            + '&type=movie' 
            + '&r=json'
            /*console.log(queryEndpoint)*/
        fetch(queryEndpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    var suggestedFilms = [];
                    var showResults = false;
                    if (result.Search !== undefined && Array.isArray(result.Search)){
                        if (result.Search.length > 1){
                            suggestedFilms = result.Search.slice(0,5)                            
                            showResults = true;
                            this.setState({
                                searched: true,
                                showResults: showResults,
                                suggestedFilms: suggestedFilms,
                                foundFilm: {},
                                found: false
                            })
                        } else if (result.Search.length === 1){
                            this.loadFilm(result.Search[0].imdbID)
                        }

                    }
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
        console.log(this.state.film)
      return (
        <div>
            <input
                className="input"
                value={this.state.inputValue} 
                onChange={evt=>this.updateInputValue(evt)}
             />
            <button className="search" onClick={()=>this.findFilms()}>Go!</button>
            
            {this.state.showResults ? <FilmList 
                                            loadFilmMethod={this.loadFilm.bind(this)}
                                            films={this.state.suggestedFilms} 
                                            query={this.state.inputValue}/> : null}
            {(this.state.suggestedFilms.length === 0 && this.state.searched) ? 
                <div>None found</div> : null}
            {this.state.found ? 
                            <Film film={this.state.foundFilm} /> : null}                
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



