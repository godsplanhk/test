import axios from 'axios';
import { Request, Response } from 'express';

export const searchCompaniesSalesNavigator = async (req: Request, res: Response) => {
    const { url, page } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || !url) {
        res.status(400).json({ error: "API key and URL are required" });
        return 
    }

    const options = {
        method: 'POST',
        url: 'https://linkedin-sales-navigator-pay-per-lead.p.rapidapi.com/premium_search_company_via_url',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'linkedin-sales-navigator-pay-per-lead.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            page: page || 1,
            url
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
};


/**
 * Type definitions for all filter types
 */
interface BaseFilter {
  type: string;
}

interface RangeFilter extends BaseFilter {
  range: {
    min: number;
    max: number;
  };
}

interface ValueItem {
  id: string;
  text: string;
  selectionType: "INCLUDED" | "EXCLUDED";
}

interface ValueFilter extends BaseFilter {
  values: ValueItem[];
}

interface KeywordFilter extends BaseFilter {
  keywords: string;
}

interface TimeRangeFilter extends BaseFilter {
  timeRange: string;
}

interface GeoFilter extends BaseFilter {
  geoUrn: string;
  includedRegions?: string[];
  excludedRegions?: string[];
}

interface RelationshipFilter extends BaseFilter {
  relationship: object;
}

interface BooleanFilter extends BaseFilter {
  value: boolean;
}

type Filter = RangeFilter | ValueFilter | KeywordFilter | TimeRangeFilter | GeoFilter | RelationshipFilter | BooleanFilter;

/**
 * Interface for search request body with all possible filter parameters
 */
interface SearchRequestBody {
  page?: number;
  keywords?: string;
  industries?: ValueItem[];
  companySize?: ValueItem[];
  locations?: ValueItem[];
  revenue?: { min: number; max: number };
  headcount?: ValueItem[];
  foundedYear?: { min: number; max: number };
  employeeGrowth?: ValueItem[];
  jobFunctions?: ValueItem[];
  seniorities?: ValueItem[];
  headquarters?: ValueItem[];
  technologies?: ValueItem[];
  fundingStatus?: ValueItem[];
  lastRaised?: string;
  spotlights?: ValueItem[];
  relationshipStatus?: object;
  fortune?: ValueItem[];
  employeesOnLinkedin?: { min: number; max: number };
  followersOnLinkedin?: { min: number; max: number };
  postedOnLinkedin?: string;
  isHiring?: boolean;
  sortBy?: string;
  [key: string]: any; // Allow for additional properties
}

/**
 * Helper functions to create different types of filters
 */
function createRangeFilter(type: string, min: number, max: number): RangeFilter {
  return {
    type,
    range: {
      min,
      max
    }
  };
}

function createValueFilter(type: string, values: ValueItem[]): ValueFilter {
  return {
    type,
    values
  };
}

function createKeywordFilter(type: string, keywords: string): KeywordFilter {
  return {
    type,
    keywords
  };
}

function createTimeFilter(type: string, timeRange: string): TimeRangeFilter {
  return {
    type,
    timeRange
  };
}

function createGeoFilter(type: string, geoUrn: string, includedRegions: string[] = [], excludedRegions: string[] = []): GeoFilter {
  return {
    type,
    geoUrn,
    includedRegions,
    excludedRegions
  };
}

function createRelationshipFilter(type: string, relationship: object): RelationshipFilter {
  return {
    type,
    relationship
  };
}

function createBooleanFilter(type: string, value: boolean): BooleanFilter {
  return {
    type,
    value
  };
}


