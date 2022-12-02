require('dotenv').config()
credentialsJsonPath = "./jwt/API_KEY.json";
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const analyticsDataClient = new BetaAnalyticsDataClient({keyFilename: credentialsJsonPath,});
const propertyId = process.env.PROPERTY_ID;

async function getVisits() {
  const [traficototal] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "365daysAgo", endDate: "today" }],
    metrics: [{ name: "activeUsers" }],
  });
  /*  return traficototal.rows[0].metricValues[0].value; */
  return traficototal.rows[0].metricValues[0].value;
}

async function getDownloads() {
  const [downloads] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "365daysAgo", endDate: "today" }],
    dimensions: [{ name: "outbound" }],
    metrics: [{ name: "activeUsers" }],
  });
  return downloads.rows[1].metricValues[0].value;
}

async function getGraphA() {
  const [visitsGraphA] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "60daysAgo", endDate: "30daysAgo" }],
    metrics: [{ name: "activeUsers" }],
  });
  if(visitsGraphA.rows.length == 0) {
    return 0
  }else {
  return visitsGraphA.rows[0].metricValues[0].value 
  }
}

async function getGraphB() {
  const [visitsGraphB] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "70daysAgo", endDate: "40daysAgo" }],
    metrics: [{ name: "activeUsers" }],
  });
  if(visitsGraphB.rows.length == 0 ) {
    return 0
  }else {
  return visitsGraphB.rows[0].metricValues[0].value 
  }
}

async function getGraphC() {
  const [visitsGraphC] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "120daysAgo", endDate: "90daysAgo" }],
    metrics: [{ name: "activeUsers" }],
  });
  if (visitsGraphC.rows.length == 0 ){
    return 0
  }else{
  return visitsGraphC.rows[0].metricValues[0].value 
  }
}

async function getGraphD() {
  const [visitsGraphD] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    metrics: [{ name: "activeUsers" }],
  });
  if (visitsGraphD.rows.length == 0 ){
    return 0
  }else{
  return visitsGraphD.rows[0].metricValues[0].value 
  }
}

async function getAllPageViewed() {
  const [visitas] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "2021-02-20", endDate: "today" }],
    dimensions: [{ name: "pagePathPlusQueryString" }, { name: "outbound" }],
    metrics: [{ name: "activeUsers" }, { name: "eventsPerSession" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: "5",
  });
  return visitas
}

module.exports = {
  getVisits,
  getDownloads,
  getGraphA,
  getGraphB,
  getGraphC,
  getGraphD,
  getAllPageViewed,
};
