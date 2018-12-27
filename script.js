"use strict";

//cryptocurrency api
const api_key1 ="960e428fdca399a09e41196327f5766b1f76aa979eec604f31318a4e0ac3f032";
//news api
const api_key2 = "3d4f6056ea124d38aff81d043310b2f2";


// landing page generates the top ten cryptocurrencies and some stats
function generateTopTen() {
    const searchUrl = "https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD&api_key=";//seperate query parameters
    const baseImageUrl = "https://www.cryptocompare.com/";
    const url = searchUrl + api_key1;
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            for( let i=0; i<responseJson.Data.length; i++){
                $(".top-currencies").append(`
                <tr>
                    <td class="cName"><img class="icons" src="${baseImageUrl}${responseJson.Data[i].CoinInfo.ImageUrl}">${responseJson.Data[i].CoinInfo.FullName}</td>
                    <td class="price">${responseJson.Data[i].DISPLAY.USD.PRICE}</td>
                    <td class="volume">${responseJson.Data[i].DISPLAY.USD.HIGHDAY}/${responseJson.Data[i].DISPLAY.USD.LOWDAY}</td>
                </tr>
                `);
            }
      
        })
        .catch(error => console.log("generateTopTen failed"));
}

// landing page generates 3 most recent news articles for cryptocurrency 
function generateNews(){
    const searchUrl = "https://newsapi.org/v2/everything?q=cryptocurrency+blockchain&apiKey=";
    const url = searchUrl + api_key2;
    return fetch(url)
        .then(response => {
            if (response.ok){
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson){
            for(let i=0; i<6;i++){
                $(".news-articles").append(`
                    <article class="article"><a class="a-link" href="${responseJson.articles[i].url}"><span>${responseJson.articles[i].title}</span><span>${responseJson.articles[i].source.name}</span><img src="${responseJson.articles[i].urlToImage}"></a></article>
                    `)}
                })
        .catch(error => console.log("generateNews failed"))

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function buildResultsLayout(){
    $(".landing").append(`
        <div class="upper-page">
            <div class="left-side">
                <div class="crypt-info">
                    <div class="coin">0</div>
                    <div class="market">1fffffffffffff</div>
                    <div class="price">2</div>
                    <div class="open24">3</div>
                    <div class="high24">4</div>
                    <div class="low24">5</div>
                    <div class="change24">6</div>
                    <div class="changeP24">7</div>
                </div>
            </div>
            <div class="right-side">
                <div class="tweets">00000000000000</div>
            </div>
        </div>
         <div class="btm-side">111</div>
    `)
}
//listen for search input submission and send to results page
function registerEvents(){
    $(".search-bar").on("submit", function(event){
        event.preventDefault();
        $(".landing").empty();
        buildResultsLayout();

        let searchTerm = ($(".search-term").val()).toUpperCase();
        console.log("search term", searchTerm);

        let searchMarket = $(".search-ex").val();
        console.log("market", searchMarket);

        let fCurrency = $(".search-xxx").val();
        console.log("fcurrecny", fCurrency);

        generateResultsMedia(searchTerm);
        generateResults(searchTerm, searchMarket, fCurrency);
        
    })
}

//generates statistics from Custom Average endpoint
function generateResults(search, exchange, currency){
    const searchUrl = "https://min-api.cryptocompare.com/data/generateAvg"
    if(exchange ===""){
        exchange = "CCCAGG"
    }

    let params = {
        fsym: search,
        tsym: currency,
        e: exchange,
        api_key: api_key1
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + queryString;

    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {

            console.log(responseJson.DISPLAY.PRICE)
        })
        .catch(error => console.log("1 error happened"));
}


function generateResultsMedia(search) {
    const searchUrl = "https://min-api.cryptocompare.com/data/all/coinlist"

    const url = searchUrl + "?" + api_key1;

    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            console.log("123", responseJson.Data[search].FullName)
            $(".coin").append(`<span>${responseJson.Data[search].FullName}</span>`);
            
        })
        .catch(error => console.log("1 error happened"));
}







window.onload = function(){
    Particles.init({
        selector:".background",
        connectParticles: true,
        maxParticles: 110,
        speed:0.33
    });
};


function documentReady(){
    generateTopTen();
    generateNews();
    registerEvents();
    // test();
}

$(documentReady);


















