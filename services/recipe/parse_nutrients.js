const axios = require('axios')

/**
 * parse nutrients from API using @param recipeName 

 * @param {String} recipeName Meal sentence, eg. I had coffee and donuts this morning.
 * @return {Promise} data 
 */

const parseNutrients = async recipeName => {

    const micronutrientDataParsed = {}
    const micronutrientsMealData = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${recipeName}`)


    micronutrientsMealData.data.foods[0].foodNutrients.forEach((nutrient) => {

        if (nutrient.value > 0) {
            micronutrientDataParsed[`${nutrient.nutrientName}`] = [nutrient.value, nutrient.unitName]
        }

    })
  

    return micronutrientDataParsed
}

exports.default = parseNutrients