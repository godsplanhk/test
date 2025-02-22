import axios from "axios";
import { Request, Response } from "express";

function generateLinkedInURL( company_id:any, company_name:any, location_id = null, location_name = null, keyword = "job", page=1 ) {
  const data = {account_number:1,page,"filters":[
    {
      "type":"CURRENT_COMPANY",
      "values":[
        {
          "id":`urn:li:organization:${company_id}`,
          "text":company_name,
          "selectionType":"INCLUDED"
        }]
      },
      {"type":"GEO_REGION",
      "values":[{
          "id": `urn:li:geo:${location_id}`,
          "text": location_name,
          "selectionType": "INCLUDED"
      }]}]
    }
    return data
}


export const getPossibleHiringManager = async (req: Request, res: Response) => {
  const { company_name, location, page } = req.body; // Get job title, company name, and location from request body
  const apiKey = req.headers["x-api-key"] as string; // Get API key from headers


  if (!company_name || !location) {
    res.status(400).json({ error: "company name, and location are required" });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  async function getCompanyId(){
    const options = {
      method: 'GET',
      url: 'https://linkedin-api8.p.rapidapi.com/get-company-details',
      params: {username: company_name},
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      return {id:response.data.data.id, name:response.data.data.name}
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async function getLocationId(){
    const options = {
      method: 'GET',
      url: 'https://linkedin-api8.p.rapidapi.com/search-locations',
      params: {keyword:   location},
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      return {id:response.data.data.items[0].id.replace("urn:li:geo:",""),name:response.data.data.items[0].name}
    } catch (error) {
      return undefined
    }
  }

  function delay(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const comp_id = await getCompanyId()
  await delay(1000)
  const loc_id = await getLocationId()

  if(!comp_id || !loc_id){
    res.status(404).json("Company or Location not found")
    return
  }



  const url = generateLinkedInURL(comp_id.id, comp_id.name, loc_id.id, loc_id.name)

  const options = {
    method: "POST",
    url: "https://linkedin-sales-navigator-no-cookies-required.p.rapidapi.com/premium_search_person",
    headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "linkedin-sales-navigator-no-cookies-required.p.rapidapi.com",
        "Content-Type": "application/json"
    },
    data: url
    };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
