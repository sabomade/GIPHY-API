//initial topic search
var topics =["cookies", "BBQ", "hamburgers", "vegan", "vegetables", "snacks"];

//giphy api key
var gifAPI = "DXknV0JH1D0o1ChD71hL8Y2ZdpvCaAuK";

//search parameters for queryURL
var limit = 10;
var offset = 0;
var searchTerm;


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

             //create p tag, retrieve gif rating, & append to gifDiv
             var rating = $("<p>Rating: "+ arrOfGifs[i].rating+ "</p>" );
             gifDiv.append(rating);

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

 //when gif clicked, animate or stop animating
 $(document).on("click", ".gif", function(){
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
    offset = offset+10;
    //console.log(offset);
    displayGifInfo(searchTerm);
    //console.log("======= next 10 img =======")
});

function renderButtons(){
    $("#buttons-view").empty();

    $.each(topics, function(i){
        var button = $("<button>" + topics[i]+ "</button>");
        button.addClass("gifButton btn btn-dark").attr("data-name", topics[i]);
        button.appendTo("#buttons-view");
    })
}

// This function handles events where one button is clicked
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
    $("#gif-input").val("");

  });
  // Generic function for displaying the gifInfo
  $(document).on("click", ".gifButton", function(){
    //gets data-name value and assigns to variable gif
    searchTerm = $(this).attr("data-name");
    
    // empties gifs on screen when new topic button pressed
    $("#gif-view").empty();
    
    // resets search offset to 0
    offset = 0;

    //call function displayGifInfo, passing it name button just clicked as search term
    displayGifInfo(searchTerm);
    });

  // Calling the renderButtons function to display the intial buttons
  renderButtons();