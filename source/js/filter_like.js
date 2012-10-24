/*

Search something inside an array, using filters similars to "LIKE" filters from Oracle.
The search is case sensitive.

@param p_source Source.
@param rest Filters.

@return Matches of filter on source.

@author Rafael Rinaldi (rafaelrinaldi.com)
@since Sep 5, 2009

*/

var filterLike = function( p_source ) {
	
	var keyword,
	search,
	filter,
	filterSymbol,
	start, end,
	filters = Array.prototype.slice.call(arguments, 1),
	results = [],
	
	/*
	@param p_match Search match.
	@param p_search Symbol to search for.
	@param p_content Content to add.
	*/
	setResultByMatch = function( p_match ) {
		/*
		
		Requirements to pass the condition:
		
		• `results` list should not have `keyword` already.
		• `keyword` should match search.
		• `p_match` should have the same value as `search`.
		
		*/
		if(results.indexOf(keyword) < 0 && keyword.indexOf(search) >= 0 && p_match === search) results[results.length] = keyword;
	};
	
	for(keyword in p_source) {
		
		keyword = p_source[keyword];
		
		for(filter in filters) {
			
			filter = filters[filter];
			filterSymbol = filter.indexOf("%") >= 0 ? "%" : "_";
			start = filter.indexOf(filterSymbol);
			end = filter.lastIndexOf(filterSymbol);
			search = filter.split(filterSymbol).join("");

			if(filterSymbol === "_") {

				var underscores = filter.split("_").length - 1;

				if(underscores === 1 && search.length === 1) {

					// It's only one underscore
					setResultByMatch(keyword.charAt(underscores));

				} else {

					// Multiple underscores
					setResultByMatch(keyword.substring(underscores, underscores + search.length));

				}

				continue;

			}

			if(start === end) {

				// It's only one percent

				if(start === 0) {

					// Starts with percent
					setResultByMatch(keyword.substring((keyword.length - 1) - (search.length - 1)));

				} else {

					// Finish with percent
					setResultByMatch(keyword.substring(0, end));

				}

			} else {

				// Contain double percents
				if(keyword.indexOf(search) >= 0) {
					if(results.indexOf(keyword) < 0) {
						results[results.length] = keyword;
					}
				}

			}
		}

	}
	
	return results;
}