import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

export interface valueofone { date: string; value: number }
export interface trade { country: string; trade_2017: number; latitude: number, longtitude: number }

@Component({
  selector: 'app-firstpart',
  templateUrl: './firstpart.component.html',
  styleUrls: ['./firstpart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FirstpartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var svg = d3.select("#worldmap")
      .append("svg")
      .attr("class", "first")
      .attr("width", "1280")
      .attr("height", "1500"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    var gg = svg.append("g")
      .attr("transform", "translate(0 15)");


    d3.json("src/assets/world_geojson.json").then(function (json: any) {
      var colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, 300]);
      var projection = d3.geoMercator().fitSize([width, height + 100], json);
      var path = d3.geoPath().projection(projection);

      gg.selectAll("path")
        .data(json.features)  //data join with features
        .enter()
        .append("path")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("d", path);  //generate geographic path

      d3.json("src/assets/temp_tyk_country_launch_num.json").then(function (country: any) {
        var countryArray = new Array();
        countryArray = country.map(d => d.country);
        var valueArray = country.map(d => d.num);
        var jsonValueArray = new Array();

        var jsonCountryArray = new Array();
        for (var j = 0; j < countryArray.length; j++) {
          for (var i = 0; i < json.features.length; i++) {
            if (json.features[i]["properties"]["NAME"] == countryArray[j]) {
              jsonCountryArray.push(json.features[i]);
              jsonValueArray.push(valueArray[j]);
            }
          }
        }

        gg.selectAll(".states")
          .data(json.features)
          .enter()
          .append("path")
          .attr("fill", function (d, i) {
            var index = countryArray.indexOf(d["properties"]["NAME"]);
            if (index >= 0) {
              // console.log(d["properties"]["NAME"] + " " + jsonValueArray[index]);
              return (colorScale(jsonValueArray[index]));
            } else {
              return "white";
            }
          })
          .attr("stroke", "black")
          .attr("d", path);
      });


      d3.json("src/assets/tradevalue.json").then(function (data: any) {
        gg.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function (d: trade) {
            return +projection([d.longtitude, d.latitude,])[0]
          })
          .attr("cy", function (d: trade) { return +projection([d.longtitude, d.latitude])[1] })
          .attr("r", function (d: trade) { return +d.trade_2017 / 40; })
          .attr("fill", "red")
          .attr("opacity", "0.55");

        gg.selectAll(".first_country")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "first_country")
          .attr("x", function (d: trade) {
            return +projection([d.longtitude, d.latitude,])[0]
          })
          .attr("y", function (d: trade) { return +projection([d.longtitude, d.latitude])[1] })
          .text(function (d: trade) { return d.country });

        svg.append("text")
          .attr("x", width / 2)
          .attr("y", 20)
          .attr("font-size", 20)
          .attr("font-weight", "bold")
          .style('text-anchor', 'middle')
          .text("Proportional Symbol Map for World Satellites")
        // console.log(d3.extent(data, function(d:trade){return d.trade_2017}))
        gg.selectAll(".first_legend")
          .data(d3.extent(data, function (d: trade) { return d.trade_2017 }))
          .enter()
          .append("circle")
          .attr("cx", width - 200)
          .attr("cy", height - 200)
          .attr("r", function (d) { return d / 40; })
          .attr("fill", "red")
          .attr("opacity", "0.55")

        gg.selectAll(".first_legend")
          .data(d3.extent(data, function (d: trade) { return d.trade_2017 }))
          .enter()
          .append("text")
          .attr("x", width - 200 + 55)
          .attr("y", function (d, i) { return height - 200 - i * 20; })
          .text(function (d) { return Math.round(d / 10) + " Satellites" });
      })
    });

    var width = 960;
    var height = 500;
    var radius = 20;
    var margin = 100;

    var x1 = margin;
    var x2 = width - margin;
    var y = height / 2;

    var drag: any = d3.drag()
      .on("drag", dragmove);

    var svg_slider = d3.select(".first")
      .append("g")
      .attr("transform", "translate(0 500)")
      .attr("width", width)
      .attr("height", height)
      .datum({
        x: width / 2,
        y: height / 2
      });

    var line = svg_slider.append("line")
      .attr("x1", x1)
      .attr("x2", x2)
      .attr("y1", y)
      .attr("y2", y)
      .style("stroke", "black")
      .style("stroke-linecap", "round")
      .style("stroke-width", 5);

    var circle = svg_slider.append("circle")
      .attr("id", "slider_circle")
      .attr("r", radius)
      .attr("cy", function (d) { return d.y; })
      .attr("cx", function (d) { return d.x; })
      .style("cursor", "ew-resize")
      .call(drag);

    function dragmove(d) {
      var x = d3.event.x;
      x = x < x1 ? x1 : x > x2 ? x2 : x;
      d.x = x;
      circle.attr("cx", x);
      var x_value_of_circle: any = svg
      .select('#slider_circle')
      .attr("cx")
      console.log(x_value_of_circle)
    }
  }
}
