const express = require("express");
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 4000
app.use(express.json());
const cors = require('cors');
app.use(cors())

const { Configuration, OpenAIApi } = require("openai");

const conversationHistory =[];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/prompt",async(req,res)=>{
    const {prompt,language} = req.body;
    conversationHistory.push({ role: "user", content: `Hello please provide me a good poetry on ${prompt} in ${language}` })
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        messages:conversationHistory,
      });

      const reply = response.data.choices[0].message.content.trim().split("\n").join(" ")

      if (reply) {
        conversationHistory.push({ role: "assistant", content: reply });
       
        return res.status(200).send({status:200,res:reply})
      }
      return res.status(500).send({status:500,msg:"Try again after some time"})
    
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});







