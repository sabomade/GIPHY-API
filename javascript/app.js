
// VARIABLES
//=====================================
//initial topic search
var topics =["cookies", "BBQ", "hamburgers", "vegan", "vegetables", "snacks"];

//giphy api key
var gifAPI = "DXknV0JH1D0o1ChD71hL8Y2ZdpvCaAuK";

//search parameters for queryURL
var limit = 10;
var offset = 0;
var searchTerm;

//favorite icons url
var isFav = "images/heart-full.png";
var notFav = "images/heart-empty.png";

// FUNCTIONS
//=====================================

function displayGifInfo(searchTerm) {
    //url used to search api
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +searchTerm +"&api_key="+gifAPI+"&limit="+limit+"&offset="+offset;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        //console.log(response);
        
        //variable to store all gifs returned
        var arrOfGifs = response.data;
        //console.log(arrOfGifs);
        
        //loops through array of gifs & prints them to DOM
        for (let i = 0; i < arrOfGifs.length; i++) {
            //create div to hold gifInfo
            var gifDiv = $("<div>");
            gifDiv.addClass("gifDiv");

            //create img tag, get gif still url, add to img as src, then append img to gifDiv
            var gifImg = $("<img>")
            
            //still image url of current gif
            const still = arrOfGifs[i].images.fixed_height_still.url;

            //animated image url of current gif
            const animate = arrOfGifs[i].images.fixed_height.url;
            
            //add still & animated urls as attr to gifImg
            gifImg.attr("still-url", still).attr("animated-url", animate);

            //set inital img src to still & add attr of current state
            gifImg.attr("src", still).attr("data-state", "still").addClass("gif");

            //append gifImg to gifDiv
            gifDiv.append(gifImg);

             //create p tag, retrieve gif title, & append to gifDiv
             var title = $("<p>");
             title.text(arrOfGifs[i].title).addClass("title");
             gifDiv.append(title);

             //create p tag, retrieve gif rating, & append to gifDiv
             var rating = $("<p>Rating: "+ arrOfGifs[i].rating+ "</p>" ).addClass("rate");
             gifDiv.append(rating);

             //create img tag for favoriting gifs
             var favorite = $("<img>");
             
             //add attributes to favorite: src url, fav/nofav icon urls, fav-state, and class fav 
             favorite.attr("src", notFav).addClass("fav").attr("noFavURL", notFav).attr("isFavURL", isFav).attr("fav-state", "notFav");
             
             //append to gifDiv
             gifDiv.append(favorite);

            //add gifDiv to DOM
            $("#gif-view").append(gifDiv);

        }
        //create load more button & clear & add to DOM
        $("#load-more").empty();
        var button = $("<button>");
        button.text("Load More Images").addClass("btn btn-dark");
        $("#load-more").append(button);
    });
    
}

function renderButtons(){
    $("#buttons-view").empty();

    $.each(topics, function(i){
        var button = $("<button>" + topics[i]+ "</button>");
        button.addClass("gifButton btn btn-dark").attr("data-name", topics[i]);
        button.appendTo("#buttons-view");
    })
}

function getDrink(searchTerm){
    //looks up random drink from the CocktailDB API
    drinkqueryURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    
    $.ajax({
        url: drinkqueryURL,
        method: "GET"
    }).then(function(drinkData){
        //clear drink div
        $("#drink").empty();

        //array of drink - api only retuns 1 drink
        var drink = drinkData.drinks[0];
        //console.log("drink name: ", drink.strDrink);

        //link to pic of drink
        var drinkPicURL = drink.strDrinkThumb;
        var drinkName = drink.strDrink;
        
        //create h3 tag, append drink to DOM, with link to pic
        var drinkH3 = $("<h3>");
        drinkH3.html("Try a <a href="+drinkPicURL+" target='_blank'>" +drinkName+"</a> with your "+ searchTerm);
        $("#drink").append(drinkH3);

    });
}

 //when gif clicked, animate or stop animating
 $(document).on("click", ".gif", function(){
    // Preventing the button from trying to submit the form
    event.preventDefault();

    console.log("clicked: ", this);
    var state = $(this).attr("data-state");

    var stillURL = $(this).attr("still-url");
    var animateURL = $(this).attr("animated-url");

    if(state === "still"){
        $(this).attr("src", animateURL);
        $(this).attr("data-state", "animate");

    }else{
        $(this).attr("src",stillURL);
        $(this).attr("data-state", "still");
    }
});

//when laod more button clicked add 10 to offset and run search again, prepending new items to DOM
$("#load-more").on("click", function(){
    // Preventing the button from trying to submit the form
    event.preventDefault();

    offset = offset+10;
    //console.log(offset);
    displayGifInfo(searchTerm);
    //console.log("======= next 10 img =======")
});

//when heart icon clicked (.fav), move gifDiv under favorite gifs
$(document).on("click", ".fav", function(){
    // Preventing the button from trying to submit the form
    event.preventDefault();

    var favState = $(this).attr("fav-state");
    console.log("is fav? ", favState);

    var parent = $(this).closest('div');

    const fURL = $(this).attr("isFavURL");
    const nfURL = $(this).attr("noFavURL");

    if(favState === "notFav"){
        console.log("fav clicked was false");
        $(this).attr("src", fURL);
        $("#fav-gif-view").append(parent);
        $(this).attr("fav-state", "isFav");
    }
    else{
        console.log("fav clicked was true");
        parent.remove();
    }
});

// when button to add new gif is clicked, this function adds new topic to list & calls another function to write a new topic button to DOM
$("#add-gif").on("click", function(event) {
    event.preventDefault();

    // This line grabs the input from the textbox
    var item = $("#gif-input").val().trim();

   //checks to see if input field has text, adds to topics array only if NOT ""
   if (item !== ""){
      topics.push(item);
      // console.log(topics);
    }

    // Calling renderButtons which handles the processing of our topics array
    renderButtons();
    
    //clears input field
    $("#gif-input").val("");

  });


  // Generic function for displaying the gifInfo
  $(document).on("click", ".gifButton", function(){
    // Preventing the button from trying to submit the form
    event.preventDefault();

    //gets data-name value and assigns to variable gif
    searchTerm = $(this).attr("data-name");
    
    // empties gifs on screen when new topic button pressed
    $("#gif-view").empty();
    
    // resets search offset to 0
    offset = 0;

    //call function displayGifInfo, passing it name button just clicked as search term
    displayGifInfo(searchTerm);

    //call function getDrink, displays random drink to try with the food topic you clicked
    getDrink(searchTerm);

    });

  // Calling the renderButtons function to display the intial buttons
  renderButtons();