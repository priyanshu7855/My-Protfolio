const apiKey = "b195b78f"; // Replace with your actual API key
let selectedIndex = -1;
let suggestions = [];

// Fetch movie suggestions
function fetchSuggestions() {
    let query = document.getElementById("movieInput").value.trim();
    if (query.length < 3) {
        closeSuggestions();
        return;
    }

    let url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                suggestions = data.Search;
                showSuggestions();
            } else {
                closeSuggestions();
            }
        })
        .catch(error => console.error("Error fetching suggestions:", error));
}

// Show suggestions in dropdown
function showSuggestions() {
    let suggestionsBox = document.getElementById("suggestions");
    suggestionsBox.innerHTML = "";
    selectedIndex = -1;

    suggestions.forEach((movie, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = `${movie.Title} (${movie.Year})`;
        listItem.className = "px-4 py-2 hover:bg-gray-700 cursor-pointer";
        
        listItem.onclick = function () {
            selectSuggestion(index);
        };

        suggestionsBox.appendChild(listItem);
    });
}

// Select a suggestion
function selectSuggestion(index) {
    document.getElementById("movieInput").value = suggestions[index].Title;
    closeSuggestions();
    searchMovie();
}

// Handle keyboard navigation
document.getElementById("movieInput").addEventListener("keydown", function (e) {
    let items = document.getElementById("suggestions").getElementsByTagName("li");

    if (e.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % suggestions.length;
        updateSelection(items);
        e.preventDefault();
    } else if (e.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
        updateSelection(items);
        e.preventDefault();
    } else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
            selectSuggestion(selectedIndex);
        }
    }
});

// Update dropdown selection
function updateSelection(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("bg-gray-700");
    }
    if (selectedIndex >= 0) {
        items[selectedIndex].classList.add("bg-gray-700");
    }
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
    if (!document.getElementById("movieInput").contains(event.target) && !document.getElementById("suggestions").contains(event.target)) {
        closeSuggestions();
    }
});

// Close suggestions
function closeSuggestions() {
    document.getElementById("suggestions").innerHTML = "";
    selectedIndex = -1;
}

// Fetch movie details
function searchMovie() {
    let movieName = document.getElementById("movieInput").value.trim();
    if (movieName === "") {
        alert("Please enter a movie name!");
        return;
    }

    let url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                document.getElementById("defaultContent").style.display = "none"; // Hide default content
                displayMovie(data);
            } else {
                document.getElementById("movieDetails").innerHTML = `<p class="text-red-500 text-center">❌ ${data.Error}</p>`;
            }
        })
        .catch(error => console.error("Error fetching movie data:", error));
}

// Display movie details
function displayMovie(data) {
    document.getElementById("movieDetails").innerHTML = `
        <div class="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 class="text-xl font-bold text-center mb-2">${data.Title} (${data.Year})</h2>
            <img src="${data.Poster}" alt="Movie Poster" class="mx-auto rounded-lg shadow-md">
            <p class="mt-2"><strong>⭐ IMDB Rating:</strong> ${data.imdbRating}</p>
            <p><strong>🎭 Genre:</strong> ${data.Genre}</p>
            <p><strong>🎬 Director:</strong> ${data.Director}</p>
            <p><strong>🎞 Actors:</strong> ${data.Actors}</p>
            <p><strong>📖 Plot:</strong> ${data.Plot}</p>
            <p><strong>📅 Release Date:</strong> ${data.Released}</p>
        </div>
    `;
}

// Fetch trending movies
// Fetch trending movies
function fetchTrendingMovies() {
    let url = `https://www.omdbapi.com/?s=marvel&apikey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                let trendingContainer = document.getElementById("trendingMovies");
                trendingContainer.innerHTML = "";
                data.Search.slice(0, 4).forEach(movie => {
                    let movieCard = document.createElement("div");
                    movieCard.className = "bg-gray-800 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition";
                    movieCard.innerHTML = `
                        <img src="${movie.Poster}" class="rounded-md w-full">
                        <p class="mt-2 text-sm text-center font-semibold">${movie.Title} (${movie.Year})</p>
                    `;
                    
                    // Clicking a trending movie fetches details
                    movieCard.onclick = function () {
                        document.getElementById("movieInput").value = movie.Title;
                        searchMovie(); // Fetch movie details
                    };

                    trendingContainer.appendChild(movieCard);
                });
            }
        })
        .catch(error => console.error("Error fetching trending movies:", error));
}

// Call function to display trending movies
fetchTrendingMovies();

