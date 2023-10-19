const API_KEY = "e97ed140-3ed8-408f-8d1e-59c567357ada";
const API_URL =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=FILM&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1";
const API_URL_SEARCH =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_BY_ID =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL);

const KEYS = {
    ESCAPE: 27,
};

async function getMovies(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });

    const data = await response.json();

    console.log(data);

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
        movieCard.addEventListener("click", () => openModal(movie.kinopoiskId));
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
            movieCard.addEventListener("click", () => openModal(movie.filmId));
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

//modal

const modalElement = document.querySelector(".modal");

async function openModal(idMovie) {
    const dataIdMovie = await fetch(API_URL_MOVIE_BY_ID + `${idMovie}`, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    }).catch((err) => new Error(err));

    const data = await dataIdMovie.json();
    console.log(data);

    modalElement.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");
    modalElement.innerHTML = `
        <div class="modal__card">
            <img class="modal__movie-img" src="${data.posterUrl}" alt="">
            <h2>
                <span class="modal__movie-title">${data.nameRu}</span>
                <span class="modal__movie-release-year">(${data.year})</span>
            </h2>
            <ul class="modal__movie-info">
                <div class="loader"></div>
                ${
                    data.genres.length
                        ? `<li class="modal__movie-genre">${getMovieGenre(
                              data.genres
                          )}</li>`
                        : ""
                }
                ${
                    data.filmLength
                        ? `<li class="modal__movie-overview">${getMovieTime(
                              data.filmLength
                          )}</li>`
                        : ""
                }
                <li>Сайт: <a href="${data.webUrl}" class="modal__movie-site">${
        data.webUrl
    }</a></li>
               ${
                   data.description
                       ? `<li class="modal__movie-overview">
                           ${data.description}
                       </li>`
                       : ""
               }
            </ul>
            <button type="button" class="modal__button-close">Закрыть</button>
        </div>
    `;

    document
        .querySelector(".modal__button-close")
        .addEventListener("click", closeModal);
}

function closeModal() {
    modalElement.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
}

function getMovieGenre(genres) {
    return `${genres.length === 1 ? "Жанр:" : "Жанры:"} ${genres.map(
        (movie) => ` ${movie.genre}`
    )}`;
}

function getMovieTime(minutes) {
    const times = Number((minutes / 60).toFixed(2));
    if (times < 1) {
        return minutes + " мин";
    }
    if (times === 1) {
        return `${parseInt(times)}ч`;
    }
    return `${parseInt(times)}ч ${minutes - parseInt(times) * 60}м`;
}

window.addEventListener("click", (event) => {
    // console.log(event.target);
    if (event.target === modalElement) {
        closeModal();
    }
});

window.addEventListener("keydown", (e) => {
    // console.log(e.keyCode);
    if (e.keyCode === KEYS.ESCAPE) {
        closeModal();
    }
});
