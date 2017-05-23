var width  = 800
var height = 500
var margin = { top: 20, bottom: 20, left: 20, right: 20 }
var city   = 'New York'
var cityButtons = document.getElementsByClassName('cityButton');
var t = d3.transition().duration(2000);

d3.select('body')
	.append('svg')
	.attr('id', 'graph');

// add listener to re-render with button's city data
[].forEach.call(cityButtons, (cityButton) => {
	cityButton.addEventListener('click', function() {
		renderGraph(this.dataset.city)
	})
})

function renderGraph(city) {


	d3.tsv('public/data/data.tsv', (err, data) => {
		if (err) {
			console.log(err)
		}

		data.forEach((d) => {
			d.date = d3.timeParse('%Y%m%d')(d.date)
			d.date = new Date(d.date) // x axis value
			// cast temp datum from String to Number type
			++d[city] // y axis value
		})


		var xExtent = d3.extent(data, d => d.date)
    var xScale = d3.scaleTime()
			.domain(xExtent)
			.range([margin.left, width - margin.right])

		// range of values for temperature
		var yExtent = d3.extent([0,100])
    var yScale = d3.scaleLinear()
			.domain(yExtent)
			.range([height - margin.bottom, margin.top])

		var colorScale = d3.scaleLinear()
			.domain([0, 91])
			.range(['#2E4172', '#AA3939'])

		var heightScale = d3.scaleLinear()
			.domain(yExtent)
			.range([0, height - margin.top - margin.bottom])


		var svg = d3.select('svg')
			.attr('height', height)
			.attr('width', width)

		var bars = svg.selectAll('rect')
			.data(data, d => d)

		//exit
		bars.exit()
			.transition()
			.duration(500)
			.attr('y', d=> height - yScale(d[city]))
			.attr('height', 0)
			.remove();	

		// enter with static values
		var newBars = bars.enter()
			.append('rect')
			.attr('width', width / data.length)
			.attr('x', (d) => {
				return xScale(d.date)
			})
			.attr('height', 0)
			.attr('stroke', 'none')
			.attr('y', d => height - yScale(d[city]))


		// enter and update dynanmic values
		bars = newBars.merge(bars)
			.transition()
			.delay(500)
			.duration(500)
			.attr('y', (d) => {
				return yScale(d[city])
			})
			.attr('height', d => heightScale(d[city]))
			.attr('fill', (d) => {
				return colorScale(d[city])
			})


		var xAxis = d3.axisBottom()
			.scale(xScale)
			.tickFormat(d3.timeFormat('%b %Y'))

		var yAxis = d3.axisLeft()
			.scale(yScale)

	  svg.append('g')
     .attr('transform', 'translate(' + [0, height - margin.bottom] + ')')
     .call(xAxis)

    svg.append('g')
      .attr('transform', 'translate(' + [margin.left, 0] + ')')
      .call(yAxis)


	})
}

renderGraph(city)






