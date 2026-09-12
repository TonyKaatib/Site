"use strict";

function isValidYouTubeId(id){
    return /^[A-Za-z0-9_-]{11}$/.test(id);
}


function getVideoId(){

    const params = new URLSearchParams(window.location.search);

    const queryId = params.get("v");

    if (queryId && isValidYouTubeId(queryId))
        return queryId;

    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    const cinemaIndex = parts.indexOf("cinema");

    if (cinemaIndex !== -1 &&
        parts.length > cinemaIndex + 1)
    {
        const pathId = parts[cinemaIndex + 1];

        if (isValidYouTubeId(pathId))
            return pathId;
    }


    return null;
}


function getCinemaBasePath()
{
    const path = window.location.pathname;

    const index = path.indexOf("/cinema");

    if (index === -1)
        return "/cinema";

    return path.substring(0, index) + "/cinema";
}


function loadVideo(id){
    const player = document.getElementById("player");

    if (!player)
    {
        console.error("Elemento #player não encontrado.");
        return;
    }


    player.src =
        "https://www.youtube.com/embed/" +
        encodeURIComponent(id) +
        "?rel=0";

    const prettyUrl =
        getCinemaBasePath() +
        "/" +
        encodeURIComponent(id);

    history.replaceState(
        { videoId: id },
        "",
        prettyUrl
    );
}


function showError(message)
{
    const cinema = document.querySelector(".cinema");

    if (!cinema)
        return;

    cinema.innerHTML = `
        <div class="error">
            <h1>🎬 Cinema</h1>
            <p>${message}</p>
        </div>
    `;
}


document.addEventListener(
    "DOMContentLoaded",
    () =>
    {
        const id = getVideoId();

        if (!id)
        {
            showError(
                "No valid YT video link"
            );

            return;
        }

        loadVideo(id);
    }
);