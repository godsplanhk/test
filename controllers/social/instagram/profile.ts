import { IgProfileInput, IgProfileOutput } from "../../../types/social";
import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { Request, Response } from "express";

export const ig_profile_scraper = async(req:Request, res:Response)=>{
    const {url} = req.body as IgProfileInput
    let cookie = req.body.cookie;
    const apiKey = req.headers["x-apify-api-key"] as string;
    const username = url.replace("https://instagram.com/","").replace("/","")

    if(!username || !cookie) {
        res.status(400).json({"error":"Please provide the username / cookie"})
        return
    } 

    const payload = {
        action:"scrapeProfiles",
        "scrapeProfiles.profileList": [
            username
        ],
        "proxy": {
            "useApifyProxy": true,
            "apifyProxyGroups": [
            "RESIDENTIAL"
            ]
        },
        "cookie":JSON.parse(cookie)
    }

    const actorUrl = `https://api.apify.com/v2/acts/curious_coder~instagram-scraper/runs?token=${apiKey}`
    const lastPostActorUrl = `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs?token=${apiKey}`

    try {
        const response = await fetch(actorUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
  
        let data = await response.json()
        data = data.data
        if (!data.id) throw new Error("Failed to start actor.")
        
        const datasetId = await pollRunStatus(data.id, apiKey);
        if (!datasetId) {
            throw new Error("Failed to get dataset ID.");
        }

        const result = await fetchActorResults(datasetId, apiKey);

        async function get_last_post_date(){
            const response = await fetch(lastPostActorUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: [result[0].input],
                    resultsLimit: 1
                }),
              })
        
              let data = await response.json()
              data = data.data
              if (!data.id) throw new Error("Failed to start actor.")
              
              const datasetId = await pollRunStatus(data.id, apiKey);
              if (!datasetId) {
                  throw new Error("Failed to get dataset ID.");
              }
      
              const res = await fetchActorResults(datasetId, apiKey);
              return res[0].timestamp
        }

        const last_post_date = await get_last_post_date()

        const outputResult:IgProfileOutput = {
            username: url.replace("https://instagram.com/","").replace("/",""),
            location:`${result[0].address_street} ${result[0].city_name}`,
            phone:result[0].contact_phone_number || result[0].public_phone_number,
            email:result[0].public_email,
            number_of_follower:result[0].follower_count,
            number_of_following:result[0].following_count,
            engagement_rate:"",
            created_at:"",
            last_post_date:last_post_date
        }

        res.status(200).json({"data":outputResult})
    }
    catch(error){
        console.log(error)
        res.status(500).json({"error":"Actor run failed."})
    }
}