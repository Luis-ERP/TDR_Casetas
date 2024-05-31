
export function objectToUrlQueryString(urlString, params) {
	if (params.length === 0)
		return urlString;
	let queryString = Object.entries(params).reduce((previousValue, currentValue) => previousValue + `&${currentValue[0]}=${currentValue[1]}`, '');
	queryString = queryString.slice(1, queryString.length);
	if (queryString !== '')
		return `${urlString}?${queryString}`;
	return urlString;
}

export function urlQueryStringToObject(urlString) {
	const params = {};
	let queries  = urlString.split('?');
	if (queries.length > 1) {
		queries = queries[1];
		queries = queries.split('&');
		queries.forEach(query => {
			const splitedQuery = query.split('=');
			if (splitedQuery.length > 1)
				params[splitedQuery[0]] = splitedQuery[1];
		});
	}
	return params;
}

export function replaceUrlVariables(route, values) {
	if (!Array.isArray(values))
		throw new Error('Values must be provided as an array.');

	let result = route;
	for (const value of values) {
	  result = result.replace(/:\w+/, value);
	}
	return result;
}