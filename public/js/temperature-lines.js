var width = 800
var height = 500
    var margin = {
     top: 20,
     bottom: 20,
     left: 20,
     right: 20
   }

var city = 'New York'

var cityButtons = document.getElementsByClassName('cityButton');

[].forEach.call(cityButtons, (cityButton) => {
  cityButton.addEventListener('click', function() {
    document.getElementById('graph').remove()
    renderGraph(this.dataset.city)
  })
})

function renderGraph(city) {

  d3.select('body').append('svg').attr('id', 'graph')

  d3.tsv('public/data/data.tsv', (err, data) => {
    if (err) {
      console.log(err)
    }
    data = data.slice(0,100);
    data.forEach((d) => {
      d.date = d3.timeParse('%Y%m%d')(d.date)
      d.date = new Date(d.date) // x axis values
          // convert temperature data from String to Number type
      ++d[city] // y axis values
    })

    var xExtent = d3.extent(data, d => d.date)
    var xScale = d3.scaleTime()
                        .domain(xExtent)
                        .range([margin.left, width - margin.right])

   var yMax = d3.max(data, d => d[city])
    var yScale = d3.scaleLinear()
                        .domain([0,yMax])
                        .range([height - margin.bottom, margin.top])

    var colorScale = d3.scaleLinear()
                           .domain([10, 90])
                           .range(['#2E4172', '#AA3939'])

    var heightScale = d3.scaleLinear()
                            .domain([0, yMax])
                            .range([0, height - margin.top - margin.bottom])

    var line = d3.line()
                 .x(d => xScale(d.date))
                 .y(d => yScale(d[city]))

    var catLine = d3.line()
                 .x(d => xScale(d.date))
                 .y(d => yScale(d[city]))
                 .curve(d3.curveStep)

    var svg = d3.select('svg')
            .attr('height', height)
            .attr('width', width)

            // svg.append('path')
            // .attr('d', line(data))
            // .attr('fill', 'none')
            // .attr('stroke', "blue")


            svg.append('path')
            .attr('d', catLine(data))
            .attr('fill', 'none')
            .attr('stroke', "red")



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


renderGraph(city);
