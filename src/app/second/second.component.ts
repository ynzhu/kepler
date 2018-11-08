import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class SecondComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var svg = d3.select("#orbits").append("svg") 
      .attr("class", "second")
      .attr("width", "1400")
      .attr("height", "700"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
    
    var radius_scale_earth = d3.scaleLinear().domain([0,6400]).range([0,700]);
    var radius_scale_leo = d3.scaleLinear().domain([0,2000+6400]).range([0,700]);
    var radius_scale_meo = d3.scaleLinear().domain([0,25000+6400]).range([0,700]);
    var radius_scale_geo = d3.scaleLinear().domain([0,46200+6400]).range([0,700]);

    svg.append("image")
    .attr("class", "earth")
    .attr("xlink:href", "src/assets/earth.svg")
    .attr("x", width/2 - radius_scale_earth(6400))
    .attr("y", -radius_scale_earth(6400))
    .attr("width", radius_scale_earth(6400)*2)
    .attr("height", radius_scale_earth(6400)*2)
    .transition()
    .delay(500)
    .duration(2000)
    .attr("x", width/2 - radius_scale_geo(6400))
    .attr("y", -radius_scale_geo(6400))
    .attr("width", radius_scale_geo(6400)*2)
    .attr("height", radius_scale_geo(6400)*2)

    svg.append("circle") //LEO, 187 - 2008 km
    .attr("class", "low")
    .attr("cx", width/2)
    .attr("r", radius_scale_earth(6400+500))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", radius_scale_geo(1000))
    .transition()
    .delay(500)
    .duration(2000)
    .attr("r", radius_scale_geo(6400+500))

    d3.csv("src/assets/full_data.csv").then(function(data){
      svg.selectAll(".satellites")
      .data(data)
      .enter()
      .append("circle")
      .attr("class","satellites")
      .attr("transform", "translate(" + (width / 2) + "," +0 + ")")
      .attr("r", 2)
      .attr("fill", "gold")
      .attr("cx", function(d:any){
        return radius_scale_geo((6400 + +d.Perigee) * Math.cos(Math.random()* Math.PI));
      })
      .attr("cy", function(d:any){
        return Math.sqrt(Math.pow(radius_scale_geo((6400 + +d.Perigee)),2) - Math.pow(+d3.select(this).attr("cx"), 2));
      })
      .attr("id", function(d:any){
        return d["Class of Orbit"]
      })

    })
    // svg.append("circle")
    //   .attr("class", "earth")
    //   .attr("cx", width/2)
    //   .attr("r", radius_scale_earth(6400+20000)) //6400km
    //   .attr("stroke", "black")
    //   .attr("fill", "none")
    //   .attr("stroke-width", "30px")
    //   .transition()
    //   .delay(500)
    //   .duration(2000)
    //   .attr("r", radius_scale_geo(6400+20000))
    
    svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", 0)
    .attr("r", radius_scale_earth(6400+46200))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", "100px")
    .transition()
    .delay(500)
    .duration(2000)
    .attr("r", radius_scale_geo(6400+35000))

    // var arc = d3.arc()
    // .outerRadius(radius_scale_geo(6400+46200))
    // .innerRadius(radius_scale_geo(6400+40000))
    // .startAngle(Math.PI * 0.5)
    // .endAngle(Math.PI*1.5);

    // svg.append("g")
    // .attr("transform", "translate(" + (width / 2) + "," +height + ")")
    // .append("path")
    // .attr("d",arc)
    // .transition()
    // .delay(500)
    // .duration(3000)
    // .attr("transform", "translate(" + 0 + "," + -height + ")");

    var arc2 = d3.arc()
    .outerRadius(radius_scale_earth(6400+25000))
    .innerRadius(radius_scale_earth(6400+23000))
    .startAngle(Math.PI * 0.5)
    .endAngle(Math.PI*1.5);

    var meo = svg.append("g")
    .attr("transform", "translate(" + (width / 2) + "," +0 + ")")
    .append("path")
    .attr("d",arc2)

    arc2.outerRadius(radius_scale_geo(6400+25000))
    .innerRadius(radius_scale_geo(6400+23000))
    .startAngle(Math.PI * 0.5)
    .endAngle(Math.PI*1.5);

    meo.transition()
    .delay(500)
    .duration(2000)
    .attr("d", arc2);
    


    // var meo_pie = d3.pie<any>()
    // .sort(null)
    // .value(function(d:any){return d.value;});

    // var path = d3.arc()
    // .outerRadius(radius_scale_geo(6400+25000))
    // .innerRadius(radius_scale_geo(6400+23000));

    // var label = d3.arc()
    // .outerRadius(radius_scale_geo(6400+25000))
    // .innerRadius(radius_scale_geo(6400+23000));

    // var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    // d3.csv("src/assets/meo_pie.csv").then(function(data:any){
    // var arc_meo = svg.append("g").attr("transform", "translate(" + (width / 2) + "," +height/2 + ")")
    // .selectAll(".arc")
    // .data(meo_pie(data))
    // .enter()
    // .append("g")
    // .attr("class", "arc");

    // arc_meo.append("path")
    //   .attr("d", <any>path)
    //   .attr("fill", function(d) { return color(d.data.value); });

    // arc_meo.append("text")
    //   .attr("transform", function(d:any) { return "translate(" + label.centroid(d) + ")"; })
    //   .attr("dy", "0.35em")
    //   .text(function(d:any) { return d.data.country; });

    // })

  }

}
