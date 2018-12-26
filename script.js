"use strict";

//cryptocurrency api
const api_key1 ="960e428fdca399a09e41196327f5766b1f76aa979eec604f31318a4e0ac3f032";
//news api
const api_key2 = "3d4f6056ea124d38aff81d043310b2f2";


// landing page generates the top ten cryptocurrencies and some stats
function generateTopTen(){
    const searchUrl = "https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD&api_key=";
    const baseImageUrl = "https://www.cryptocompare.com/";
    const url = searchUrl + api_key1;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            for( let i=0; i<responseJson.Data.length; i++){
                $(".top-currencies").append(`
                <tr>
                    <td><img class="icons" src="${baseImageUrl}${responseJson.Data[i].CoinInfo.ImageUrl}"></td>
                    <td>${responseJson.Data[i].CoinInfo.FullName}</td>
                    <td>${responseJson.Data[i].DISPLAY.USD.PRICE}</td>
                    <td>${responseJson.Data[i].DISPLAY.USD.HIGHDAY}/${responseJson.Data[i].DISPLAY.USD.LOWDAY}</td>
                </tr>
                `);
            }
      
        })
        .catch(error => console.log("generateTopTen failed"));
}

// landing page generates 3 most recent news articles for cryptocurrency 
function generateNews(){
    const searchUrl = "https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=";
    const url = searchUrl + api_key2;
    fetch(url)
        .then(response => {
            if (response.ok){
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson){
            for(let i=0; i<3;i++){
                $(".news-articles").append(`
                    <div class="article"><a href=${responseJson.articles[i].url}><span>${responseJson.articles[i].title}</span><span>${responseJson.articles[i].source.name}</span><img src=${responseJson.articles[i].urlToImage}></a></div>
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

function registerEvents(){
    $(".search-bar").on("submit", function(event){
        event.preventDefault();
        $(".landing").empty();

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
            console.log(search)
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
            console.log("12",typeof search)
            console.log("123", responseJson.Data[search].FullName)
        })
        .catch(error => console.log("1 error happened"));
}










function documentReady(){
    generateTopTen();
    generateNews();
    registerEvents();
    // test();
}

$(documentReady);


















