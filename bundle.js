(function (d3, topojson) {
  'use strict';

  const colorLegend = (selection, props) => {
    const {
      colorScale,
      circleRadius,
      spacing,
      textOffset
    } = props;

    const backgroundRect = selection.selectAll('rect')
    	.data([null]);
    backgroundRect.enter().append('rect')
    	.merge(backgroundRect)
    		.attr('x',-circleRadius * 2)
    		.attr('y',-circleRadius * 2)
    		.attr('rx',circleRadius*2)
    		.attr('width',220)
    		.attr('height',spacing* colorScale.domain().length + 10)
    		.attr('fill','white')
    		.attr('opacity',0.8);
    
    
    const groups = selection.selectAll('.tick')
      .data(colorScale.domain());
    const groupsEnter = groups
      .enter().append('g')
        .attr('class', 'tick');
    groupsEnter
      .merge(groups)
        .attr('transform', (d, i) =>
          `translate(0, ${i * spacing})`
        );
    groups.exit().remove();

    groupsEnter.append('circle')
      .merge(groups.select('circle'))
        .attr('r', circleRadius)
        .attr('fill', colorScale);

    groupsEnter.append('text')
      .merge(groups.select('text'))
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset);
  };

  const loadAndProcessData = () => 
    Promise
      .all([
        d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
        d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
      ])
      .then(([tsvData, topoJSONdata]) => {
        const rowById = tsvData.reduce((accumulator, d) => {
          accumulator[d.iso_n3] = d;
          return accumulator;
        }, {});

        const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);

        countries.features.forEach(d => {
          Object.assign(d.properties, rowById[d.id]);
        });

        return countries;
      });

  const svg = d3.select('svg');

  const projection = d3.geoNaturalEarth1();
  const pathGenerator = d3.geoPath().projection(projection);

  const g = svg.append('g');

  const colorLegendG = svg.append('g')
      .attr('transform', `translate(40,275)`);

  g.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({type: 'Sphere'}));

  svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
  }));

  const colorScale = d3.scaleOrdinal();

  loadAndProcessData().then(countries => {
    
    const colorValue = d => d.properties.economy;
    
    colorScale
      .domain(countries.features.map(colorValue))
    	.domain(colorScale.domain().sort().reverse())
    	.range(d3.schemeSpectral[colorScale.domain().length]);
    
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

}(d3, topojson));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImNvbG9yTGVnZW5kLmpzIiwibG9hZEFuZFByb2Nlc3NEYXRhLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGNvbG9yTGVnZW5kID0gKHNlbGVjdGlvbiwgcHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGNvbG9yU2NhbGUsXG4gICAgY2lyY2xlUmFkaXVzLFxuICAgIHNwYWNpbmcsXG4gICAgdGV4dE9mZnNldFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgYmFja2dyb3VuZFJlY3QgPSBzZWxlY3Rpb24uc2VsZWN0QWxsKCdyZWN0JylcbiAgXHQuZGF0YShbbnVsbF0pO1xuICBiYWNrZ3JvdW5kUmVjdC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gIFx0Lm1lcmdlKGJhY2tncm91bmRSZWN0KVxuICBcdFx0LmF0dHIoJ3gnLC1jaXJjbGVSYWRpdXMgKiAyKVxuICBcdFx0LmF0dHIoJ3knLC1jaXJjbGVSYWRpdXMgKiAyKVxuICBcdFx0LmF0dHIoJ3J4JyxjaXJjbGVSYWRpdXMqMilcbiAgXHRcdC5hdHRyKCd3aWR0aCcsMjIwKVxuICBcdFx0LmF0dHIoJ2hlaWdodCcsc3BhY2luZyogY29sb3JTY2FsZS5kb21haW4oKS5sZW5ndGggKyAxMClcbiAgXHRcdC5hdHRyKCdmaWxsJywnd2hpdGUnKVxuICBcdFx0LmF0dHIoJ29wYWNpdHknLDAuOClcbiAgXG4gIFxuICBjb25zdCBncm91cHMgPSBzZWxlY3Rpb24uc2VsZWN0QWxsKCcudGljaycpXG4gICAgLmRhdGEoY29sb3JTY2FsZS5kb21haW4oKSk7XG4gIGNvbnN0IGdyb3Vwc0VudGVyID0gZ3JvdXBzXG4gICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0aWNrJyk7XG4gIGdyb3Vwc0VudGVyXG4gICAgLm1lcmdlKGdyb3VwcylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT5cbiAgICAgICAgYHRyYW5zbGF0ZSgwLCAke2kgKiBzcGFjaW5nfSlgXG4gICAgICApO1xuICBncm91cHMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gIGdyb3Vwc0VudGVyLmFwcGVuZCgnY2lyY2xlJylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgnY2lyY2xlJykpXG4gICAgICAuYXR0cigncicsIGNpcmNsZVJhZGl1cylcbiAgICAgIC5hdHRyKCdmaWxsJywgY29sb3JTY2FsZSk7XG5cbiAgZ3JvdXBzRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgndGV4dCcpKVxuICAgICAgLnRleHQoZCA9PiBkKVxuICAgICAgLmF0dHIoJ2R5JywgJzAuMzJlbScpXG4gICAgICAuYXR0cigneCcsIHRleHRPZmZzZXQpO1xufSIsImltcG9ydCB7IGZlYXR1cmUgfSBmcm9tICd0b3BvanNvbic7XG5pbXBvcnQgeyB0c3YsIGpzb24gfSBmcm9tICdkMyc7XG5leHBvcnQgY29uc3QgbG9hZEFuZFByb2Nlc3NEYXRhID0gKCkgPT4gXG4gIFByb21pc2VcbiAgICAuYWxsKFtcbiAgICAgIHRzdignaHR0cHM6Ly91bnBrZy5jb20vd29ybGQtYXRsYXNAMS4xLjQvd29ybGQvNTBtLnRzdicpLFxuICAgICAganNvbignaHR0cHM6Ly91bnBrZy5jb20vd29ybGQtYXRsYXNAMS4xLjQvd29ybGQvNTBtLmpzb24nKVxuICAgIF0pXG4gICAgLnRoZW4oKFt0c3ZEYXRhLCB0b3BvSlNPTmRhdGFdKSA9PiB7XG4gICAgICBjb25zdCByb3dCeUlkID0gdHN2RGF0YS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBkKSA9PiB7XG4gICAgICAgIGFjY3VtdWxhdG9yW2QuaXNvX24zXSA9IGQ7XG4gICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgIH0sIHt9KTtcblxuICAgICAgY29uc3QgY291bnRyaWVzID0gZmVhdHVyZSh0b3BvSlNPTmRhdGEsIHRvcG9KU09OZGF0YS5vYmplY3RzLmNvdW50cmllcyk7XG5cbiAgICAgIGNvdW50cmllcy5mZWF0dXJlcy5mb3JFYWNoKGQgPT4ge1xuICAgICAgICBPYmplY3QuYXNzaWduKGQucHJvcGVydGllcywgcm93QnlJZFtkLmlkXSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGNvdW50cmllcztcbiAgICB9KTtcbiIsImltcG9ydCB7XG4gIHNlbGVjdCxcbiAganNvbixcbiAgdHN2LFxuICBnZW9QYXRoLFxuICBnZW9OYXR1cmFsRWFydGgxLFxuICB6b29tLFxuICBldmVudCxcbiAgc2NhbGVPcmRpbmFsLFxuICBzY2hlbWVTcGVjdHJhbFxufSBmcm9tICdkMyc7XG5pbXBvcnQge2NvbG9yTGVnZW5kfSBmcm9tICcuL2NvbG9yTGVnZW5kJztcbmltcG9ydCB7bG9hZEFuZFByb2Nlc3NEYXRhfSBmcm9tICcuL2xvYWRBbmRQcm9jZXNzRGF0YSc7XG5cbmNvbnN0IHN2ZyA9IHNlbGVjdCgnc3ZnJyk7XG5cbmNvbnN0IHByb2plY3Rpb24gPSBnZW9OYXR1cmFsRWFydGgxKCk7XG5jb25zdCBwYXRoR2VuZXJhdG9yID0gZ2VvUGF0aCgpLnByb2plY3Rpb24ocHJvamVjdGlvbik7XG5cbmNvbnN0IGcgPSBzdmcuYXBwZW5kKCdnJyk7XG5cbmNvbnN0IGNvbG9yTGVnZW5kRyA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDQwLDI3NSlgKTtcblxuZy5hcHBlbmQoJ3BhdGgnKVxuICAgIC5hdHRyKCdjbGFzcycsICdzcGhlcmUnKVxuICAgIC5hdHRyKCdkJywgcGF0aEdlbmVyYXRvcih7dHlwZTogJ1NwaGVyZSd9KSk7XG5cbnN2Zy5jYWxsKHpvb20oKS5vbignem9vbScsICgpID0+IHtcbiAgZy5hdHRyKCd0cmFuc2Zvcm0nLCBldmVudC50cmFuc2Zvcm0pO1xufSkpO1xuXG5jb25zdCBjb2xvclNjYWxlID0gc2NhbGVPcmRpbmFsKCk7XG5cbmxvYWRBbmRQcm9jZXNzRGF0YSgpLnRoZW4oY291bnRyaWVzID0+IHtcbiAgXG4gIGNvbnN0IGNvbG9yVmFsdWUgPSBkID0+IGQucHJvcGVydGllcy5lY29ub215O1xuICBcbiAgY29sb3JTY2FsZVxuICAgIC5kb21haW4oY291bnRyaWVzLmZlYXR1cmVzLm1hcChjb2xvclZhbHVlKSlcbiAgXHQuZG9tYWluKGNvbG9yU2NhbGUuZG9tYWluKCkuc29ydCgpLnJldmVyc2UoKSlcbiAgXHQucmFuZ2Uoc2NoZW1lU3BlY3RyYWxbY29sb3JTY2FsZS5kb21haW4oKS5sZW5ndGhdKTtcbiAgXG4gIGNvbG9yTGVnZW5kRy5jYWxsKGNvbG9yTGVnZW5kLCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY2lyY2xlUmFkaXVzOiAxMCxcbiAgICAgIHNwYWNpbmc6IDI1LFxuICAgICAgdGV4dE9mZnNldDogMTVcbiAgICB9KTtcbiAgXG4gIGcuc2VsZWN0QWxsKCdwYXRoJykuZGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdjb3VudHJ5JylcbiAgICAgIC5hdHRyKCdkJywgcGF0aEdlbmVyYXRvcilcbiAgXHRcdC5hdHRyKCdmaWxsJyxkID0+IGNvbG9yU2NhbGUoY29sb3JWYWx1ZShkKSkpXG4gICAgLmFwcGVuZCgndGl0bGUnKVxuICAgICAgLnRleHQoZCA9PiBkLnByb3BlcnRpZXMubmFtZSArIFwiOiBcIiArIGNvbG9yVmFsdWUoZCkpO1xuICBcbn0pOyJdLCJuYW1lcyI6WyJ0c3YiLCJqc29uIiwiZmVhdHVyZSIsInNlbGVjdCIsImdlb05hdHVyYWxFYXJ0aDEiLCJnZW9QYXRoIiwiem9vbSIsImV2ZW50Iiwic2NhbGVPcmRpbmFsIiwic2NoZW1lU3BlY3RyYWwiXSwibWFwcGluZ3MiOiI7OztFQUFPLE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssS0FBSztJQUMvQyxNQUFNO01BQ0osVUFBVTtNQUNWLFlBQVk7TUFDWixPQUFPO01BQ1AsVUFBVTtLQUNYLEdBQUcs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