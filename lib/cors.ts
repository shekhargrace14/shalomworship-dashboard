const allowedOrigins = ['https://www.shalomworship.com', 'https://dashboard.shalomworship.com', 'https://staging.shalomworship.pages.dev', 'http://localhost:3000', 'http://localhost:3001'];

export function getCorsHeaders(origin?: string | null) {
  const isAllowed = origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

//    Frontend
// 'https://www.shalomworship.com', - Frontend production
// 'http://localhost:3000' - Frontend dev
// 'https://staging.shalomworship.pages.dev', - Frontend production testing
// ,
// 'https://dashboard.shalomworship.com', - backend + api production
// 'http://localhost:3001' - backend + api - dev
