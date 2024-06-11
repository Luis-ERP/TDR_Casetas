
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

export function safeRoundNumber(number) {
	// for numbers larger than 1 thousand return k (for thousand), M (for million) format
	if (number >= 1000 && number < 1000000)
		return `${Math.round(number / 1000)}k`;
	else if (number >= 1000000)
		return `${Math.round(number / 1000000)}M`;
	return number;
}

export const calculateStatistics = (values) => {
    const n = values.length;
    const mu = values.reduce((sum, value) => sum + value, 0) / n;
    const sd = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - mu, 2), 0) / n);
    return { mu, sd, n };
};
