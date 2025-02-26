import { Request, Response } from 'express';
import axios from 'axios';

export const searchApolloOrganizations = async (req: Request, res: Response) => {
    try {
        const apiKey = req.headers['x-api-key']; // API key from request headers
        if (!apiKey) {
            res.status(401).json({ error: "Unauthorized: API key is missing" });
            return
        }

        // Extract request parameters
        const {
            organization_name,
            page = "1",
            organization_num_employees_ranges,
            organization_locations,
            zip_code,
            organization_location_radius,
            organization_industry_tag_ids,
            q_organization_keyword_tags,
            organization_ids
        } = req.body;

        // Validate required fields
        if (!organization_name) {
            res.status(400).json({ error: "Missing required field: organization_name" });
            return
        }

        // Build API request parameters dynamically
        const params: Record<string, any> = { q_organization_name: organization_name, page };
        if (organization_num_employees_ranges) params.organization_num_employees_ranges = organization_num_employees_ranges;
        if (organization_locations) params.organization_locations = organization_locations;
        if (zip_code) params.zip_code = zip_code;
        if (organization_location_radius) params.organization_location_radius = organization_location_radius;
        if (organization_industry_tag_ids) params.organization_industry_tag_ids = organization_industry_tag_ids;
        if (q_organization_keyword_tags) params.q_organization_keyword_tags = q_organization_keyword_tags;
        if (organization_ids) params.organization_ids = organization_ids;

        // API request options
        const options = {
            method: "GET",
            url: "https://apollo-io-no-cookies-required.p.rapidapi.com/search_organization",
            headers: {
                "x-rapidapi-key": apiKey as string,
                "x-rapidapi-host": "apollo-io-no-cookies-required.p.rapidapi.com",
                "Content-Type": "application/json"
            },
            params
        };

        // Make API request
        const response = await axios.request(options);

        // Return response data
        res.status(200).json(response.data);

    } catch (error: any) {
        console.error("🚨 Apollo.io API Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || "Failed to fetch data from Apollo.io"
        });
    }
};
