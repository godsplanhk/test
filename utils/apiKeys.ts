import dotenv from 'dotenv';

dotenv.config();

// Helper function to parse API keys from environment variables
const getApiKeysArray = (baseName: string) => {
  const envValue = process.env[`${baseName}`] || '';
  console.log(envValue)
  return envValue ? envValue.split(',').map(key => key.trim()).filter(Boolean) : [];
};

// Helper function to get a random item from an array
const getRandomItem = (array: string | any[]) => {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
};

// Create API keys object with getters for random key selection
export const API_KEYS = {
  // Store the actual key arrays privately
  _keyArrays: {
    LINKEDIN_API_KEY: getApiKeysArray('LINKEDIN_API'),
    INSTAGRAM_API_KEY: getApiKeysArray('INSTAGRAM_API'),
    TWITTER_API_KEY: getApiKeysArray('TWITTER_API'),
    FACEBOOK_APIFY_API_KEY: getApiKeysArray('FACEBOOK_APIFY_API'),
    FACEBOOK_API_KEY: getApiKeysArray('FACEBOOK_API'),
    YOUTUBE_API_KEY: getApiKeysArray('YOUTUBE_API'),
    CRUNCHBASE_API_KEY: getApiKeysArray('CRUNCHBASE_API'),
    INDEED_API_KEY: getApiKeysArray('INDEED_API'),
    GLASSDOOR_API_KEY: getApiKeysArray('GLASSDOOR_API'),
    APPOLLO_API_KEY: getApiKeysArray('APPOLLO_API'),
    LINKEDIN_SALES_NAVIGATOR_API_KEY: getApiKeysArray('LINKEDIN_SALES_NAVIGATOR_API'),
    TIKTOK_API_KEY: getApiKeysArray('TIKTOK_API'),
    INFLUENCER_API_KEY: getApiKeysArray('INFLUENCER_API'),
    MAPS_API_KEY: getApiKeysArray('MAPS_API')
  },

  
  // Define getters for each service
  get LINKEDIN_API_KEY() {
    return getRandomItem(this._keyArrays.LINKEDIN_API_KEY);
  },
  
  get INSTAGRAM_API_KEY() {
    return getRandomItem(this._keyArrays.INSTAGRAM_API_KEY);
  },
  
  get TWITTER_API_KEY() {
    return getRandomItem(this._keyArrays.TWITTER_API_KEY);
  },
  
  get FACEBOOK_API_KEY() {
    return getRandomItem(this._keyArrays.FACEBOOK_API_KEY);
  },
  
  get YOUTUBE_API_KEY() {
    return getRandomItem(this._keyArrays.YOUTUBE_API_KEY);
  },
  
  get CRUNCHBASE_API_KEY() {
    return getRandomItem(this._keyArrays.CRUNCHBASE_API_KEY);
  },

  get FACEBOOK_APIFY_API_KEY() {
    return getRandomItem(this._keyArrays.FACEBOOK_APIFY_API_KEY);
  },

  get INDEED_API_KEY() {
    return getRandomItem(this._keyArrays.INDEED_API_KEY);
  },
  
  get GLASSDOOR_API_KEY() {
    return getRandomItem(this._keyArrays.GLASSDOOR_API_KEY);
  },
  
  get APPOLLO_API_KEY() {
    return getRandomItem(this._keyArrays.APPOLLO_API_KEY);
  },
  
  get LINKEDIN_SALES_NAVIGATOR_API_KEY() {
    return getRandomItem(this._keyArrays.LINKEDIN_SALES_NAVIGATOR_API_KEY);
  },
  
  get TIKTOK_API_KEY() {
    return getRandomItem(this._keyArrays.TIKTOK_API_KEY);
  },
  
  get INFLUENCER_API_KEY() {
    return getRandomItem(this._keyArrays.INFLUENCER_API_KEY);
  },
  
  get MAPS_API_KEY() {
    return getRandomItem(this._keyArrays.MAPS_API_KEY);
  }
};
