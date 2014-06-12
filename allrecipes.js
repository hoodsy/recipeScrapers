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
  $('div[id="divRecipeTimesContainer"]').find('span').each(function(i){
    json.id[i] = $(this).text()
  })
  return JSON.stringify(json)
}


//
// IN PROGRESS
//
function getPosReview($){
  console.log('-------')
  console.log('Most Helpful Positive Review: ')
  var rating = $('div')
  $(times).find('span').each(function(i){
    var labels = ['Prep: ','Cook: ','Total: ', 'Total: ']
    console.log(labels[i] + $(this).text())
  })
}


// parse recipe provided, return JSON of all functions
//
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
      instructions: getInstructions($)
    }
    
    var stringed = JSON.stringify(json, null, 4)
    console.log(JSON.parse(stringed))
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){})
  })
}

recipeInfo('chicken-pot-pie-ix')
