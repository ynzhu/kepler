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
      .attr("width", "1280")
      .attr("height", "700"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
    
    var radius_scale = d3.scaleLinear().domain([0,46200+6400]).range([0,640])

    svg.append("circle")
    svg.append("circle") //LEO, 187 - 2008 km
    .attr("cx", width/2)
    .attr("r", radius_scale(6400+2000))
    .attr("Stroke", "black")

    svg.append("circle")
      .attr("cx", width/2)
      .attr("r", radius_scale(6400)) //6400km
      .attr("stroke", "black")
      .attr("fill", "blue")

    var arc = d3.arc()//设置弧度的内外径，等待传入的数据生成弧度
    .outerRadius(radius_scale(6400+46200))
    .innerRadius(radius_scale(6400+40000))
    .startAngle(0)
    .endAngle(2*Math.PI)

    svg.append("g")
    .attr("transform", "translate(" + (width / 2) + "," +0 + ")")
    .append("path")
    .attr("d",arc);


  }

}
