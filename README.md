# parallelized-icon-picker
Fully asynchronous and parallelized API that fetches icons for selected domains in base64.

## What does this API do?
It fetches and gives favicons for selected domains in different preselected sizes. The results can be limited and filtered based on query parameters.

## How to set it up?
 1. Clone the repo
 2. Install all the dependencies
```js
npm install
```
3. Setup the .env file or use the provided one for testing purposes
4. Run the fetch command to download a list of the top 10 million domains that we can use as a base for the domain autocomplete and search. This might take some time depending on the used machine
```js
npm run fetch
```
5. Start the server. If no changes are made to the .env file the server will be at `localhost:8080`
```js
npm run start
```

## How to use?
Two endpoints are currently implemented
1. `/recommended` - returns an array with the top 20 most visited domains and their favicons. Two query parameters can be added to the endpoint that can filter the result and limit its length.
   - `domain` instead of the top most visited domains, the API returns a list of domains that include the provided value
   - `limit` instead of 20 domains the API returns a selected number of results
3. `/get` - returns the favicon for a selected domain or `false` string response. It accepts only one mandatory query parameter.
   - `domain` exact name of the domain whose favicon we want to fetch

### Example request endpoints
`http://localhost:8080/get?domain=google.se` - return the favicon for google.se

`http://localhost:8080/get` - returns false

`http://localhost:8080/recommended?domain=google&limit=2` - returns the favicons for the 2 most visited domains that include `google` in their full domain names
