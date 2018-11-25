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
    this.createChart();
  }
  ngOnChanges():void{
    this.createChart();
  }
  onResize(){
    this.createChart();
  }
  private createChart(): void{
    var flag = 0;
    var orbit_flag = "geo";
    var winwidth = window.innerWidth;
    var margin = {left:20, top:20, bottom:20, right:100}
    var margin0 = {left:0, top:0, bottom:0, right:0}
    d3.select(".second").remove();
    var svg = d3.select("#orbits").append("svg") 
      .attr("class", "second")
      .attr("width", winwidth)
      .attr("height", winwidth/2),
      width = +svg.attr("width")-margin.left-margin.right,
      height = +svg.attr("height")-margin.top-margin.bottom;
    var earth_radius = 6400;
    var low_earth_radius = 2000;
    var medium_earth_radius = 25000;
    var geosynchronous_radius = 40000;
    var country_list = ["United States", "China", "Russia", "Japan", "Others"];
    var purpose_list = ["Communications", "Earth Observation", "Tech Dev", "Navigation", "Space Science", "Others"];
    var radius_scale_earth = d3.scaleLinear().domain([0,earth_radius]).range([0,height]);
    var radius_reverse_earth = d3.scaleLinear().range([0,earth_radius]).domain([0,height]);
    var radius_scale_leo = d3.scaleLinear().domain([0,low_earth_radius+earth_radius]).range([0,height]);
    var radius_scale_meo = d3.scaleLinear().domain([0,medium_earth_radius+earth_radius]).range([0,height]);
    var radius_scale_geo = d3.scaleLinear().domain([0,geosynchronous_radius+earth_radius]).range([0,height]);
    var radius_reverse_geo = d3.scaleLinear().range([0,geosynchronous_radius+earth_radius]).domain([0,height]);

    var color_scale_country = d3.scaleOrdinal(d3.schemeCategory10);
    var color_scale_purpose = d3.scaleOrdinal(d3.schemeCategory10);
    var divNode:any = d3.select("body").node();
    var defs = svg.append("defs");
    var filter = defs.append("filter")
                    .attr("id", "drop-shadow")
                    .attr("height","130%");
    
    filter.append("feGaussianBlur")
            .attr("in","SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");
    
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 3)
        .attr("dy", 3)
        .attr("result", "offsetBlur");
        var feMerge = filter.append("feMerge");
    
    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    function country_number(country){
      if (country == "USA") 
        {return 0}
      else if (country == "China")
        {return 1}
      else if (country == "Russia")
        {return 2}
      else if (country == "Japan")
        {return 3}
      else
        {return 4}
    }
    function purpose_number(purpose){
      if (purpose == purpose_list[0]) 
        {return 0}
      else if (purpose == purpose_list[1])
        {return 1}
      else if (purpose == purpose_list[2])
        {return 2}
      else if (purpose == purpose_list[3])
        {return 3}
      else if (purpose == purpose_list[4])
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
      .attr("r", 3)
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

      svg.selectAll(".satellites")
      .on("mouseover",function(d:any){
        var mousePos = d3.mouse(divNode);
        var tooltip = d3.select("#tooltip")
        .style("left", mousePos[0] - 200 + "px")
        .style("top", mousePos[1] - 100 + "px");
        tooltip.select("#t_country")
        .text(d["Country of Operator/Owner"]);
        tooltip.select("#t_operator")
        .text(d["Operator/Owner"]);
        tooltip.select("#t_user")
        .text(d["Users"]);
        tooltip.select("#t_purpose")
        .text(d["Purpose"]);
        tooltip.select("#t_class")
        .text(d["Class of Orbit"]);
        tooltip.select("#t_perigee")
        .text(d["Perigee"]);
        tooltip.select("#t_apogee")
        .text(d["Apogee"]);
        tooltip.select("#t_date")
        .text(d["Date of Launch"]);
        tooltip.select("#t_site")
        .text(d["Launch Site"]);
        tooltip.select("#t_vehicle")
        .text(d["Launch Vehicle"]);

        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);

      })
      .on("mouseout", function(d:any){
        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);
      })

      d3.select("#show_low")
      .on("click", function(){
        orbit_flag = "leo";
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("id", function(d:any){
          return +d3.select(this).attr("cx");
        })
        .attr("cx", function(d:any){
          return radius_scale_leo(+d3.select(this).attr(flag?"saved_x2":"saved_x"));
        })
        .attr("cy", function(d:any){
          return radius_scale_leo(+d3.select(this).attr(flag?"saved_y2":"saved_y"));
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
        orbit_flag = "meo";
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("id", function(d:any){
          return +d3.select(this).attr("cx");
        })
        .attr("cx", function(d:any){
          return radius_scale_meo(+d3.select(this).attr(flag?"saved_x2":"saved_x"));
        })
        .attr("cy", function(d:any){
          return radius_scale_meo(+d3.select(this).attr(flag?"saved_y2":"saved_y"));
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
        orbit_flag = "geo";
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("id", function(d:any){
          return +d3.select(this).attr("cx");
        })
        .attr("cx", function(d:any){
          return radius_scale_geo(+d3.select(this).attr(flag?"saved_x2":"saved_x"));
        })
        .attr("cy", function(d:any){
          return radius_scale_geo(+d3.select(this).attr(flag?"saved_y2":"saved_y"));
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
        .duration(1000)
        .attr("fill", function(d,i):any{
          return color_scale_country(""+country_number(d["Country of Operator/Owner"]))
        })

        svg.selectAll(".legend_circles")
        .data(country_list)
        .enter()
        .append("circle")
        .attr("class", "legend_circles")
        .attr("cx", width+width)
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
        .attr("x", width+width)
        .attr("y", function(d,i){
          return i*50+20;
        })
        .attr("fill", function(d,i){
          return color_scale_country(""+i);
        })
        .attr('alignment-baseline', 'middle')
        .attr("font-size", 10)
        .text(function(d){
          return d;
        })
        svg.selectAll(".legend_circles")
        .data(country_list)
        .exit()
        .transition()
        .delay(300)
        .duration(1300)
        .attr("cx", width+width)
        .remove()
        svg.selectAll(".legend_labels")
        .data(country_list)
        .exit()
        .transition()
        .delay(300)
        .duration(1300)
        .attr("x", width+width)
        .remove()
        svg.selectAll(".legend_circles")
        .data(country_list)
        .transition()
        .delay(300)
        .duration(1500)
        .attr("cx", width)
        .attr("fill", function(d,i){
          return color_scale_country(""+i);
        })
        svg.selectAll(".legend_labels")
        .data(country_list)
        .transition()
        .delay(300)
        .duration(1500)
        .attr("x", width+5)
        .attr("fill", function(d,i){
          return color_scale_country(""+i);
        })
        .attr("font-size", 10)
        .text(function(d, i){
          return d;
        })

      })

      d3.select("#by_use")
      .on("click", function(){
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(1000)
        .attr("fill", function(d,i):any{
          return color_scale_purpose(""+purpose_number(d["Purpose"]))
        })
        svg.selectAll(".legend_circles")
        .data(purpose_list)
        .enter()
        .append("circle")
        .attr("class", "legend_circles")
        .attr("cx", width+width)
        .attr("cy", function(d,i){
          return i*50+20;
        })
        .attr("r", 5)
        .attr("fill", function(d,i){
          return "black";
        })
        svg.selectAll(".legend_labels")
        .data(purpose_list)
        .enter()
        .append("text")
        .attr("class", "legend_labels")
        .attr("x", width+width)
        .attr("y", function(d,i){
          return i*50+20;
        })
        .attr("fill", function(d,i){
          return "black";
        })
        .attr('alignment-baseline', 'middle')
        .attr("font-size", 10)
        .text(function(d){
          return "";
        })
        svg.selectAll(".legend_circles")
        .data(purpose_list)
        .transition()
        .delay(300)
        .duration(1400)
        .attr("cx", width)
        .attr("cy", function(d,i){
          return i*50+20;
        })
        .attr("r", 5)
        .attr("fill", function(d,i){
          return color_scale_purpose(""+i);
        })
        svg.selectAll(".legend_labels")
        .data(purpose_list)
        .transition()
        .delay(300)
        .duration(1500)
        .attr("x", width+5)
        .attr("y", function(d,i){
          return i*50+20;
        })
        .attr("fill", function(d,i){
          return color_scale_purpose(""+i);
        })
        .attr('alignment-baseline', 'middle')
        .attr("font-size", 10)
        .text(function(d){
          return d;
        })

      })

      d3.select("#donut")
      .on("click", function(){
        flag = 1;
        svg.selectAll(".satellites")
        .attr("saved_x2", function(d:any){
          var xrange = Math.random();
          if(d["Country of Operator/Owner"] == "USA"){
            if(+d["Perigee"] <= 1500){
              xrange = Math.random() * 0.51;
            }
            else if (+d["Perigee"] > 7815 && +d["Perigee"] <= 23551){
              xrange = Math.random() * 0.28;
            }
            else if (+d["Perigee"] > 32618 && +d["Perigee"] <= 37782){
              xrange = Math.random() * 0.36;
            }
          }
          else if(d["Country of Operator/Owner"] == "Russia"){
            if(+d["Perigee"] <= 1500){
              xrange = Math.random() * 0.07 + 0.51;
            }
            else if (+d["Perigee"] > 7815 && +d["Perigee"] <= 23551){
              xrange = Math.random() * 0.26 + 0.28;
            }
            else if (+d["Perigee"] > 32618 && +d["Perigee"] <= 37782){
              xrange = Math.random() * 0.05 + 0.36;
            }
          }
          else if(d["Country of Operator/Owner"] == "China"){
            if(+d["Perigee"] <= 1500){
              xrange = Math.random() * 0.16 + 0.58;
            }
            else if (+d["Perigee"] > 7815 && +d["Perigee"] <= 23551){
              xrange = Math.random() * 0.13 + 0.54;
            }
            else if (+d["Perigee"] > 32618 && +d["Perigee"] <= 37782){
              xrange = Math.random() * 0.09 + 0.41;
            }
          }
          else if(d["Country of Operator/Owner"] == "Japan"){
            if(+d["Perigee"] <= 1500){
              xrange = Math.random() * 0.03 + 0.74;
            }
            else if (+d["Perigee"] > 7815 && +d["Perigee"] <= 23551){
              xrange = Math.random() * 0 + 0.67;
            }
            else if (+d["Perigee"] > 32618 && +d["Perigee"] <= 37782){
              xrange = Math.random() * 0.05 + 0.5;
            }
          }
          else{
            if(+d["Perigee"] <= 1500){
              xrange = Math.random() * 0.23 + 0.77;
            }
            else if (+d["Perigee"] > 7815 && +d["Perigee"] <= 23551){
              xrange = Math.random() * 0.34 + 0.66;
            }
            else if (+d["Perigee"] > 32618 && +d["Perigee"] <= 37782){
              xrange = Math.random() * 0.43 + 0.57;
            }
          }
          return (6400 + +d.Perigee) * Math.cos(xrange * Math.PI);
        })
        .attr("saved_y2", function(d:any){
          return Math.sqrt(Math.pow((6400 + +d.Perigee),2) - Math.pow(+d3.select(this).attr("saved_x2"), 2));;
        })
        .attr("id", function(d,i){
          return d["Country of Operator/Owner"]  +"," +d["Class of Orbit"];
        })
        var r_s;
        if(orbit_flag == "leo"){
          r_s = radius_scale_leo;
        }
        else if(orbit_flag == "meo"){
          r_s = radius_scale_meo;
        }
        else if(orbit_flag == "geo"){
          r_s = radius_scale_geo;
        }
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(1000)
        .attr("cx", function(d:any){
          return r_s(+d3.select(this).attr("saved_x2"));
        })
        .attr("cy", function(d:any){
          return r_s(+d3.select(this).attr("saved_y2"));
        })
      })

      d3.select("#reset")
      .on("click", function(){
        flag = 0;
        orbit_flag = "geo";
        svg.selectAll(".satellites")
        .transition()
        .delay(500)
        .duration(2000)
        .attr("fill", "gold")
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
    })
  }
}