export const searchCompaniesComprehensive = async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"] as string;

  // Validate API key
  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  // Extract all possible parameters from request body
  const {
    page = 1,
    keywords,
    industries,
    companySize,
    locations,
    revenue,
    headcount,
    foundedYear,
    employeeGrowth,
    jobFunctions,
    seniorities,
    headquarters,
    technologies,
    fundingStatus,
    lastRaised,
    spotlights,
    relationshipStatus,
    fortune,
    employeesOnLinkedin,
    followersOnLinkedin,
    postedOnLinkedin,
    isHiring,
    sortBy
  }: SearchRequestBody = req.body;

  // Initialize filters array
  const filters: Filter[] = [];

  // 1. KEYWORDS - Keyword filter
  if (keywords) {
    filters.push(createKeywordFilter("KEYWORDS", keywords));
  }

  // 2. INDUSTRY - Industry filter (e.g., Technology, Healthcare, Finance)
  if (industries && industries.length > 0) {
    filters.push(createValueFilter("INDUSTRY", industries));
  }

  // 3. COMPANY_SIZE - Company size filter (e.g., 1-10, 11-50, 51-200)
  if (companySize && companySize.length > 0) {
    filters.push(createValueFilter("COMPANY_SIZE", companySize));
  }

  // 4. GEOGRAPHY - Location/Geography filter
  if (locations && locations.length > 0) {
    filters.push(createValueFilter("GEOGRAPHY", locations));
  }

  // 5. ANNUAL_REVENUE - Revenue filter (in millions)
  if (revenue && revenue.min !== undefined && revenue.max !== undefined) {
    filters.push(createRangeFilter("ANNUAL_REVENUE", revenue.min, revenue.max));
  }

  // 6. COMPANY_HEADCOUNT - Headcount filter (e.g., 201-500, 501-1000)
  if (headcount && headcount.length > 0) {
    filters.push(createValueFilter("COMPANY_HEADCOUNT", headcount));
  }

  // 7. FOUNDED_YEAR - Year the company was founded
  if (foundedYear && foundedYear.min !== undefined && foundedYear.max !== undefined) {
    filters.push(createRangeFilter("FOUNDED_YEAR", foundedYear.min, foundedYear.max));
  }

  // 8. EMPLOYEE_GROWTH - Growth rate of employees
  if (employeeGrowth && employeeGrowth.length > 0) {
    filters.push(createValueFilter("EMPLOYEE_GROWTH", employeeGrowth));
  }

  // 9. JOB_FUNCTION - Job functions within company (e.g., Engineering, Sales)
  if (jobFunctions && jobFunctions.length > 0) {
    filters.push(createValueFilter("JOB_FUNCTION", jobFunctions));
  }

  // 10. SENIORITY - Seniority levels (e.g., Director, VP, C-level)
  if (seniorities && seniorities.length > 0) {
    filters.push(createValueFilter("SENIORITY", seniorities));
  }

  // 11. HEADQUARTERS - Company headquarters location
  if (headquarters && headquarters.length > 0) {
    filters.push(createValueFilter("HEADQUARTERS", headquarters));
  }

  // 12. TECHNOLOGY - Technologies used by the company
  if (technologies && technologies.length > 0) {
    filters.push(createValueFilter("TECHNOLOGY", technologies));
  }

  // 13. FUNDING_STATUS - Funding status of the company
  if (fundingStatus && fundingStatus.length > 0) {
    filters.push(createValueFilter("FUNDING_STATUS", fundingStatus));
  }

  // 14. LAST_RAISED - When the company last raised funding
  if (lastRaised) {
    filters.push(createTimeFilter("LAST_RAISED", lastRaised));
  }

  // 15. SPOTLIGHTS - Special highlights/attributes of companies
  if (spotlights && spotlights.length > 0) {
    filters.push(createValueFilter("SPOTLIGHTS", spotlights));
  }

  // 16. RELATIONSHIP - Relationship status with your company
  if (relationshipStatus) {
    filters.push(createRelationshipFilter("RELATIONSHIP", relationshipStatus));
  }

  // 17. FORTUNE - Fortune ranking (e.g., Fortune 500, Fortune 1000)
  if (fortune && fortune.length > 0) {
    filters.push(createValueFilter("FORTUNE", fortune));
  }

  // 18. EMPLOYEES_ON_LINKEDIN - Number of employees on LinkedIn
  if (employeesOnLinkedin && employeesOnLinkedin.min !== undefined && employeesOnLinkedin.max !== undefined) {
    filters.push(createRangeFilter("EMPLOYEES_ON_LINKEDIN", employeesOnLinkedin.min, employeesOnLinkedin.max));
  }

  // 19. FOLLOWERS_ON_LINKEDIN - Number of followers on LinkedIn
  if (followersOnLinkedin && followersOnLinkedin.min !== undefined && followersOnLinkedin.max !== undefined) {
    filters.push(createRangeFilter("FOLLOWERS_ON_LINKEDIN", followersOnLinkedin.min, followersOnLinkedin.max));
  }

  // 20. POSTED_ON_LINKEDIN - When the company last posted on LinkedIn
  if (postedOnLinkedin) {
    filters.push(createTimeFilter("POSTED_ON_LINKEDIN", postedOnLinkedin));
  }

  // 21. IS_HIRING - Whether the company is currently hiring
  if (isHiring !== undefined) {
    filters.push(createBooleanFilter("IS_HIRING", isHiring));
  }

  console.log(filters)
 
  // Construct the data object
  const data: any = {
    page,
    filters
  };

  // Add sort parameter if specified
  if (sortBy) {
    data.sortBy = sortBy;
  }

  // Construct request options
  const options = {
    method: "POST",
    url: "https://linkedin-sales-navigator-pay-per-lead.p.rapidapi.com/premium_search_company",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "linkedin-sales-navigator-pay-per-lead.p.rapidapi.com"
    },
    data
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data 
    });
  }
};

