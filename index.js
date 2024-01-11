const key = "9cc969683fe1467f86f9d3914dfc5f9b";
const url = `https://api.rawg.io/api/games?key=${key}&dates=2023-01-01,2024-01-01&ordering=-added`;
const urlGenre = `https://api.rawg.io/api/genres?key=${key}&ordering=-added`;
let nextGameListUrl = null;
let games = [{}];

const getGenresStr = (genres) => {
  const allGenres = genres.map((each) => each.name).join(", ");
  return allGenres;
};

const getStoresStr = (stores) => {
  const allStores = stores.map((each) => each.store.name).join(", ");
  return allStores;
};

const getPlatformsStr = (platforms) => {
  const allPlatforms = platforms.map((each) => each.platform.name).join(", ");
  return allPlatforms;
};

function saveGame(element) {
  if (element === "this") {
    element = event.currentTarget;
  }

  const gameId = $(element).data("id");
  const gameData = games.filter((game) => gameId === game.id);
  localStorage.setItem("game", JSON.stringify(gameData));
  window.location.href = "./game-page.html";
}

function loadGames(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      nextGameListUrl = data.next ? data.next : null;
      games = data.results;
      games.forEach((game) => {
        const gameItemEl = $(`<div class="card" style="width: 18rem">
        <img
          src="${game.background_image}"
          class="card-img-top"
          alt="${game.name}"
        />
        <div class="card-body">
          <div class="title-and-rating">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text"><i class="ph ph-star"></i> ${game.rating}</p>
          </div>
          <div class="game-details mt-3">
          <i class="ph ph-game-controller"></i>
            <p class="card-text genre">
               ${getGenresStr(game.genres)}
              </p>
          </div>

          <a href="#" class="btn btn-primary shop-button mt-5" data-id=${
            game.id
          }
          onClick=saveGame(this)
            >Comprar <i class="ph ph-shopping-cart"></i
          ></a>
        </div>
      </div>`);
        gameItemEl.appendTo($("#card-wrapper"));
      });
      if (nextGameListUrl) {
        $(".more-games").removeClass("finished");
      } else {
        $(".more-games").addClass("finished");
      }
    })
    .catch((error) => {
      console.log("an error ocurred :(", error);
    });
}

function getGamesByGenre(id) {
  $("#card-wrapper").html("");
  if ($(".genre-checkbox:checked").length > 0) {
    const urlQuery = `https://api.rawg.io/api/games?key=${key}&ordering=-added&genres=${id}`;
    console.log(id);
    fetch(urlQuery)
      .then((response) => response.json())
      .then((data) => {
        const gamesByGenreId = data.results;
        console.log(gamesByGenreId);

        gamesByGenreId.forEach((game) => {
          const gameItemEl = $(`<div class="card" style="width: 18rem">
        <img
          src="${game.background_image}"
          class="card-img-top"
          alt="${game.name}"
        />
        <div class="card-body">
          <div class="title-and-rating">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text"><i class="ph ph-star"></i> ${game.rating}</p>
          </div>
          <div class="game-details mt-3">
          <i class="ph ph-game-controller"></i>
            <p class="card-text genre">
               ${getGenresStr(game.genres)}
              </p>
          </div>

          <a href="#" class="btn btn-primary shop-button mt-5" data-id=${
            game.id
          }
          onClick=saveGame(this)
            >Comprar <i class="ph ph-shopping-cart"></i
          ></a>
        </div>
      </div>`);
          gameItemEl.appendTo($("#card-wrapper"));
        });
      });
  } else {
    loadGames(url);
  }
}

function getGenres(urlGenre) {
  fetch(urlGenre)
    .then((response) => response.json())
    .then((data) => {
      const genres = data.results;

      genres.forEach((genre) => {
        const genreItemEl = $(`<div class="genre-check">
    <label for="${genre.slug}">${genre.name}</label>
    <input type="checkbox" class="genre-checkbox" name="${genre.slug}" id="${genre.id}" onclick="getGamesByGenre(${genre.id})">
</div>`);
        genreItemEl.appendTo($("#advaced-search"));
      });
    });
}

function searchByName(game) {
  urlQuery = `https://api.rawg.io/api/games?key=${key}&search="${game}"&ordering=-added`;
  $("#card-wrapper").html("");
  fetch(urlQuery)
    .then((response) => response.json())
    .then((data) => {
      const gamesByGenreId = data.results;
      console.log(gamesByGenreId);

      gamesByGenreId.forEach((game) => {
        const gameItemEl = $(`<div class="card" style="width: 18rem">
        <img
          src="${game.background_image}"
          class="card-img-top"
          alt="${game.name}"
        />
        <div class="card-body">
          <div class="title-and-rating">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text"><i class="ph ph-star"></i> ${game.rating}</p>
          </div>
          <div class="game-details mt-3">
          <i class="ph ph-game-controller"></i>
            <p class="card-text genre">
               ${getGenresStr(game.genres)}
              </p>
          </div>

          <a href="#" class="btn btn-primary shop-button mt-5" data-id=${
            game.id
          }
          onClick=saveGame(this)
            >Comprar <i class="ph ph-shopping-cart"></i
          ></a>
        </div>
      </div>`);
        gameItemEl.appendTo($("#card-wrapper"));
      });
    });
}

function createPage() {
  const localGame = JSON.parse(localStorage.getItem("game"));
  const game = localGame[0];
  console.log(game);
  $("#game-title").html(game.name);
  // prettier-ignore
  $("#thumb").attr("src", `${game.background_image}`);
  $("#first-thumb").attr("src", game.short_screenshots[4].image);
  game.short_screenshots.forEach((screenshot) => {
    const screenshotEl = $(`  <div class="carousel-item">
    <img src=${screenshot.image}>
    </div>`);
    screenshotEl.appendTo($("#screenshots-display"));
  });
  $("#rating").html(
    $(`<i class="ph ph-star"></i> <span>${game.rating}</span>`)
  );
  $("#genres").html(
    $(`
  <i class="ph ph-game-controller"></i> <span>${getGenresStr(
    game.genres
  )}</span>`)
  );
  $("#stores").html(
    $(`
  <i class="ph ph-storefront"></i> <span>${getStoresStr(game.stores)}</span>`)
  );
  $("#platforms").html(
    $(`
  <i class="ph ph-desktop"></i> <span>${getPlatformsStr(
    game.platforms
  )}</span>`)
  );
}

getGenres(urlGenre);

loadGames(url);
