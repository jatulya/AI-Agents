import OpenAI from "openai"
import readlineSync from "readline-sync"

import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY


const client = new OpenAI({
    apiKey : OPENAI_API_KEY
})

//tools
//usually, these tools come from api calls. But for now, we are just writing some hardcode functions
function getWeatherDetails(city  = ""){
    if (city.toLowerCase() == "ernakulam") return "30°C "
    if (city.toLowerCase() == "palakkad") return "40°C"
    if (city.toLowerCase() == "trivandrum") return "25°C"
    if (city.toLowerCase() == "kollam") return "28°C"
    if (city.toLowerCase() == "thrishur") return "35°C"
    if (city.toLowerCase() == "kottayam") return "33°C"
}

const SYSTEM_PROMPT = `You are an AI assistant with START, PLAN, ACTION, OBSERVATION and OUTPUT STATE. 
Wait for the user prompt and first plan using available tools.
After planning, Take the action with appropriate tools and wait for the Observation based on Action.
Once you get the observation, Return the AI response based on START prompt and observations.

Strictly follow the JSON output format as in example.

Available tools:
function getWeatherDetails(city : string) : string
getWeatherDetails is a function that accepts a city name and returns the temperature of that city

Example:
START
{"type": "user", "user": "what is the sum of weather of ekm and tvm today?"}
{"type": "plan", "plan": "I will call the getWeatherDetails for ekm"}
{"type": "action", "action": "getWeatherDetails", "input": "ekm"}
{"type": "observation", "observation": "30°C"}
{"type": "plan", "plan": "I will call the getWeatherDetails for tvm"}
{"type": "action", "action": "getWeatherDetails", "input": "tvm"}
{"type": "observation", "observation": "25°C"}
{"type": "output", "output": "The sum ofweather of ekm and tvm today is 55°C"}
`
//creating prompt
const prompt = "What is the weather of Ernakulam today?"

//mapping function and tool name
const toolMap = {"getWeatherDetails" : getWeatherDetails}

//msg paramter for auto prompting
const msg = [{role : "system", content : SYSTEM_PROMPT}]

// auto prompting
while (true){
    const query = readlineSync.question("You : ")
    const q = {type : "user", user : query}
    msg.push({role : "user", content : JSON.stringify(q)})

    while(true){
        const chat = await client.chat.completions.create({
            model : "gpt-4o-mini",
            messages : msg,
            response_format : {type : "json_object"}
        })
        
        const response = chat.choices[0].message.content
        msg.push({role : "assistant", content : response}) //intermediate responses are from ai assistant

        const call = JSON.parse(response)
        console.log("/n------------AI AGENT RESPONSE------------/n")
        console.log(response)
        console.log("/n------------END AI AGENT RESPONSE------------/n")

        if(call.type == "output") {
            console.log(`Output from AI Agent:${call.output}`)
            break
        }
        else if (call.type == "action") {
            const tool = toolMap[call.action]
            const result = tool(call.input)
            const o = {type : "observation", observation : result}
            msg.push({role : "developer", content : JSON.stringify(o)})
        }
        
    }
}
