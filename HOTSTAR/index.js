let form = document.querySelector('form');
let container = document.querySelector('#container');
let recombox = document.querySelector('#recombox');

let id;

async function searchMovies(value) {
   try {
      let url = `https://www.omdbapi.com/?s=${value}&apikey=acf15abd`;

      let res = await fetch(url);
      let data = await res.json();
      return data.Search;
   } catch (err) {
      console.log('err:', err);
   }
}

async function main() {
   let input = document.querySelector('#input').value;

   let res = searchMovies(input);
   let data = await res;

   appendSearch(data);
}

function appendSearch(movies) {

   recombox.style.display = 'block';

   recombox.innerHTML = null;
   if (movies === undefined) return;

   movies.forEach(function (el) {

      let recomdiv = document.createElement('div');
      recomdiv.setAttribute('class', 'recomdiv');
      recomdiv.onclick = function() {
         searchMovie(el);
      }

      let imgdiv = document.createElement('div');

      let img = document.createElement('img');
      img.src = el.Poster;

      imgdiv.append(img);
      
      let titlediv = document.createElement('div');

      let title = document.createElement('p');
      title.innerText = el.Title;

      let year = document.createElement('p');
      year.innerText = el.Year;

      titlediv.append(title, year);

      recomdiv.append(imgdiv, titlediv);
      recombox.append(recomdiv);
   })

}

async function searchMovie(el) {
   try {
      container.innerHTML = null;

      let url = `https://www.omdbapi.com/?i=${el.imdbID}&apikey=acf15abd`;
      
      let res = await fetch(url);
      let data = await res.json();

      displayData(data);
   } catch (err) {
      console.log(err);
   }
}

function debounceFunction(main, delay) {

   if (id) clearTimeout(id);

   id = setTimeout(function () {
      main();
   }, delay);
}

form.addEventListener('submit', function (event) {
   event.preventDefault();

   container.innerHTML = null;
   let input = form.input.value;

   let url = `https://www.omdbapi.com/?t=${input}&apikey=acf15abd`;

   fetch(url)
      .then(function (res) {
         res.json()
            .then(function (res) {
               displayData(res);
            })
      })
      .catch(function (err) {
         displayError(err);
      })

});

function displayData(data) {

   recombox.style.display = 'none';

   if (data.Response === 'False') {
      displayError();
      return;
   }


   let top = document.createElement('div');
   top.setAttribute('id', 'top');

   let title = document.createElement('p');
   title.innerText = `${data.Title} - ${data.Year}`;

   top.append(title);


   let bottom = document.createElement('div');
   bottom.setAttribute('id', 'bottom');


   let left = document.createElement('div');
   left.setAttribute('id', 'left');

   let img = document.createElement('img');
   img.src = data.Poster;

   left.append(img);


   let right = document.createElement('div');
   right.setAttribute('id', 'right');


   let up = document.createElement('div');
   up.setAttribute('id', 'up');

   let logo = document.createElement('img');
   logo.src = 'https://cdn.freebiesupply.com/images/large/2x/imdb-logo-transparent.png';

   let rating = document.createElement('p');
   rating.innerText = `${data.Ratings[0].Value} Out of ${data.imdbVotes} Votes`;

   let recommended;

   if (+(data.imdbRating) > 8.5) {

      recommended = document.createElement('p');
      recommended.setAttribute('id', 'recom');
      recommended.innerText = 'Recommended';

   }

   up.append(logo, rating, recommended || '');


   let mid = document.createElement('div');
   mid.setAttribute('id', 'mid');

   let plotDiv = document.createElement('div');

   let plotSpan = document.createElement('span');
   plotSpan.innerText = 'Plot : ';

   let plot = document.createElement('p');
   plot.innerText = data.Plot;

   plotDiv.append(plotSpan, plot);

   let genreDiv = document.createElement('div');

   let genreSpan = document.createElement('span');
   genreSpan.innerText = 'Genre : ';

   let genre = document.createElement('p');
   genre.innerText = data.Genre;

   genreDiv.append(genreSpan, genre);

   let languageDiv = document.createElement('div');

   let languageSpan = document.createElement('span');
   languageSpan.innerText = 'Language : ';

   let language = document.createElement('p');
   language.innerText = data.Language;

   languageDiv.append(languageSpan, language);

   mid.append(plotDiv, genreDiv, languageDiv);


   let down = document.createElement('div');
   down.setAttribute('id', 'down');

   let directorDiv = document.createElement('div');

   let directorSpan = document.createElement('span');
   directorSpan.innerText = 'Director : ';

   let director = document.createElement('p');
   director.innerText = data.Director;

   directorDiv.append(directorSpan, director);

   let actorsDiv = document.createElement('div');

   let actorsSpan = document.createElement('span');
   actorsSpan.innerText = 'Actors : ';

   let actors = document.createElement('p');
   actors.innerText = data.Actors;

   actorsDiv.append(actorsSpan, actors);

   down.append(directorDiv, actorsDiv);
   right.append(up, mid, down);
   bottom.append(left, right);
   container.append(top, bottom);

}

function displayError() {

   let error = document.createElement('img');
   error.setAttribute('id', 'error');
   error.src = 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif';

   container.append(error);

}

window.onclick = function(event) {

   let input = document.getElementById('input');

   if(event.target != input) {
      recombox.style.display = 'none';
   }
}