/**
 * Controller to get filter examples and reference data
 */
export const getCompanyFilterReference = (req: Request, res: Response) => {
  // Reference information for each filter type
  const filterReference = {
    industry: {
      description: "Industry sectors the company operates in",
      example: [
        { id: "4", text: "Software", selectionType: "INCLUDED" },
        { id: "5", text: "Technology", selectionType: "INCLUDED" }
      ]
    },
    companySize: {
      description: "Size of the company by employee count categories",
      example: [
        { id: "A", text: "1-10", selectionType: "INCLUDED" },
        { id: "B", text: "11-50", selectionType: "INCLUDED" },
        { id: "C", text: "51-200", selectionType: "INCLUDED" },
        { id: "D", text: "201-500", selectionType: "INCLUDED" },
        { id: "E", text: "501-1000", selectionType: "INCLUDED" },
        { id: "F", text: "1001-5000", selectionType: "INCLUDED" },
        { id: "G", text: "5001-10000", selectionType: "INCLUDED" },
        { id: "H", text: "10001+", selectionType: "INCLUDED" }
      ]
    },
    geography: {
      description: "Geographic locations where the company operates",
      example: [
        { id: "us:0", text: "United States", selectionType: "INCLUDED" },
        { id: "sf:0", text: "San Francisco Bay Area", selectionType: "INCLUDED" }
      ]
    },
    revenue: {
      description: "Annual revenue range in millions of dollars",
      example: { min: 100, max: 500 }
    },
    headcount: {
      description: "Specific headcount ranges, similar to company size but more precise",
      example: [
        { id: "E", text: "201-500", selectionType: "INCLUDED" }
      ]
    },
    foundedYear: {
      description: "Year range when the company was founded",
      example: { min: 2010, max: 2023 }
    },
    employeeGrowth: {
      description: "Employee growth rate over recent periods",
      example: [
        { id: "growing_10_plus", text: "Growing (10%+)", selectionType: "INCLUDED" },
        { id: "growing_20_plus", text: "Growing (20%+)", selectionType: "INCLUDED" }
      ]
    },
    jobFunctions: {
      description: "Job functions/departments within the company",
      example: [
        { id: "1", text: "Engineering", selectionType: "INCLUDED" },
        { id: "2", text: "Sales", selectionType: "INCLUDED" },
        { id: "3", text: "Marketing", selectionType: "INCLUDED" }
      ]
    },
    seniorities: {
      description: "Seniority levels of employees",
      example: [
        { id: "director", text: "Director", selectionType: "INCLUDED" },
        { id: "vp", text: "VP", selectionType: "INCLUDED" },
        { id: "cxo", text: "CXO", selectionType: "INCLUDED" }
      ]
    },
    headquarters: {
      description: "Company headquarters location",
      example: [
        { id: "sf:0", text: "San Francisco", selectionType: "INCLUDED" },
        { id: "nyc:0", text: "New York", selectionType: "INCLUDED" }
      ]
    },
    technologies: {
      description: "Technologies used by the company",
      example: [
        { id: "aws", text: "AWS", selectionType: "INCLUDED" },
        { id: "react", text: "React", selectionType: "INCLUDED" },
        { id: "node", text: "Node.js", selectionType: "INCLUDED" }
      ]
    },
    fundingStatus: {
      description: "Current funding status of the company",
      example: [
        { id: "seed", text: "Seed", selectionType: "INCLUDED" },
        { id: "seriesa", text: "Series A", selectionType: "INCLUDED" },
        { id: "seriesb", text: "Series B", selectionType: "INCLUDED" }
      ]
    },
    lastRaised: {
      description: "When the company last raised funding",
      example: "LAST_3_MONTHS" // Common values: LAST_3_MONTHS, LAST_6_MONTHS, LAST_YEAR
    },
    spotlights: {
      description: "Special highlights or attributes of companies",
      example: [
        { id: "high_growth", text: "High Growth", selectionType: "INCLUDED" },
        { id: "recently_funded", text: "Recently Funded", selectionType: "INCLUDED" }
      ]
    },
    relationshipStatus: {
      description: "Relationship status with your company",
      example: {
        // Complex object structure - check API documentation for details
        type: "connection_strength",
        value: "strong"
      }
    },
    fortune: {
      description: "Fortune ranking list inclusion",
      example: [
        { id: "fortune500", text: "Fortune 500", selectionType: "INCLUDED" },
        { id: "fortune1000", text: "Fortune 1000", selectionType: "INCLUDED" }
      ]
    },
    employeesOnLinkedin: {
      description: "Number of employees on LinkedIn",
      example: { min: 100, max: 5000 }
    },
    followersOnLinkedin: {
      description: "Number of followers on LinkedIn",
      example: { min: 1000, max: 50000 }
    },
    postedOnLinkedin: {
      description: "When the company last posted on LinkedIn",
      example: "LAST_30_DAYS" // Common values: LAST_7_DAYS, LAST_30_DAYS, LAST_90_DAYS
    },
    isHiring: {
      description: "Whether the company is currently hiring",
      example: true
    }
  };

  // Provide complete example filters
  const exampleFilters = {
    // Example 1: Tech startup in San Francisco with 51-200 employees and recent funding
    techStartup: {
      page: 1,
      filters: [
        createValueFilter("INDUSTRY", [
          { id: "4", text: "Software", selectionType: "INCLUDED" },
          { id: "5", text: "Technology", selectionType: "INCLUDED" }
        ]),
        createValueFilter("GEOGRAPHY", [
          { id: "sf:0", text: "San Francisco Bay Area", selectionType: "INCLUDED" }
        ]),
        createValueFilter("COMPANY_HEADCOUNT", [
          { id: "C", text: "51-200", selectionType: "INCLUDED" }
        ]),
        createValueFilter("FUNDING_STATUS", [
          { id: "seriesa", text: "Series A", selectionType: "INCLUDED" },
          { id: "seriesb", text: "Series B", selectionType: "INCLUDED" }
        ]),
        createTimeFilter("LAST_RAISED", "LAST_YEAR"),
        createBooleanFilter("IS_HIRING", true)
      ]
    },
    
    // Example 2: Enterprise software companies with $500M+ revenue and engineering departments
    enterpriseSoftware: {
      page: 1,
      filters: [
        createValueFilter("INDUSTRY", [
          { id: "4", text: "Software", selectionType: "INCLUDED" }
        ]),
        createRangeFilter("ANNUAL_REVENUE", 500, 5000),
        createValueFilter("JOB_FUNCTION", [
          { id: "1", text: "Engineering", selectionType: "INCLUDED" }
        ]),
        createValueFilter("TECHNOLOGY", [
          { id: "cloud", text: "Cloud Computing", selectionType: "INCLUDED" },
          { id: "saas", text: "SaaS", selectionType: "INCLUDED" }
        ]),
        createValueFilter("COMPANY_SIZE", [
          { id: "F", text: "1001-5000", selectionType: "INCLUDED" },
          { id: "G", text: "5001-10000", selectionType: "INCLUDED" }
        ])
      ]
    },
    
    // Example 3: High-growth healthcare companies founded after 2015
    healthcareGrowth: {
      page: 1,
      filters: [
        createValueFilter("INDUSTRY", [
          { id: "14", text: "Healthcare", selectionType: "INCLUDED" },
          { id: "15", text: "Medical Devices", selectionType: "INCLUDED" }
        ]),
        createRangeFilter("FOUNDED_YEAR", 2015, 2025),
        createValueFilter("EMPLOYEE_GROWTH", [
          { id: "growing_20_plus", text: "Growing (20%+)", selectionType: "INCLUDED" }
        ]),
        createRangeFilter("EMPLOYEES_ON_LINKEDIN", 50, 1000),
        createValueFilter("SPOTLIGHTS", [
          { id: "high_growth", text: "High Growth", selectionType: "INCLUDED" }
        ])
      ]
    }
  };
  
  res.status(200).json({
    filterReference,
    exampleFilters
  });
};
