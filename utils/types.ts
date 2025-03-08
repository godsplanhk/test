export type LinkedInJobSearchParams = {
    keywords: string;
    locationId?: number;
    companyIds?: string;
    datePosted?: "anyTime" | "pastMonth" | "pastWeek" | "past24Hours";
    salary?: "40k+" | "60k+" | "80k+" | "100k+" | "120k+" | "140k+" | "160k+" | "180k+" | "200k+";
    jobType?: "fullTime" | "partTime" | "contract" | "internship";
    experienceLevel?: "internship" | "associate" | "director" | "entryLevel" | "midSeniorLevel" | "executive";
    titleIds?: string;
    functionIds?: string;
    start?: number; // 0, 50, 100, 150, ..., max 975
    industryIds?: string;
    onsiteRemote?: "onSite" | "remote" | "hybrid";
    sort?: "mostRelevant" | "mostRecent";
    distance?: "0" | "5" | "10" | "25" | "50" | "100"; // Distance in km mapped as: 0=0km, 5=8km, 10=16km, etc.
};
