"use strict";

const api_key1 = "960e428fdca399a09e41196327f5766b1f76aa979eec604f31318a4e0ac3f032";
let dataArray; //container for an array of responseJson data from API endpoint All Coins
let pageCounter = 0;//counter for All Coin Page's index in the array dataArray
let backEnabled = false;// boolean to switch on/off button for different pages
let searchEnabled = false;

//formats parameters for urls
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//canvas settings for background
window.onload = function() {
    Particles.init({
        selector: ".background",
        sizeVariations: 5,
        color: "#dce6ed",
        connectParticles: true,
        maxParticles: 160,
        minDistance: 150,
        speed: 0.33,
        responsive: [
            { breakpoint: 800,
                options: {maxParticles: 80,}
            },
            {breakpoint: 400,
                options: { maxParticles: 60,}
            },
            {breakpoint: 320,
                options: {maxParticles: 20}
            }
        ]
    });
};



/////////////////////////////////////EVENT HANDLERS/////////////////////////////////////
//event for clicking "CryptOracle logo"
function reloadPage() {
    $(".logo").on("click", function () {
        location.reload();
    });
}

//event for clicking back button on results page coming from a main page search
function reloadSearch() {
    $(".landing").on("click", ".refresh", function() {
        location.reload();
    });
}

//event for clicking "Top 10 Coins"
function registerTopCoins() {
    $(".nav-btn1").on("click", function(event) {
        $(this).prop("disabled", true);
        nav1();
        $(".loader").removeClass("loader-hidden");
        backEnabled = false;
        searchEnabled = false;
        $(".landing").empty();
        generateTopTenLayout();
        generateTopTen();
    });
}

//event for clicking "All Coins"
function registerAllCoins() {
    $(".nav-btn2").on("click", function(event) {
        $(this).prop("disabled", true);
        nav1();
        $(".loader").removeClass("loader-hidden");
        pageCounter = 0;
        backEnabled = true;
        searchEnabled = false;
        $(".landing").empty();
        generateAllCoinsLayout();
        generateAllCoins();
    });
}

//event for clicking "About"
function registerAbout() {
    $(".about-btn").on("click", function(event) {
        $(".landing").empty();
        nav1();
        $(".landing").append(`<div class="about-page">
        <h2 class="about-txt">About</h2>
            <p>CryptOracle is a simple client-side application, using a CORS enabled API to track real time statistics of Cryptocurrencies.
            If you are unfamiliar with Crytocurrencies, the search will default to the coin Bitcoin (BTC)
            and to the market CCCAGG, which stands for CrytoCompare's aggregate of all the markets.</p>
            <p>Here are some example coins and markets to search for:</p>
            <h4 class="about-text">Coins</h4>
            <ul>
                <li>NEO</li>
                <li>QTUM</li>
                <li>DOGE</li>
            </ul>
            <h4 class="about-txt">Markets</h4>
            <ul>
                <li>Kraken</li>
                <li>Bitfinex</li>
                <li>Cexio</li>
            </ul>
            <h3 class="about-txt">Technologies Used</h3>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>jQuery</li>
                <li>CryptoCompare's API</li>
                <li>particles.js Library</li>
            </ul>
        </div>
        `);
    });
}

//event for submitting a search on landing page
function registerEvents() {
    $(".search-bar").on("submit", function(event) {
        event.preventDefault();
        searchEnabled = true;
        $(".loader").removeClass("loader-hidden");

        let searchTerm = (($(".search-term").val()).toUpperCase());
        let searchMarket = $(".search-ex").val();
        let fCurrency = $(".search-xxx").val();

        $(".landing").empty();
        $(".landing").append(`<ul class="search-results"></ul>`);
        // $(".search-results").html(`<div class="refresh"><a href="#"><- Search Again</a></div>`);
        generateResults(searchTerm, searchMarket, fCurrency);
    });
}

//event for click back button on All Coins page
function registerBackBtn() {
    $(".landing").on("click", ".back-btn", function(event) {
        $(this).prop("disabled", true);
        $(".landing").empty();
        generateAllCoinsLayout();
        generateAllCoins();
    })

}
//event for clicking a li in Top 10 Coins Page
function topTenDetail() {
    $(".landing").on("click", "li.table-info", function(event) {
        $(".landing").empty();
        $(".loader").removeClass("loader-hidden");

        let coinName = $(event.currentTarget).attr("id");

        $(".landing").append(`<ul class="search-results"></ul>`);
        generateResults(coinName, "", "USD");
    });
}

