const API_KEY = "e97ed140-3ed8-408f-8d1e-59c567357ada";
const API_URL =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=FILM&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1";
const API_URL_SEARCH =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
getMovies(API_URL);

async function getMovies(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });

    const data = await response.json();

    // console.log(data);

    if (data.hasOwnProperty("items")) {
        showMovies(data);
    } else if (data.hasOwnProperty("films")) {
        showSearchedMovies(data);
    }
}

function getClassByRate(movieRate) {
    if (movieRate > 7) {
        return "green";
    } else if (movieRate > 5) {
        return "orange";
    }
    return "red";
}

function checkCorrectRate(rate) {
    if (rate.ratingImdb === null && rate.ratingKinopoisk === null) {
        return 0;
    }

    if (rate.ratingImdb !== null) {
        return rate.ratingImdb;
    }

    return rate.ratingKinopoisk;
}

function showMovies(data) {
    const moviesElement = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";

    data.items.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie");
        movieCard.innerHTML = `
                <div class="movie">
                    <div class="movie__cover-inner">
                        <img class="movie__cover-img"
                            src="${movie.posterUrl}"
                            alt="">
                        <div class="movie__cover--darkened"></div>
                    </div>
                    <div class="movie__info">
                        <div class="movie__title">${movie.nameRu}</div>
                        <div class="movie__category">${movie.genres.map(
                            (genre) => ` ${genre.genre}`
                        )}</div>
                        <div class="movie__average movie__average--${getClassByRate(
                            checkCorrectRate(movie)
                        )}">${checkCorrectRate(movie)}</div>
                    </div>
                </div>
        `;
        moviesElement.appendChild(movieCard);
    });
}

function showSearchedMovies(data) {
    const moviesElement = document.querySelector(".movies");
    console.log(data.films);
    document.querySelector(".movies").innerHTML = "";

    data.films
        .filter((film) => film.rating != "null")
        .forEach((movie) => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie");
            movieCard.innerHTML = `
                        <div class="movie">
                            <div class="movie__cover-inner">
                                <img class="movie__cover-img"
                                    src="${movie.posterUrl}"
                                    alt="">
                                <div class="movie__cover--darkened"></div>
                            </div>
                            <div class="movie__info">
                                <div class="movie__title">${movie.nameRu}</div>
                                <div class="movie__category">${movie.genres.map(
                                    (genre) => ` ${genre.genre}`
                                )}</div>
                                <div class="movie__average movie__average--${getClassByRate(
                                    movie.rating
                                )}">${movie.rating}</div>
                            </div>
                        </div>
                `;
            moviesElement.appendChild(movieCard);
        });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH + search.value}`;
    getMovies(apiSearchUrl);
    search.value = "";
});
