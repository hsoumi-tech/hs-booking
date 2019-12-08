import urlParse from "url-parse";

export const isProduction = process.env.NODE_ENV === "production";

export const currentProtocol = isProduction ? "https" : "http";

export const apiPort = process.env.API_PORT;

// Api Url build
const apiUrlBuilder = urlParse();
apiUrlBuilder.set("protocol", currentProtocol);
apiUrlBuilder.set("hostname", process.env.API_HOST);
if (process.env.API_PORT) {
  apiUrlBuilder.set("port", process.env.API_PORT);
}

export const apiUrl = apiUrlBuilder.toString();

// Database Url build
const dbUrlBuilder = urlParse();
dbUrlBuilder.set("protocol", process.env.DB_PROTOCOL || "mongodb");
dbUrlBuilder.set("hostname", process.env.DB_HOST);
if (process.env.DB_NAME) {
  dbUrlBuilder.set("pathname", process.env.DB_NAME);
}
if (process.env.DB_PORT) {
  dbUrlBuilder.set("port", process.env.DB_PORT);
}
if (process.env.DB_USER && process.env.DB_PASSWORD) {
  dbUrlBuilder.set("username", process.env.DB_USER);
  dbUrlBuilder.set("password", process.env.DB_PASSWORD);
}
if (process.env.DB_QUERY) {
  try {
    dbUrlBuilder.set("query", JSON.parse(process.env.DB_QUERY));
  } catch (err) {
    throw err;
  }
}
export const dbUrl = dbUrlBuilder.toString();
