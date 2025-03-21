import { Request, Response } from 'express';
import axios from 'axios';
import { API_KEYS } from '../../../utils/apiKeys';


export const searchApolloPeople = async (req: Request, res: Response) => {
    try {
        const { person_name, page, not_organization_ids, organization_ids, person_past_organization_ids, person_titles, person_past_titles, person_not_titles, person_locations, zip_code, person_location_radius } = req.body;

        if (!API_KEYS.APPOLLO_API_KEY) {
            res.status(400).json({ error: "API key is required" });
            return 
        }

        const options = {
            method: 'GET',
            url: 'https://apollo-io-no-cookies-required.p.rapidapi.com/search_people',
            headers: {
                'x-rapidapi-key': API_KEYS.APPOLLO_API_KEY as string,
                'x-rapidapi-host': 'apollo-io-no-cookies-required.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            params: {
                q_person_name:person_name,
                page: page || 1,
                not_organization_ids,
                organization_ids,
                person_past_organization_ids,
                person_titles,
                person_past_titles,
                person_not_titles,
                person_locations,
                zip_code,
                person_location_radius
            }
        };

        const response = await axios.request(options);
        res.status(200).json(response.data);
        return 
    } catch (error: any) {
        console.error("🚨 Error fetching Apollo.io data:", error);
        res.status(error.response?.status || 500).json({ error: error.message });
        return 
    }
};


export const searchPeopleUrl = async (req:Request, res:Response) => {
    const {url, page} = req.body


        if (!API_KEYS.APPOLLO_API_KEY || !url) {
            res.status(400).json({ error: "API key and URL is required" });
            return 
        }
  const options = {
    method: 'POST',
    url: 'https://apollo-io-no-cookies-required.p.rapidapi.com/search_people_via_url',
    headers: {
      'x-rapidapi-key': API_KEYS.APPOLLO_API_KEY,
      'x-rapidapi-host': 'apollo-io-no-cookies-required.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      url: 'https://app.apollo.io/#/people?sortAscending=false&sortByField=%5Bnone%5D&page=1&qKeywords=ali&contactEmailStatusV2[]=verified&organizationNumEmployeesRanges[]=10001',
      page: page || 1
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error:any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};


export const getPersonDetails = async (req: Request, res: Response) => {
    const { person_id } = req.query

    if (!API_KEYS.APPOLLO_API_KEY || !person_id) {
        res.status(400).json({ error: "API key and person ID are required" });
        return 
    }

    const options = {
        method: 'GET',
        url: 'https://apollo-io-no-cookies-required.p.rapidapi.com/person_details',
        params: { person_id },
        headers: {
            'x-rapidapi-key': API_KEYS.APPOLLO_API_KEY,
            'x-rapidapi-host': 'apollo-io-no-cookies-required.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};
