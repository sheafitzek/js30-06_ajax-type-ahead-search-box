const app = {
	cities: [],

	onloadFunction() {
		app.getCities();
		app.searchListener();
	},

	getCities() {
		const request = `https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json`;

		fetch(request)
			.then((response)=> response.json())
			.then((data)=> app.cities.push(...data));
	},

	searchListener() {
		const search = document.querySelector(`.search`);
		// const suggestions = document.querySelector(`.suggestions`);

		search.addEventListener(`change`, app.displayMatches);
		search.addEventListener(`keyup`, app.displayMatches);
	},

	displayMatches() {
		const suggestions = document.querySelector(`.suggestions`);
		const matchArray = app.findMatches(this.value, app.cities);
		const html = matchArray.map((place)=> {
			const regex = new RegExp(this.value, `gi`);
			const cityName = place.city
				.replace(regex, `<span class="hl">${this.value}</span>`);
			const stateName = place.state
				.replace(regex, `<span class="hl">${this.value}</span>`);

			return `
				<li>
					<span class="name">${cityName}, ${stateName}</span>
					<span class="population">${app.numberWithCommas(place.population)}</span>
				</li>
			`;
		}).join(``);

		suggestions.innerHTML = this.value === ``
			? `
			<li>Filter for a city</li>
			<li>or a state</li>`
			: html;
	},

	findMatches(wordToMatch, cities) {
		return cities.filter((place)=> {
			const regex = new RegExp(wordToMatch, `gi`);

			return place.city.match(regex) || place.state.match(regex);
		});
	},

	numberWithCommas(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
	},
};

window.onload = app.onloadFunction;
