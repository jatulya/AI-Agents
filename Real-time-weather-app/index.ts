import OpenAI from "openai"

const OPENAI_API_KEY = ""

const client = new OpenAI({
    apiKey : OPENAI_API_KEY
})

//tools
function getWeather(city ="": string ){
    if (city.toLowerCase() == "ekm") return "30"
    if (city.toLowerCase() == "palakkad") return "40"
    if (city.toLowerCase() == "tvm") return "30"
    if (city.toLowerCase() == "kollam") return "30"
    if (city.toLowerCase() == "tcr") return "30"
    if (city.toLowerCase() == "kottayam") return "30"

}