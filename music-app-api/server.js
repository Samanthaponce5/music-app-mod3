
const artistHeader = document.querySelector(".artistHeader")
const albumList = document.querySelector(".albumList")
const searchForm = document.querySelector(".artist_search")
const albumContainer = document.querySelector(".album-container")
const favoritesContainer = document.querySelector(".favorites-container")
const favoritesList = document.querySelector(".favorites-list")
const favoritesHeader = document.createElement("h4")

//listener for the form where a user can submit an artist
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target[0].value
  getArtist(name)
})

// function to get artist from the RAILS API
function getArtist(artistName){
  fetch(`http://localhost:3000/api/v1/artist?q=${artistName}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    }
    })
    .then(response => response.json())
    .then(artists => renderArtist(artists.artists.items[0]))
    // console.log(artists)
    // 
}

//function to put the artist on the page
function renderArtist(artist){
  let artistDiv = document.createElement("div")
  let h1 = document.createElement("h1")
  let getButton = document.createElement("button")
  artistDiv.className = "artistDiv"
  h1.textContent = `name: ${artist.name}`
  h1.dataset.id = artist.id
  getButton.textContent = "Get Albums"
  getButton.className = "albums-button"
  getButton.dataset.artistId = artist.id
  artistHeader.append(h1, getButton)
  // console.log (artist.id)
}

// listener for button click on get albums
artistHeader.addEventListener("click", (e) => {
  if (e.target.className === "albums-button"){
    getAlbums(e.target.dataset.artistId)
  }
})

// send request to the rails API to get data
function getAlbums(artistId){
  console.log(artistId)
  fetch(`http://localhost:3000/api/v1/albums?id=${artistId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
    })
    .then(response => response.json())
    .then(albums => renderAlbums(albums.items))
}

//render Albums to the page
function renderAlbums(albums){
  albums.forEach(album => {
    let ul = document.createElement("ul")
    ul.dataset.id = album.id
    ul.className = "album"
    ul.textContent = `Title: ${album.name}`
    ul.dataset.uri = album.uri
    albumList.append(ul)
    
  });
}
//click listener to show album player
albumList.addEventListener("click", (e) =>{
  if (e.target.className === "album"){
    albumContainer.innerHTML = ""
    let albumId = e.target.dataset.id
    albumContainer.innerHTML = `<iframe src="https://open.spotify.com/embed/album/${albumId}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
    getTracks(albumId)
  }
})

// get tracks from the Rails API
function getTracks(albumId){
  console.log(albumId)
  fetch(`http://localhost:3000/api/v1/tracks?id=${albumId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
    })
    .then(response => response.json())
    .then(tracks => renderTracks(tracks))
    // console.log(tracks)
}

// render tracks to the DOM
function renderTracks(tracks){
  const ol = document.createElement("ol")
  ol.innerHTML = ""
  ol.className = "tracks-list"
  albumContainer.append(ol)
  getFavorites(1)
  tracks.items.forEach(track => {
    const li = document.createElement("li")
    const div = document.createElement("div")
    li.append(div)
    li.dataset.trackId = track.id
    let artist = track.artists[0].name
    div.innerHTML = `${track.name} <button class="favorites-btn" data-id=${track.id} data-name="${track.name}" data-artist="${artist}" data-uri="${track.uri}">Add to Favorites</button>`
    ol.append(li)
  });
}

//click listener for add to favorites button
albumContainer.addEventListener("click", (e) => {
  if (e.target.className === "favorites-btn" && e.target.textContent === "Add to Favorites"){
    let songName = e.target.dataset.name
    let artistName = e.target.dataset.artist
    let uri = e.target.dataset.uri
    changeButton(e.target)
    let songObj = {title: songName, artist: artistName, uri: uri}
    createFavorite(songObj)
  } else if (e.target.className === "favorites-btn" && e.target.textContent === "Remove From favorites"){
    console.log("You clicked a remove button")
  }
})

favoritesContainer.addEventListener("click", (e) =>{
  if (e.target.textContent === "X"){
    let favoriteId = e.target.parentNode.parentNode.dataset.id
    removeFavorite(favoriteId)
    deleteFavorite(favoriteId)
  }
})

//remove favorite from the DOM by id
function removeFavorite(favoriteId){
  let favorite = favoritesContainer.querySelectorAll(`[data-id='${favoriteId}']`)[0]
  favorite.remove()
}

//deletes a favorite from a database
function deleteFavorite(favoriteId){
  fetch(`http://localhost:3000/api/v1/delete/?q=${favoriteId}`, {
    // mode: 'no-cors',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
  })
}
//creates a new favorite in the db ( also checks if the song exists and makes it if it doesn't)
function createFavorite(songObj){
  console.log(songObj)
  let title = songObj.title
  let artist = songObj.artist
  let uri = songObj.uri
  fetch(`http://localhost:3000/api/v1/favorites/?artist=${artist}&title=${title}&uri="${uri}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      
    },
    body: JSON.stringify(songObj)
    })
    .then(response => response.json())
    .then(json => addFavorite(json)) //make available to dynamic users
}

// adds a single new favorite to the existing list
function addFavorite(favoriteObj){
  let div = document.createElement("div")
  let li = document.createElement("li")
  let uri = favoriteObj.uri.split(":")
  li.innerHTML = `${favoriteObj.song_name} <iframe src="https://open.spotify.com/embed/track/${uri[2]}" width="300" height="50" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe> <button class="remove-btn">X</button> `
  div.dataset.id = favoriteObj.id
  favoritesList.append(div)
  div.append(li)
}

//renders the favorites to the page
function renderFavorites(favorites){ //?receiving an array of favorite objects
  console.log(favorites)
  favoritesList.innerHTML=""
  favoritesHeader.innerHTML=""
  favoritesHeader.textContent = "Favorites:"
  favoritesContainer.prepend(favoritesHeader)
  favorites.forEach(favorite => {
    let div = document.createElement("div")
    let li = document.createElement("li")
    let uri = favorite.uri.split(":")
    console.log(uri[2])
    li.innerHTML = `${favorite.song_name} <iframe src="https://open.spotify.com/embed/track/${uri[2]}" width="300" height="50" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe> <button class="remove-btn">X</button>`
    // li.textContent = favorite.song_name
    div.dataset.id = favorite.id
    favoritesList.append(div)
    div.append(li)
  });
}

// reach out to the Rails API and pull some favorites in.
function getFavorites(userId){
  fetch(`http://localhost:3000/api/v1/favorites/${userId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    })
    .then(response => response.json())
    .then(json => renderFavorites(json))
}

// changes the text of the add to favorite button and back again
function changeButton(button){
  if (button.textContent === "Add to Favorites"){
    button.textContent = "Remove from Favorites"

  } else if (button.textContent === "Remove from Favorites"){
    button.textContent = "Add to Favorites"
  }
}
