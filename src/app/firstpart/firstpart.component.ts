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
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight-200),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    var gg = svg.append("g")


    d3.json("src/assets/world_geojson.json").then(function (json: any) {
      var colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, 300]);
      var projection = d3.geoMercator().fitSize([width, height + 250], json);
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
          .attr("class", "states")
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
    });

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

    var last_time = -1;

    function dragmove(d) {
      function get_year(d) {
        if (d > 500) {
          return 2;
        } else {
          return 1;
        }
      }
      var x = d3.event.x;
      x = x < x1 ? x1 : x > x2 ? x2 : x;
      d.x = x;
      circle.attr("cx", x);
      var x_value_of_circle: any = svg
        .select('#slider_circle')
        .attr("cx")
      x_value_of_circle = get_year(x_value_of_circle)
      console.log(x_value_of_circle)
      var date_now = new Date();
      var original_time = date_now.getTime();
      if (x_value_of_circle > 1) {
        if (last_time != x_value_of_circle) {
          d3.json("src/assets/world_geojson.json").then(function (json: any) {
            var colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, 300]);
            var projection = d3.geoMercator().fitSize([width, height + 100], json);
            var path = d3.geoPath().projection(projection);
            d3.json("src/assets/temp_tyk_country_launch_num2.json").then(function (country: any) {
              // var date_now = new Date();
              // var origin_time = date_now.getTime();
              // var now_time = date_now.getTime();
              // console.log("start_time"+now_time)
              // var first_count = date_now.getTime();
              // console.log("before deal with array" + first_count)

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
              // var second_count = date_now.getTime();
              // console.log("after deal with array" + second_count)


              gg.selectAll(".states")
                .data(json.features)
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

              // var third_count = date_now.getTime();
              // console.log("after redraw" + third_count)

            });
          });
          last_time = x_value_of_circle
        }
      } else {
        if (last_time != x_value_of_circle) {
          d3.json("src/assets/world_geojson.json").then(function (json: any) {
            var colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, 300]);
            var projection = d3.geoMercator().fitSize([width, height + 100], json);
            var path = d3.geoPath().projection(projection);
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
          });
          last_time=x_value_of_circle
        }
      }
    }
  }
}
