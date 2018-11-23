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
    this.createChart();
  }
  ngOnChanges(): void {
    this.createChart();
  }
  onResize() {
    this.createChart();
  }
  private createChart(): void {
    d3.select(".first").remove()
    d3.select(".first").remove()
    var svg = d3.select("#worldmap")
      .append("svg")
      .attr("class", "first")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight * 0.7),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    var gg = svg.append("g")
    var path
    var colorScale = d3.scaleSequential(d3.interpolateGreens).domain([0, 100]);
    d3.json("src/assets/world_geojson.json").then(function (json: any) {
      var projection = d3.geoMercator().fitSize([width, height * 1.4], json);
      path = d3.geoPath().projection(projection);

      gg.selectAll("path")
        .data(json.features)  //data join with features
        .enter()
        .append("path")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("d", path);  //generate geographic path
      d3.json("src/assets/num_by_owner_data/num_by_owner_1996.json").then(function (country: any) {
        var countryArray = new Array();
        countryArray = country.map(d => d.country);
        var valueArray = country.map(d => d.num);

        // var jsonValueArray = new Array();

        // var jsonCountryArray = new Array();
        // for (var j = 0; j < countryArray.length; j++) {
        //   for (var i = 0; i < json.features.length; i++) {
        //     if (json.features[i]["properties"]["NAME"] == countryArray[j]) {
        //       jsonCountryArray.push(json.features[i]);
        //       jsonValueArray.push(valueArray[j]);
        //     }
        //   }
        // }

        gg.selectAll(".states")
          .data(json.features)
          .enter()
          .append("path")
          .attr("class", "states")
          .attr("fill", function (d, i) {
            var index = countryArray.indexOf(d["properties"]["NAME"]);
            if (index >= 0) {
              // console.log(d["properties"]["NAME"] + " " + jsonValueArray[index]+" , "+index);
              // console.log(d["properties"]["NAME"]+":color: "+colorScale(jsonValueArray[index]))
              return (colorScale(valueArray[index]));
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

    var svg_slider = d3.select("#worldmap")
      .append("svg")
      .attr("class", "first")
      .attr("width", width)
      .attr("height", 200)
      .append("g")
      // .attr("transform", "translate(0 -300)")
      // .attr("width", width)
      // .attr("height", 200)
      .datum({
        x: width / 2,
        y: height / 2
      });

    var line = svg_slider.append("line")
      .attr("x1", x1)
      .attr("x2", x2)
      .attr("y1", 100)
      .attr("y2", 100)
      .style("stroke", "black")
      .style("stroke-linecap", "round")
      .style("stroke-width", 5);

    var circle = svg_slider.append("circle")
      .attr("id", "slider_circle")
      .attr("r", radius)
      .attr("cy", 100)
      .attr("cx", function (d) { return d.x; })
      .style("cursor", "ew-resize")
      .call(drag);

    var last_time = -1;

    var possible_year_list = [1974, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];

    var all_in_one_by_year_data = Array()
    d3.json("src/assets/num_by_owner_data/all_in_one_by_year_data.json").then(function (json: any) {
      all_in_one_by_year_data = json
    })

    function dragmove(d) {
      // console.log(all_in_one_by_year_data)
      function get_year(d) {
        var percent = (d - 100) / (width - 2 * margin)
        return 1974 + Math.floor(44 * percent);
      }
      var x = d3.event.x;
      x = x < x1 ? x1 : x > x2 ? x2 : x;
      d.x = x;
      circle.attr("cx", x);
      var x_value_of_circle: any = svg_slider
        .select('#slider_circle')
        .attr("cx")
      x_value_of_circle = get_year(x_value_of_circle)
      // var date_now = new Date();
      // var original_time = date_now.getTime();
      if (possible_year_list.includes(x_value_of_circle)) {
        if (last_time != x_value_of_circle) {
          d3.json("src/assets/world_geojson.json").then(function (json: any) {
            // var colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, 300]);
            // var projection = d3.geoMercator().fitSize([width, height + 100], json);
            // var path = d3.geoPath().projection(projection);
            // console.log("src/assets/num_by_owner_data/num_by_owner_" + x_value_of_circle + ".json")
            var country = all_in_one_by_year_data[possible_year_list.indexOf(x_value_of_circle)][x_value_of_circle]
            // console.log(country)
            // var date_now = new Date();
            // var origin_time = date_now.getTime();
            // var now_time = date_now.getTime();
            // console.log("start_time"+now_time)
            // var first_count = date_now.getTime();
            // console.log("before deal with array" + first_count)

            var countryArray = new Array();
            countryArray = country.map(d => d.country);
            var valueArray = country.map(d => d.num);
            // console.log(countryArray)
            // console.log(valueArray)
            // var jsonValueArray = new Array();

            // var jsonCountryArray = new Array();
            // for (var j = 0; j < countryArray.length; j++) {
            //   for (var i = 0; i < json.features.length; i++) {
            //     if (json.features[i]["properties"]["NAME"] == countryArray[j]) {
            //       jsonCountryArray.push(json.features[i]);
            //       jsonValueArray.push(valueArray[j]);
            //     }
            //   }
            // }
            // var second_count = date_now.getTime();
            // console.log("after deal with array" + second_count)


            gg.selectAll(".states")
              .data(json.features)
              .attr("fill", function (d, i) {
                var index = countryArray.indexOf(d["properties"]["NAME"]);
                if (index >= 0) {
                  // console.log(d["properties"]["NAME"] + " " + valueArray[index]);
                  if (valueArray[index] == 0) {
                    return "white"
                  } else {
                    return (colorScale(valueArray[index]));
                  }
                } else {
                  return "white";
                }
              })
              .attr("stroke", "black")
              .attr("d", path);

            // var third_count = date_now.getTime();
            // console.log("after redraw" + third_count)

          });
          last_time = x_value_of_circle
        }
      }
    }
  }
}
