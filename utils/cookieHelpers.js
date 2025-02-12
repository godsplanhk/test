const cookieArray = [
    {
        "domain": ".instagram.com",
        "expirationDate": 1768406333.126197,
        "hostOnly": false,
        "httpOnly": true,
        "name": "ps_n",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "1"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1768406332.847601,
        "hostOnly": false,
        "httpOnly": true,
        "name": "datr",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "PGVYZ2D84Kn-wPWwkRUdM3C_"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1747063292.989938,
        "hostOnly": false,
        "httpOnly": false,
        "name": "ds_user_id",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "55895073729"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1770736892.989733,
        "hostOnly": false,
        "httpOnly": false,
        "name": "csrftoken",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "syaiYkC2DKgpH9CFuBpUkA3sr2blWaTc"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1765382343.15107,
        "hostOnly": false,
        "httpOnly": true,
        "name": "ig_did",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "902C8877-1CAD-484F-95F3-E599037E0291"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1768406333.126095,
        "hostOnly": false,
        "httpOnly": true,
        "name": "ps_l",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "1"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1739891980,
        "hostOnly": false,
        "httpOnly": false,
        "name": "wd",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "1284x649"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1771493180.517038,
        "hostOnly": false,
        "httpOnly": true,
        "name": "mid",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "Z4d_PAAEAAF1wCgHS9H8Fah-wm2N"
    },
    {
        "domain": ".instagram.com",
        "expirationDate": 1770822354.527791,
        "hostOnly": false,
        "httpOnly": true,
        "name": "sessionid",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "55895073729%3Au5f6M24NU1q9wf%3A10%3AAYczeJfI8a8y5uA5-6vB2XKuFZ_Ein4C8smpVs3CDmc"
    },
    {
        "domain": ".instagram.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "rur",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": true,
        "storeId": null,
        "value": "\"HIL\\05455895073729\\0541770823292:01f71f3ea8af518e9c57e63ac35e52bac4de7320c1e7cec48eb80d9a48470a4ec5887877\""
    }
];

// Convert the array to a JSON string without new lines
const jsonString = JSON.stringify(cookieArray, null, 0).replace(/\s+/g, '');

