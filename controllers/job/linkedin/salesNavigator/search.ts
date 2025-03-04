import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Helper function to get filter ID based on filter type and value
const getFilterId = async (filterType: string, filterValue: string, apiKey: string) => {
    try {
        const response = await axios.get(`https://linkedin-sales-navigator-no-cookies-required.p.rapidapi.com/filter_${filterType.toLowerCase()}`, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'linkedin-sales-navigator-no-cookies-required.p.rapidapi.com',
            },
        });

        const filter = response.data[0]
        return filter ? filter.id : null;
    } catch (error) {
        console.error(`Error fetching filter ID for ${filterType}:`, error);
        throw new Error(`Unable to retrieve ID for filter type ${filterType}`);
    }
};

// Controller to handle LinkedIn Sales Navigator search
export async function searchSalesNavigator(req: Request, res: Response) {
    try {
        const { filters, page } = req.body;
        const apiKey = req.headers['x-api-key'] as string;

        if (!filters || !Array.isArray(filters)) {
            res.status(400).json({ error: 'Filters must be provided as an array' });
            return 
        }

        if (!apiKey) {
            res.status(500).json({ error: 'API key is not configured' });
            return 
        }

        // Construct the filter parameters
        const filterParams: any = {};
        for (const filter of filters) {
            const { type, value } = filter;
            const filterId = await getFilterId(type, value, apiKey);
            if (filterId) {
                filterParams[type] = filterId;
            } else {
                res.status(400).json({ error: `Invalid filter value for type ${type}` });
                return 
            }
        }

        console.log(filterParams)

        return

        // API request options
        const options = {
            method: 'POST',
            url: 'https://linkedin-sales-navigator-no-cookies-required.p.rapidapi.com/premium_search_person',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'linkedin-sales-navigator-no-cookies-required.p.rapidapi.com',
                'Content-Type': 'application/json',
            },
            data: {
                filters: filterParams,
                page: page || 1,
            },
        };

        // Make API request
        const response = await axios.request(options);

        // Return response data
        res.status(200).json(response.data.response);
    } catch (error: any) {
        console.error('Error fetching LinkedIn search data:', error);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};

