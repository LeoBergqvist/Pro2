import {
  select,
  json,
  tsv,
  geoPath,
  geoNaturalEarth1,
  zoom,
  event,
  scaleOrdinal,
  schemeSpectral
} from 'd3';
import {colorLegend} from './colorLegend';
import {loadAndProcessData} from './loadAndProcessData';

const svg = select('svg');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');

const colorLegendG = svg.append('g')
    .attr('transform', `translate(40,275)`);

g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

svg.call(zoom().on('zoom', () => {
  g.attr('transform', event.transform);
}));

const colorScale = scaleOrdinal();

loadAndProcessData().then(countries => {
  
  const colorValue = d => d.properties.economy;
  
  colorScale
    .domain(countries.features.map(colorValue))
  	.domain(colorScale.domain().sort().reverse())
  	.range(schemeSpectral[colorScale.domain().length]);
  
  colorLegendG.call(colorLegend, {
      colorScale,
      circleRadius: 10,
      spacing: 25,
      textOffset: 15
    });
  
  g.selectAll('path').data(countries.features)
    .enter().append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
  		.attr('fill',d => colorScale(colorValue(d)))
    .append('title')
      .text(d => d.properties.name + ": " + colorValue(d));
  
});