
const artistHeader = document.querySelector(".artistHeader")
const albumList = document.querySelector(".albumList")
const searchForm = document.querySelector(".artist_search")
const albumContainer = document.querySelector(".album-container")
const favoritesContainer = document.querySelector(".favorites-container")
const favoritesList = document.querySelector(".favorites-list")

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
  console.log (artist.id)
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
  tracks.items.forEach(track => {
    const li = document.createElement("li")
    const div = document.createElement("div")
    li.append(div)
    li.dataset.trackId = track.id
    div.innerHTML = `${track.name} <button class="favorites-btn" data-id=${track.id} data-name="${track.name}">Add to Favorites</button>`
    ol.append(li)
    console.log(track.name)
  });
}

///adding something to the favorites list
  ///√√click listener for the favorites button
  ///render the new favorite to the favorites list on the page
  ///make sure we are passing the name and the artist to the db
  ///add or create a new Song => maybe do this when we are getting the tracks to the dom in the renderTracks function
  ///add or create a new User => don't need to do this since we are going to use a single user.
  ///add the new favorite to the db => make sure the params come along with the fetch request

//click listener for add to favorites button
albumContainer.addEventListener("click", (e) => {
  if (e.target.className === "favorites-btn"){
    changeButton(e.target)
    renderFavorites(e.target.dataset.name)
    createFavorite()
    
  }
})

function renderFavorites(favorite){
  const favoritesHeader = document.createElement("h4")
  favoritesHeader.textContent = "Favorites:"
  favoritesContainer.prepend(favoritesHeader)
  const li = document.createElement("li")
  console.log(favorite)
  li.textContent = favorite
  favoritesList.append(li)
  
}

//changes the text of the add to favorite button and back again
function changeButton(button){
  if (button.textContent === "Add to Favorites"){
    button.textContent = "Remove from Favorites"

  } else if (button.textContent === "Remove from Favorites"){
    button.textContent = "Add to Favorites"
  }
}
