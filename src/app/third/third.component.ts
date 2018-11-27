import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-third',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ThirdComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    var svg = d3.select("#chart-svg1"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width/2, height/2) / 2,

    g = svg.append("g").attr("transform", "translate(" + width /3 + "," + height / 3 + ")");
    var color = d3.scaleOrdinal(["#f44242", "#f4eb41", "#43f441", "#41f4e5", "#5241f4"]);


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

    

    var pie = d3.pie() //pie generator
      .sort(null)
      .value(function(d) { return d['value']; });
        
    var path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0); //make != 0 for a donut chart
        
    var label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);
        
    d3.csv("src/assets/third_data.csv",function(d:any){
      d.value = +d.value;
      return d;
      }).then(function(data){
      console.log(data)



      var arc = g.selectAll(".arc")
      .data(pie(data)) //use pie generator to create the data needed for the each slice of the pie
      .enter().append("g")
      .attr("class", "arc");


      arc.append("path") //for each slide use arc path generator to draw the pie
      .attr("d", <any>path)
      .attr("fill", function(d:any) {console.log(d.data); return color(d.data.country);}) //get data from node (select and $0.__data__ in console)
      .on("mousemove", function(d) {
        d3.select(this)
            .attr("stroke","#fff")
            .attr("stroke-width","2px")
            .style("filter", "url(#drop-shadow)");
        d3.select(this)
          .transition()
          .duration(500)
          .attr('transform',function(d:any){
            var dist = 1;
            d.midAngle = ((d.endAngle - d.startAngle)/2) + d.startAngle;
            var x = Math.sin(d.midAngle) * dist;
            var y = Math.cos(d.midAngle) * dist;
            return 'translate(' + x + ',' + y + ')';
          });
          
          
          var mousePos = d3.mouse(divNode);
          d3.select("#mainTooltip")
            .style("left", mousePos[0] - 40 + "px")
            .style("top", mousePos[1] - 70 + "px")
            .select("#value")
            .attr("text-anchor", "middle")
            .html(d.data['country'] + ": " + d.data['value']+"%");
          d3.select(".card-body").selectAll("p").remove()
          d3.select(".card-body").append("p").text("The pie chart showing Comparation among 5 countries percent working hour > 40 hrs.")
          d3.select(".card-body").append("p").text(d.data['country']+ " has "+d.data['value'] + "% citizens working more than 40 hrs in 1995!")
          d3.select("#mainTooltip").classed("hidden", false);
      })
    .on("mouseout", function(d){
        d3.select(this)
            //.attr("stroke","none")
            .style("filter","none");
        d3.select(this)
          .transition()
          .duration(500)
          .attr('transform','translate(0,0)');
        d3.select(".card-body").selectAll("p").remove()
        d3.select(".card-body").append("p").text("The pie chart showing Comparation among 5 countries percent working hour > 40 hrs.")
        d3.select(".card-body").append("p").text("Pieces show the country and its percent of working over 40 hr population and detail will show when you point on.")
        d3.select("#mainTooltip").classed("hidden", true);
    });

      
      
      arc.append("text") 
      .attr("transform", function(d:any) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d:any) { return d.data.country; })
      .style("text-anchor", "middle")
      .attr("fill", "blue")
      .attr("font-family", "sans-serif");





      })
      
    this.draw();
    


    

  }

  onResize(){
    this.draw();

  }

  private draw():void{

    var margin = {top:20,right:60,bottom:40,left:30};
    var winheight = window.innerHeight;
    var winwidth = window.innerWidth;
    //var flag = -1;
    d3.select("#linechart").remove();
    d3.select('#line_chart').append('svg')
        .attr('id','linechart')
        .attr('height',winheight)
        .attr('width',winwidth)
    var width = parseInt(d3.select("#linechart").attr("width")) - margin.left - margin.right;
    var height = parseInt(d3.select("#linechart").attr("height")) - margin.top - margin.bottom;

    console.log(width)

    


    var line = d3.line()
        .x(function(d:any){
          console.log(d['YearOfLaunch']);
          return xScale(d['YearOfLaunch']);}) 
        .y(function(d:any){
          console.log(d['Number']);
          return yScale(+d['Number']);})

    
    var svg = d3.select("#linechart")
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var color =d3.scaleOrdinal(d3.schemeCategory10);var xScale = d3.scalePoint()   ////// 
            .range([0,width])
           .padding(0.1)

    var yScale = d3.scaleLinear()
           //.base(5) 
           //nice
           .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    xAxis.ticks(5);
    var countries;    ///////////////// think these later

    d3.csv("src/assets/third_data2.csv").then( function(data) {
      
    console.log(data);

    xScale.domain(data.map(function(d) { 
      console.log(d['YearOfLaunch'])
      return d['YearOfLaunch']; }));
    var y_min = +d3.min(data.map(d=>+d.Number));
    var y_max = +d3.max(data.map(d=>+d.Number));
    // console.log(y_min);
    // console.log(y_max);
    yScale.domain([y_min,y_max])

    // console.log("123123: "+xScale("2000"))
    

    svg.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          //.attr("transform", "rotate(-90)")
          .call(xAxis);
    svg.selectAll(".xAxis .tick text")
      .attr("transform", "rotate(-90)")
      .attr("dx", "-2em")
      .attr("dy", "-0.5em")
      //.attr
    svg.append("g")
          .attr("class", "yAxis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          //.attr("x",2)
          .attr("y", 4)
          .attr("dy", "0.7em")
          .attr("fill", "#000")
          .style("text-anchor", "end")
          .attr("font-size", "10.5px")
          .text("Percent work>40hr(%)");

    var counLine = svg
          .append('g')

          .datum(data)
          .attr('class','country');

    counLine.append('path')
          // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
           .attr("class", "line")
           .attr("stroke-width","3px")
           .attr("fill", "none") 
           .attr("d", function(d:any) { 
             console.log("123")
            //console.log(d);
             return line(d); 
            })
           //.attr("data-legend",function(d:any) { return d.name})
           .style("stroke","#f44242")
           .on('mouseover',function(d,i){
             //flag = i;
               //console.log(flag);
              // d3.selectAll(".line").style("stroke-width", function(d,i){
                // return i == flag?"5px":"2.5px";
               //})
   
           })
      
    var pointCircle = counLine.append('g')
           .datum(data)
           .selectAll('.pointCirle')
           .data(function(d:any){return d;})
           .enter()
           .append('g')
           .append('circle')
           .attr("cx", function(d:any){
             return xScale(d['YearOfLaunch']);})
           .attr("cy",function(d,i){
             return yScale(d['Number']);
           })
           .attr('r',4)
           .style('fill','#f44242')
           .style("fill-opacity", 0)
           .on("mouseover", function(d){
             d3.select(this)
             .style("fill-opacity",0.8)
             var odate = d['YearOfLaunch'];
             var ovalue = d['Number'];
             //Get this bar's x/y values, then augment for the tooltip
             var xPosition = parseFloat(d3.select(this).attr("cx")) + 5;
             console.log(xPosition)
             var yPosition = parseFloat(d3.select(this).attr("cy")) -10;
             console.log(yPosition)
             //Create the tooltip label
             svg//.append("g")
                 .append("text")
                 .attr("id", "tooltip")
                 .attr("x", xPosition)
                 .attr("y", yPosition)
                 .attr("text-anchor", "middle")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "45px")
                 .style("fill","black")
                 .text(ovalue)
           })
           .on("mouseout", function() {
             //Remove the tooltip
             d3.select("#tooltip").remove();
             //Set opacity to 0
             d3.select(this)
               .style("fill-opacity",0)
             })


    

  
  
  
  
  })
  // d3.csv("src/assets/third_data3.csv").then(function(data) {

  // })


  }


  private draw2():void{
    var d;
    d3.csv("src/assets/third_3.csv").then(function (data) {
    var colors = ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#2ECC40", "#01FF70", "#FFDC00", "#FF4136", "#FF851B", "#7F4145", "#BD3D3A", "#3F69AA", "#D5AE41", "#E47A2E", "#F1EA7F", "#485167", "#ECDB54", "#944743", "#00A591"];
    drawBarChart(data);
    // drawSlopeGraph(data, country);

    function drawBarChart(data) {
      var top10Data = data.slice(0);
      var bot10Data = data.slice(0);
      var dataForSortAlfa = data.slice(0).sort(); 
      var dataForSortAsc = data.slice(0).sort(compare).reverse();

      var compare = function (x, y) {
        if (x.Value < y.Value) {
            return 1;
        } else if (x.Value > y.Value) {
            return -1;
        } else {
            return 0;
        }
      }

      
      var compareAlpha = function (a, b) {
        var textA = a.Country.toUpperCase();
        var textB = b.Country.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    }

    var top5 = false;

    var margin = { top: 60, right: 40, bottom: 60, left: 50 }; //step1: set margin

    var winheight = window.innerHeight;
    var winwidth = window.innerWidth;

    var width = 1000 - margin.left - margin.right, //step2: set width and height
        height = 300 - margin.top - margin.bottom;


    var x = d3.scaleBand()
        //.domain(d3.range(0, 10))
        .range([0, width])
        .paddingInner(0.05);
    var xAxis = d3.axisBottom(x);





    var svg = d3.select("#p2")
        .append("svg") //step3: set-up svg
        .attr("id", "svg0")
        .attr('height',winheight)
        .attr('width',winwidth)
        .style('background-color', 'lightgrey')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var width = parseInt(d3.select("#linechart").attr("width")) - margin.left - margin.right;
    var height = parseInt(d3.select("#linechart").attr("height")) - margin.top - margin.bottom;
    



        //.scale(x);


    /*
    var xScale = d3.scalePoint()   ////// 
            .range([0,width])
           .padding(0.1)

    var yScale = d3.scaleLinear()
           //.base(5) 
           //nice
           .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    xAxis.ticks(5);
    */



    }
});
  }

}
