import axios from "axios";
import { Request, Response } from "express";
import Groq from "groq-sdk"; 
import dotenv from 'dotenv'
dotenv.config()

const groq = new Groq({
  apiKey:process.env.GROQ_API_KEY
})

async function generateText(recipient_data:any) {

  const { fullName, headline, summary, skills, positions, honors, study } = recipient_data;

  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role":"user",
        "content":`
          Generate a personalized icebreaker message for a job opportunity using the following details about the recipient:
          - **Full Name**: ${fullName}
          - **Headline**: ${headline}
          - **Summary**: ${summary}
          - **Key Skills**: ${skills.join(", ")}
          - **Recent Positions**: ${positions.join(" | ")}
          - **Honors & Awards**: ${honors.join(" | ")}
          - **Education**: ${study.join(" | ")}
          Make the message engaging, professional, and warm. Reference their background, skills, or recent work to create a connection. Keep it concise (around 2-3 sentences) and natural. Avoid being too generic or overly formal. If they have notable achievements, acknowledge them briefly. The goal is to start a meaningful conversation about potential job opportunities.    
        `
      }
    ],
    "model": "qwen-2.5-32b",
    "temperature": 0.6,
    "max_completion_tokens": 131072,
    "top_p": 0.95,
    "stream": false,
    "stop": null
  });

   return chatCompletion.choices[0].message.content;
}

export const generateIcebreaker = async (req: Request, res: Response) => {
  const { url } = req.body; // Extract LinkedIn profile URL from query parameters
  const apiKey = req.headers["x-api-key"] as string; // Extract API key from headers

  // Validate inputs
  if (!url) {
    res.status(400).json({ error: "LinkedIn profile URL is required" });
    return 
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return 
  }

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url",
    params: { url },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const profile = response.data

     const recipient_data = {
    fullName : profile.firstName + ' ' + profile.lastName,
     headline : profile.headline,
     summary : profile.summary,
     skills : !profile.skills?[]:profile.skills.map((i:any)=>i.name),
     positions : !profile.position?[]:profile.position.map((p:any)=>{
      return `${p.title} at ${p.companyName} (${p.description})`
    }).slice(0,3),
     honors : !profile.honors?[]:profile.honors.map((h:any)=>`${h.title}:${h.description}`).slice(0,3),
     study : !profile.educations?[]:profile.educations.map((e:any)=>`Studied ${e.fieldOfStudy} ${e.degree} at ${e.schoolName}`).slice(0,3)
    }

    const message = await  generateText(recipient_data)

    res.status(200).json({message});
  } catch (error: any) {
        res
      .status(error.response?.status || 500)
      .json({ error: error.message });
  }
};
