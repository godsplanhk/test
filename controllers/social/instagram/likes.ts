import { IgCommentsInput, IgCommentsOutput, IgLikesInput, IgLikesOutput, IgProfileOutput } from "../../../types/social";
import { fetchActorResults, pollRunStatus } from "../../../utils/actor";
import { Request, Response } from "express";

export const ig_likes_scraper = async(req:Request, res:Response)=>{
    const {url, limit} = req.body as IgLikesInput
    let cookie = req.body.cookie;
    const apiKey = req.headers["x-apify-api-key"] as string;

    if(!url || !cookie) {
        res.status(400).json({"error":"Please provide the url / cookie"})
        return
    }
    let payload = {} 

    payload = {
        action: "scrapeLikesOfPost",
        "scrapeLikesOfPost.url": url,
        proxy: {
            useApifyProxy: true,
            apifyProxyGroups: ["RESIDENTIAL"]
        },
        cookie: JSON.parse(cookie),
        ...(limit && { count: limit })
    };
    const actorUrl = `https://api.apify.com/v2/acts/curious_coder~instagram-scraper/runs?token=${apiKey}`
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
        const output_data:Array<any> = [];

        for(var i=0; i< result.length-1; i++){
            const postData = result[i]
            output_data[i] = {
                username:postData.user.username,
                created_at:postData.created_at
            }
        }

        const usernames = output_data.map(i=>i.username).slice(0,limit)

        console.log(usernames)
        
        async function scrape_profiles(){
            
            const payload = {
                action:"scrapeProfiles",
                "scrapeProfiles.profileList": usernames,
                "proxy": {
                    "useApifyProxy": true,
                    "apifyProxyGroups": [
                    "RESIDENTIAL"
                    ]
                },
                "cookie":JSON.parse(cookie as string)
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
                            username: usernames,
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
                      return res.map(i=>i.timestamp)
                }
        
                const last_post_date = await get_last_post_date()
                const outputResult:IgProfileOutput[] = [];
                for(let i=0;i<usernames.length;i++){
                    outputResult[i] = {
                    username:result[i].input,
                    location:`${result[0].address_street} ${result[i].city_name}`,
                    phone:result[i].contact_phone_number || result[i].public_phone_number,
                    email:result[i].public_email,
                    number_of_follower:result[i].follower_count,
                    number_of_following:result[i].following_count,
                    engagement_rate:"",
                    created_at:"",
                    last_post_date:last_post_date[i]
                }
                }
            return outputResult
        
            }
            catch(error){
                console.log(error)
                res.status(500).json({"error":"Actor run failed."})
            }

        }

        const scraped_profiles = await scrape_profiles()
        if(!scraped_profiles) throw Error("")
        const finalOutput:IgLikesOutput[] = [];

        for(let i=0;i<scraped_profiles.length;i++){
            finalOutput[i] = {
                username:scraped_profiles[i]?.username,
                created_at:output_data[i]?.created_at,
                last_post_date:scraped_profiles[i]?.last_post_date,
                number_of_follower:scraped_profiles[i]?.number_of_follower,
                number_of_following:scraped_profiles[i]?.number_of_following,
                location:scraped_profiles[i].location,
                email:scraped_profiles[i]?.email,
                phone:scraped_profiles[i]?.phone,
                engagement_rate:""
            }
        }
        res.status(200).json({
            data:finalOutput
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({"error":"Actor run failed."})
    }
}