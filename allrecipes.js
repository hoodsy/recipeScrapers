// NEED TO:
// change overall outputs to JSON
// add positive/critical review functions
// add nutrition function



var request = require('request');
var cheerio = require('cheerio');


//
// retrieves the ingredients (and quantity) of a recipe
//
function getIngredients(recipe){
  var url = 'http://www.allrecipes.com/Recipe/' + recipe.replace(' ','-');
  request(url, function(err, resp, body) {
    console.log('-------')
    console.log('Ingredients: ')
    // create a DOM of the provided response body
    $ = cheerio.load(body);
    // each ingredient / amount has the <p> tag and class='fl-ing'
    $("p.fl-ing").each(function(){
      var ingredients = ""
      // combine each ingredient/quantity into one line
      $(this).find('span').each(function(){
          ingredients += $(this).text()
      })
      console.log(ingredients)
    })
  })
}

//
// retrieves the rating and # of reviews of a recipe
//
function getRating(recipe){
  var url = 'http://www.allrecipes.com/Recipe/' + recipe.replace(' ','-');
  request(url, function(err, resp, body) {
    console.log('-------')
    // create a DOM of the provided response body
    $ = cheerio.load(body);
    // get rating value (rounded) and # of reviews
    var rating = "Rating: " + $('meta[itemprop="ratingValue"]').attr('content').substring(0,4)
    rating += ", " + $('span[itemprop="reviewCount"]').text() + " reviews"
    console.log(rating)
  })
}

//
// retrieves the cooking directions
//
function getInstructions(recipe){
  var url = 'http://www.allrecipes.com/Recipe/' + recipe.replace(' ','-');
  request(url, function(err, resp, body) {
    console.log('-------')
    console.log('Directions: ')
    // create a DOM of the provided response body
    $ = cheerio.load(body);
    var instructions = $("div[itemprop='recipeInstructions']")
    $(instructions).find('span').each(function(){
      console.log($(this).text())
    })
  })
}

//
// retrieves the prep, cook, and total time to make recipe
//
function getCookTime(recipe){
  var url = 'http://www.allrecipes.com/Recipe/' + recipe.replace(' ','-');
  request(url, function(err, resp, body) {
    console.log('-------')
    console.log('Cook Time: ')
    // create a DOM of the provided response body
    $ = cheerio.load(body);
    var times = $('div[id="divRecipeTimesContainer"]')
    $(times).find('span').each(function(i){
      var labels = ['Prep: ','Cook: ','Total: ', 'Total: ']
      console.log(labels[i] + $(this).text())
    })
  })
}

//
// runs functions that output info on the selected recipe
//
function recipeInfo(recipe){
  console.log('*********************************')
  console.log('Recipe Selected: ' + recipe)
  getRating(recipe)
  getCookTime(recipe)
  getIngredients(recipe)
  getInstructions(recipe)
}
recipeInfo('chicken-pot-pie-ix')