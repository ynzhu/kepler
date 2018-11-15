import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import * as d3 from 'd3';
import { arc } from 'd3';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class SecondComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var margin = {left:20, top:20, bottom:20, right:100}
    var margin0 = {left:0, top:0, bottom:0, right:0}
    var svg = d3.select("#orbits").append("svg") 
      .attr("class", "second")
      .attr("width", "1400")
      .attr("height", "700"),
      width = +svg.attr("width")-margin.left-margin.right,
      height = +svg.attr("height")-margin.top-margin.bottom;
    var earth_radius = 6400;
    var low_earth_radius = 2000;
    var medium_earth_radius = 25000;
    var geosynchronous_radius = 40000;
    var country_list = ["United States", "China", "Russia", "Japan", "Others"];
    var purpose_list = [""]
    var radius_scale_earth = d3.scaleLinear().domain([0,earth_radius]).range([0,height]);
    var radius_reverse_earth = d3.scaleLinear().range([0,earth_radius]).domain([0,height]);
    var radius_scale_leo = d3.scaleLinear().domain([0,low_earth_radius+earth_radius]).range([0,height]);
    var radius_scale_meo = d3.scaleLinear().domain([0,medium_earth_radius+earth_radius]).range([0,height]);
    var radius_scale_geo = d3.scaleLinear().domain([0,geosynchronous_radius+earth_radius]).range([0,height]);
    var radius_reverse_geo = d3.scaleLinear().range([0,geosynchronous_radius+earth_radius]).domain([0,height]);

    var color_scale_country = d3.scaleOrdinal(d3.schemeCategory10);
    var color_scale_purpose = d3.scaleOrdinal(d3.schemeCategory10);

    function country_number(country){
      if (country == "United States") 
        {return 1}
      else if (country == "China")
        {return 2}
      else if (country == "Russia")
        {return 3}
      else if (country == "Japan")
        {return 4}
      else
        {return 5}
    }

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

    svg.append("circle") //LEO, 187 - 1498 km, (187+1498)/2 = 936, 1498-187 = 1311
    .attr("id", "leo")
    .attr("cx", width/2)
    .attr("r", radius_scale_earth(6400+936))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", radius_scale_geo(1311))
    .transition()
    .delay(500)
    .duration(2000)
    .attr("r", radius_scale_geo(6400+936))

    var arc2 = d3.arc()  // MEO: 7815-23551km
    .outerRadius(radius_scale_earth(6400+7815))
    .innerRadius(radius_scale_earth(6400+23551))
    .startAngle(Math.PI * 0.5)
    .endAngle(Math.PI*1.5);

    var meo = svg.append("g")
    .attr("transform", "translate(" + (width / 2) + "," +0 + ")")
    .append("path")
    .attr("id", "meo")
    .attr("d",arc2)

    arc2.outerRadius(radius_scale_geo(6400+7815))
    .innerRadius(radius_scale_geo(6400+23551))
    .startAngle(Math.PI * 0.5)
    .endAngle(Math.PI*1.5);

    meo.transition()
    .delay(500)
    .duration(2000)
    .attr("d", arc2);

    svg.append("circle") //GEO: 32618-37782 km, (37782+32618)/2 = 35200, 37782-32618=5162
    .attr("id", "geo")
    .attr("cx", width/2)
    .attr("cy", 0)
    .attr("r", radius_scale_earth(6400+35200))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", radius_scale_geo(5162))
    .transition()
    .delay(500)
    .duration(2000)
    .attr("r", radius_scale_geo(6400+35200))


    d3.csv("src/assets/full_data.csv").then(function(data){
      svg.selectAll(".satellites")
      .data(data)
      .enter()
      .append("circle")
      .attr("class","satellites")
      .attr("transform", "translate(" + (width / 2) + "," +0 + ")")
      .attr("r", 2)
      .attr("fill", "gold")
      .attr("saved_x", function(d:any){
        return (6400 + +d.Perigee) * Math.cos(Math.random()* Math.PI);
      })
      .attr("saved_y", function(d:any){
        return Math.sqrt(Math.pow((6400 + +d.Perigee),2) - Math.pow(+d3.select(this).attr("saved_x"), 2));;
      })
      .attr("cx", function(d:any){
        return radius_scale_earth(+d3.select(this).attr("saved_x"));
      })
      .attr("cy", function(d:any){
        return radius_scale_earth(+d3.select(this).attr("saved_y"));
      })
      .attr("id", function(d:any){
        return d["Class of Orbit"]
      })
      .attr("opacity", 0.6)
      .transition()
      .delay(500)
      .duration(2000)
      .attr("cx", function(d:any){
        return radius_scale_geo(+d3.select(this).attr("saved_x"));
      })
      .attr("cy", function(d:any){
        return radius_scale_geo(+d3.select(this).attr("saved_y"));
      })

      d3.select("#show_low")
      .on("click", function(){
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("id", function(d:any){
          return +d3.select(this).attr("cx");
        })
        .attr("cx", function(d:any){
          return radius_scale_leo(+d3.select(this).attr("saved_x"));
        })
        .attr("cy", function(d:any){
          return radius_scale_leo(+d3.select(this).attr("saved_y"));
        })


        svg.selectAll(".earth")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("x", width/2 - radius_scale_leo(6400))
        .attr("y", -radius_scale_leo(6400))
        .attr("width", radius_scale_leo(6400)*2)
        .attr("height", radius_scale_leo(6400)*2)

        svg.select("#leo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("stroke-width", radius_scale_leo(1311))
        .attr("r", radius_scale_leo(6400+936))

        arc2.outerRadius(radius_scale_leo(6400+7815))
        .innerRadius(radius_scale_leo(6400+23551))

        svg.select("#meo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("d", arc2)

  
        svg.select("#geo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("r", radius_scale_leo(6400+35200))
      })

      d3.select("#show_medium")
      .on("click", function(){
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("id", function(d:any){
          return +d3.select(this).attr("cx");
        })
        .attr("cx", function(d:any){
          return radius_scale_meo(+d3.select(this).attr("saved_x"));
        })
        .attr("cy", function(d:any){
          return radius_scale_meo(+d3.select(this).attr("saved_y"));
        })


        svg.selectAll(".earth")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("x", width/2 - radius_scale_meo(6400))
        .attr("y", -radius_scale_meo(6400))
        .attr("width", radius_scale_meo(6400)*2)
        .attr("height", radius_scale_meo(6400)*2)

        svg.select("#leo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("stroke-width", radius_scale_meo(1311))
        .attr("r", radius_scale_meo(6400+936))

        arc2.outerRadius(radius_scale_meo(6400+7815))
        .innerRadius(radius_scale_meo(6400+23551))

        svg.select("#meo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("d", arc2)

  
        svg.select("#geo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("r", radius_scale_meo(6400+35200))
      })

      d3.select("#show_g")
      .on("click", function(){
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("id", function(d:any){
          return +d3.select(this).attr("cx");
        })
        .attr("cx", function(d:any){
          return radius_scale_geo(+d3.select(this).attr("saved_x"));
        })
        .attr("cy", function(d:any){
          return radius_scale_geo(+d3.select(this).attr("saved_y"));
        })


        svg.selectAll(".earth")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("x", width/2 - radius_scale_geo(6400))
        .attr("y", -radius_scale_geo(6400))
        .attr("width", radius_scale_geo(6400)*2)
        .attr("height", radius_scale_geo(6400)*2)

        svg.select("#leo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("stroke-width", radius_scale_geo(1311))
        .attr("r", radius_scale_geo(6400+936))

        arc2.outerRadius(radius_scale_geo(6400+7815))
        .innerRadius(radius_scale_geo(6400+23551))

        svg.select("#meo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("d", arc2)

  
        svg.select("#geo")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("r", radius_scale_geo(6400+35200))
      })

      d3.select("#by_country")
      .on("click", function(){
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("fill", function(d,i):any{
          return color_scale_country(""+country_number(d["Country of Operator/Owner"]))
        })

        svg.selectAll(".legend_circles")
        .data(country_list)
        .enter()
        .append("circle")
        .attr("class", "legend_circles")
        .attr("cx", width)
        .attr("cy", function(d,i){
          return i*50+20;
        })
        .attr("r", 5)
        .attr("fill", function(d,i){
          return color_scale_country(""+i);
        })
        svg.selectAll(".legend_labels")
        .data(country_list)
        .enter()
        .append("text")
        .attr("class", "legend_labels")
        .attr("x", width+5)
        .attr("y", function(d,i){
          return i*50+20;
        })
        .attr("fill", function(d,i){
          return color_scale_country(""+i);
        })
        .attr('alignment-baseline', 'middle')
        .text(function(d){
          return d;
        })
      })

      d3.select("#by_use")
      .on("click", function(){
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("fill", function(d,i):any{
          return color_scale_purpose(d["Purpose"])
        })
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