//event for clicking an li in All Coins page
function allCoinDetail() {
    $(".landing").on("click", "li.table-info-all", function(event) {
        $(".landing").empty();
        $(".loader").removeClass("loader-hidden");

        let coinName = $(event.currentTarget).attr("id");

        $(".landing").append(`<ul class="search-results"></ul>`);
        generateResults(coinName, "", "USD");
    });
}

//register event for next button on All Coins
function loadNextCoins() {
    $(".landing").on("click", ".next-load", function(event) {
        $(".all-currencies").empty();
        pageCounter = pageCounter + 10;
        generateQuantity(dataArray);
    });
}

//register event for previous button on All Coins
function loadPreviousCoins() {
    $(".landing").on("click", ".previous-load", function(event) {
        $(".all-currencies").empty();
        pageCounter = pageCounter - 10;
        generateQuantity(dataArray);
    });
}

function nav() {
    $("#toggle").on("click", function (event) {
        nav1();
    });
}

function nav1() {
    $(".nav-btns").toggleClass("responsive");
    $(".new1").toggleClass("new");
    let xcon = $("#x-icon").attr("class");
    if (xcon === "fas fa-3x fa-bars"){
        $("#x-icon").removeClass("fa-bars");
        $("#x-icon").addClass("fa-times");
    } else {
        $("#x-icon").removeClass("fa-times");
        $("#x-icon").addClass("fa-bars");
    }
   
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//generates html elements for generateTopTen() to append future li's
function generateTopTenLayout() {
    $(".landing").hide().fadeIn().html(`
        <section class="top-c">
            <h2 class="hidden">Top Ten List by 24 Hour Volume Subscriptions</h2>
                <ul class="top-currencies"></ul>
        </section>`)
}

//generates html elements for generateAllCoins() to append future li's
function generateAllCoinsLayout() {
    $(".landing").hide().fadeIn().html(`
        <section class="all-coins">
                <ul class="all-currencies"></ul>
        </section>`)
}

//fetch endpoint "Top 10 total volume" and append results to html elements generated by generateTopTenLayout()
function generateTopTen() {
    const searchUrl = "https://min-api.cryptocompare.com/data/top/totalvolfull";
    const baseImageUrl = "https://www.cryptocompare.com/";
    
    let params = {
        limit: "10",
        tsym: "USD",
        api_key: api_key1
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + queryString;

    return fetch(url)
    .then(function(response) {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
    })
    .then(function (responseJson) {
        let tableitems = `<ul class="main-table">
                            <li>Name</li>
                            <li>Price</li>
                            <li>24Hr High/Low</li>
                         </ul>`;
        for (let i=0; i<responseJson.Data.length; i++) {
            const { Name, ImageUrl, FullName } = responseJson.Data[i].CoinInfo;
            const { PRICE, HIGHDAY, LOWDAY } = responseJson.Data[i].DISPLAY.USD;

            tableitems = tableitems.concat(`
            <li class="table-info" id="${Name}">
            <img class="icons" src="${baseImageUrl}${ImageUrl}" alt="${FullName}">
            <p class="cName"><a href="#">${FullName}</a></p>
            <p class="price">${PRICE}</p>
            <p class="volume">${HIGHDAY}/${LOWDAY}</p>
            </li>`);
        }

        $(".table-currencies").html("");
        $(".top-currencies").html(tableitems);
        $("h2.hidden").removeClass("hidden");
        $(".loader").addClass("loader-hidden");
    })
    .catch(error => console.log("generateTopTen failed", error));
}

//fetch endpoint "all coin list"
function generateAllCoins() {
    const searchUrl = "https://min-api.cryptocompare.com/data/all/coinlist";
    
    return fetch(searchUrl)
    .then(function (response) {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
    })
    .then(function(responseJson) {
        dataArray = [];
        for (let key in responseJson.Data){
            dataArray.push(responseJson.Data[key]);
        }
        generateQuantity(dataArray);
        $(".loader").addClass("loader-hidden");
    })
    .catch(error => console.log("generateAllCoins failed",error));
}

//generates list of All Coins by passing in array of objects from generateAllCoins
function generateQuantity(arr) {
    let tableitems2 = "";
    const baseImageUrl = "https://www.cryptocompare.com/";
    
    for (let i=pageCounter; i<pageCounter+10; i++) {
        tableitems2 = tableitems2.concat(`
        <li class="table-info-all" id="${arr[i].Name}"><img class = "icons2" src="${baseImageUrl}${arr[i].ImageUrl}" alt="${arr[i].FullName}"><a href="#">${arr[i].FullName}</a></li>
        `);
    }
    
    if (pageCounter === 0) {
        $(".all-currencies").hide().fadeIn().html(`<h2>All Coins</h2>${tableitems2}`);
        $(".all-currencies").hide().fadeIn().append(`<div><a href="#" class="next-load">Next -></a></div>`);
    } else {
        $(".all-currencies").hide().fadeIn().append(tableitems2);
        $(".all-currencies").hide().fadeIn().append(`<div class="index-nav"><a href="#" class="previous-load"><- Previous </a><a href="#" class="next-load"> Next -></a></div>`);
    }
    window.scrollTo(0,0);
}

//Generates results for search submission, Top 10 li's click, All Coins li's click
function generateResults(search, exchange, currency){

    const searchUrl = "https://min-api.cryptocompare.com/data/all/coinlist";
    const searchUrl2 = "https://min-api.cryptocompare.com/data/generateAvg";

    if (search === "") {
        search = "BTC";
    }

    if (exchange === "") {
        exchange = "CCCAGG";
    }

    let params = {
        fsym: search,
        tsym: currency,
        e: exchange,
        api_key: api_key1
    }

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + api_key1;; //endpoint including only name
    const url2 = searchUrl2 + "?" + queryString; //endpoint including statistics 

    let response1, response2;
    
    fetch(url)
    .then(function(response) {
        if (response.ok) {return response.json();}
        throw new Error(response.statusText);
    })
    .then(function(responseJSON) {
        response1 = responseJSON;
        return fetch(url2);
    })
    .then(function(response) {
        if (response.ok) {return response.json();}
        throw new Error(response.statusText);
    })
    .then(function(responseJSON) {
        const {LASTMARKET, PRICE, OPEN24HOUR, HIGH24HOUR, LOW24HOUR, CHANGE24HOUR, CHANGEPCT24HOUR} = responseJSON.DISPLAY;
        if (backEnabled === true) {
            $(".search-results").append(`<div class="back-btn"><a href="#"><- Back</a></div>`);
        }
        if (searchEnabled === true){
            $(".search-results").html(`<div class="refresh"><a href="#"><- Search Again</a></div>`);
        }
        $(".search-results").append(`<li>${response1.Data[search].FullName}</li>`);
        if (PRICE != undefined) {
            $(".search-results").append(`
            <li><span>Last Market:</span> <span>${LASTMARKET}<span></li>
            <li><span>Price:</span> <span>${PRICE}</span></li>
            <li><span>Open 24 Hour:</span> <span>${OPEN24HOUR}</span></li>
            <li><span>High 24 Hour:</span> <span>${HIGH24HOUR}</span></li>
            <li><span>Low 24 Hour:</span> <span>${LOW24HOUR}</span></li>
            <li><span>Change 24 Hour:</span> <span>${CHANGE24HOUR}</span></li>
            <li><span>Change Percent 24 Hour: </span> <span>${CHANGEPCT24HOUR}%</span></li>
            `)
        }
        else {
            $(".search-results").append(`<div class="no-data"><h2>No Data</h2></div>`)
        }
        $(".loader").addClass("loader-hidden");
    })
    .catch((error) => {
        if(backEnabled === true){
            $(".search-results").append(`<div class="back-btn"><a href="#"><- Back</a></div>`);
            $(".search-results").append(`<div>There is no data for the Coin: ${search} in Market: ${exchange}</div`);
        } else{
            $(".search-results").append(`<div>There is no data for the Coin: ${search} in Market: ${exchange}</div`);}
    });
};

function documentReady() {
    registerEvents();
    registerTopCoins();
    reloadSearch();
    registerAllCoins();
    loadNextCoins();
    loadPreviousCoins();
    registerBackBtn();
    registerAbout();
    topTenDetail();
    allCoinDetail();
    nav();
    reloadPage();
}

$(documentReady);


















