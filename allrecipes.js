// results sent to output.json, console
// NEED TO:
// 
// add positive/critical review functions
// add nutrition function



var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');



// adds each ingredient as an 'id' obj in json
function getIngredients($){
  // each ingredient / amount has the <p> tag and class='fl-ing'
  var json = {id: {}}
  $("p.fl-ing").each(function(i){
    var ingredients = ""
    // combine each ingredient/quantity into one line
    $(this).find('span').each(function(){
        ingredients += $(this).text()
    })
    json.id[i] = ingredients
  })
  return JSON.stringify(json)
}


// retrieves the rating and # of reviews of a recipe
function getRating($){
  return JSON.stringify({
    value: $('meta[itemprop="ratingValue"]').attr('content').substring(0,4),
    number: $('span[itemprop="reviewCount"]').text()
  })
}


// retrieves the cooking directions
function getInstructions($){
  var json = {id: {}}
  $("div[itemprop='recipeInstructions']").find('span').each(function(i){
    json.id[i] = $(this).text()
  })
  return JSON.stringify(json)
}


// retrieves the prep, cook, and total time to make recipe
//  id 2,3 are the TOTAL time
function getCookTime($){
  var json = {id: {}}
  $('div#divRecipeTimesContainer').find('span').each(function(i){
    json.id[i] = $(this).text()
  })
  return JSON.stringify(json)
}


// returns the best positive/critical review
// as id 0 and 1
function getReviews($){
  var json = {id: {}}
  $('div[itemprop="review"]').find('p').each(function(i){
    if(i==2)
      return false
    json.id[i] = $(this).text()
  })
  return JSON.stringify(json)
}


// each id has a category and its quantity
// ie 0: Calories 175g
function getNutrition($){
  var json = {id: {}}
  $('ul#ulNutrient').each(function(i){
    data = $(this).find('li').text()
    // remove whitespace after type/quantity
    json.id[i] = data.slice(0, data.indexOf("  "))
  })
  return JSON.stringify(json)
}


// parse recipe provided, return JSON of all functions
function recipeInfo(recipe) {
  console.log('*********************************')
  console.log('Recipe Selected: ' + recipe)
  var url = 'http://www.allrecipes.com/Recipe/' + recipe.replace(' ','-');

  request(url, function(err, resp, body) {
   // create a DOM of the provided response body, call other scrapers
    $ = cheerio.load(body);
    var json = {
      rating: getRating($),
      time: getCookTime($),
      ingredients: getIngredients($),
      instructions: getInstructions($),
      review: getReviews($),
      nutrition: getNutrition($)
    }

    var stringed = JSON.stringify(json, null, 4)
    console.log(JSON.parse(stringed))
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){})
  })
}

recipeInfo('garlic-bread')
