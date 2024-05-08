import json

def parse_query_params(query_params: dict):
	params = {}
	for key, value in query_params.items():
		value = value.replace('/', '')
		# Change format of bools
		if value == "false" or value == "False":
			params[key] = False 
		elif value == "true" or value == "True":
			params[key] = True 
		else:
			params[key] = value 
		# Change format ints
		try:
			params[key] = int(value)
		except ValueError:
			pass
		# Change format of json d-types
		if '[' in value or '{' in value:
			try:
				params[key] = json.loads(value)
			except:
				pass
	return params 