// JavaScript Document

/************ REPRESENTS SERVER RETURNS  ************/
var companies = [
  {name: "General Dynamics", relationships:[ {id: 2, strength: 2}, {id: 3, strength: 2} ], id: 1},
  {name: "American Craftbuilders", relationships:[ {id: 1, strength: 6}, {id: 3, strength: 6} ], id: 2},
  {name: "Southern New England Construction", relationships:[ {id: 2, strength: 8}, {id: 8, strength: 8} ], id: 3},
  {name: "Cambridge Realty and Trust", relationships:[ {id: 3, strength: 1}, {id: 3, strength: 3} ], id: 4},
  {name: "Central Appliance Repair", relationships:[ {id: 9, strength: 3}, {id: 3, strength: 2} ], id: 5},
  {name: "Merrimack Plywood Supplies", relationships:[ {id: 5, strength: 2}, {id: 3, strength: 9} ], id: 6},
  {name: "Ashmont Pavers", relationships:[ {id: 2, strength: 9}, {id: 3, strength: 7} ], id: 7},
  {name: "Boston Dock Management", relationships:[ {id: 2, strength: 2}, {id: 3, strength: 5} ], id: 8},
  {name: "Back Bay Construction, LLC", relationships:[ {id: 2, strength: 1}, {id: 3, strength: 6} ], id: 9},
  {name: "Boston Water Department", relationships:[ {id: 3, strength: 4}, {id: 6, strength: 2} ], id: 10},
  {name: "MBTA", relationships:[ {id: 4, strength: 8}, {id: 7, strength: 6} ], id: 11},
  {name: "Feline Credit Union", relationships:[ {id: 1, strength: 4}, {id: 15, strength: 8} ], id: 12},
  {name: "Mattapan Roofers", relationships:[ {id: 5, strength: 2}, {id: 2, strength: 3} ], id: 13},
  {name: "Green Gardens, Inc.", relationships:[ {id: 7, strength: 1}, {id: 9, strength: 2} ], id: 14},
  {name: "Foxbright", relationships:[ {id: 8, strength: 6}, {id: 1, strength: 9} ], id: 15},
  {name: "Injanta", relationships:[ {id: 10, strength: 7}, {id: 8, strength: 7} ], id: 16},
  {name: "The Melthen Group", relationships:[ {id: 11, strength: 9}, {id: 17, strength: 5} ], id: 17},
  {name: "Arrow Inc.", relationships:[ {id: 3, strength: 2}, {id: 11, strength: 6} ], id: 18}
];

var people = [
  {firstName: "Abraham", lastName: "Reynolds", information:"Tech Director", company: 1},
  {firstName: "Kate", lastName: "Marshall", information:"Sales Associate", company: 1},
  {firstName: "Maury", lastName: "Harrison", information:"IT Support", company: 2},
  {firstName: "Ted", lastName: "Borden", information:"Sales Associate", company: 3},
  {firstName: "Nadia", lastName: "Butler", information:"Sales Associate", company: 4},
  {firstName: "Mary", lastName: "Adams", information:"Sales Associate", company: 4},
  {firstName: "Jake", lastName: "Scott", information:"CFO", company: 4},
  {firstName: "Matt", lastName: "Anderson", information:"CEO", company: 4},
  {firstName: "Brandy", lastName: "Pulling", information:"Compliance Manager", company: 5},
  {firstName: "Nick", lastName: "Bruscino", information:"Compliance Manager", company: 6},
  {firstName: "Ernest", lastName: "Minsker", information:"Sales Associate", company: 7},
  {firstName: "Gayathri", lastName: "Palmer", information:"Construction Supervisor", company: 8},
  {firstName: "Wallace", lastName: "Moore", information:"Sales Associate", company: 9},
  {firstName: "Sue", lastName: "Nelin", information:"CFO", company: 9},
  {firstName: "Annie", lastName: "Steeves", information:"CEO", company: 9},
  {firstName: "Erin", lastName: "Alden", information:"Sales Associate", company: 9},
  {firstName: "Kristin", lastName: "Quincy", information:"Sales Associate", company: 9},
  {firstName: "Thomas", lastName: "Williams", information:"Tech Director", company: 9},
  {firstName: "Jay", lastName: "Corrigan", information:"Sales Associate", company: 10},
  {firstName: "Brent", lastName: "Lee", information:"Construction Supervisor", company: 11},
  {firstName: "Joel", lastName: "Fredrickson", information:"Construction Supervisor", company: 12},
  {firstName: "William", lastName: "Crawley", information:"Construction Supervisor", company: 13},
  {firstName: "Jackie", lastName: "Pingston", information:"CFO", company: 14},
  {firstName: "Brian", lastName: "Park", information:"Construction Supervisor", company: 15},
  {firstName: "Angelica", lastName: "Eddington", information:"CEO", company: 16},
  {firstName: "Robert", lastName: "Pauling", information:"Sales Associate", company: 17},
  {firstName: "Antonio", lastName: "Givenchy", information:"IT Support", company: 18},
  {firstName: "Mia", lastName: "Zahn", information:"Sales Associate", company: 18},
  {firstName: "Andy", lastName: "Beldin", information:"Implementation Specialist", company: 18},
  {firstName: "John", lastName: "Melda", information:"Graphic Designer", company: 18},
  {firstName: "Lucy", lastName: "Alda", information:"CTO", company: 18}  //corrected to 18 since 19 does not exist
];

//To make things look better.  this should done on the server but for POC it is done here
companies.sort(function(a, b) { return d3.ascending(a.name, b.name); });
people.sort(function(a, b) { return d3.ascending(a.lastName, b.lastName); });

//for dynamic companies calc these values
var visProps = {
  height: 600,
  width: 1200,
  cHeight: 60,
  cWidth: 60,
  buffer: 2,
  strScale: 2
}

;(function (props, companyList, employeeList) {
  "use strict";
  
  var $vis = d3.select("#visHolder")
    .append("svg")
    .attr("id", "companyVis")
    .attr("height", props.height)
    .attr("width", props.width);

  $vis.append("title").text("Visualization of companies and thier relationships");

  var $cards = d3.select("#cardHolder");

  var that = {
    cIdxMap: {},
    getKey: function (d) {
      return "cmp_" + (d.id || d);
    },
	
    initCards: function (cl) {
      /*TODO: in production precompile the templates*/
      var source = document.getElementById("cardTemplate").innerHTML;
      var template = Handlebars.compile(source);
      var clLen = cl.length, contents = "";

      for (var i = 0; i < clLen; i++) {
        contents = contents + template(cl[i]);
      }
      document.getElementById("cardHolder").innerHTML = contents;
    },

    initCompanies: function (cl) {
      //put the companies near the bottom of the chart
      var y = props.height - props.cHeight;
      var x = function (d, i) {
        return (props.cWidth + props.buffer) * i + props.buffer;
      }
      var relations = [];
	  
	  //show companies as boxes across an 'x-axis"
      var $comps = $vis.append("g");
      $comps.selectAll("rect.company")
        .data(cl, function (d, i) {
          that.cIdxMap[that.getKey(d)] = i;
          var rlen = (d.relationships) ? d.relationships.length : 0;
          for (var idx = 0; idx < rlen; idx++) {
            relations.push({
              from: that.getKey(d),
              to: that.getKey(d.relationships[idx]),
              str: d.relationships[idx].strength
            });
          }
          return d.id;
        })
		.enter().append("rect")
        .attr("class", "company")
        .attr("id", function (d) {
          return "vis" + that.getKey(d);
        })
        .attr("y", y)
        .attr("x", x)
        .attr("width", props.cWidth)
        .attr("height", props.cHeight)
        .attr("fill", function (d, i) {
          return that.colors(i)
        })
      //shows this company
      .on("mouseover", that.highlight(true))
      //returns to normal
      .on("mouseout", that.highlight(false))
	  //covers touch screens
	  .on("click", function(d,i){ 
		if(that.selected && that.selected !== d) {
		  that.highlight(false)(that.selected, that.cIdxMap[that.getKey(that.selected)]);
		} 
		that.selected = d; 
		that.highlight(true)(d,i);
	  })
	  .append("title")        
	  .text( function (d, i) {return d.name}) ;


      //draw the arcs from one company to the other to represent a relationship
	  //stregth is shown by line widths
      var $arcs = $vis.append("g");
      $arcs.selectAll("path.relate")
        .data(relations)
        .enter().append("path")
		.attr("class", "relate")
        .attr("d", function (d, i) {
          //Keep the arcs above the companies 
          var x1, x2;
          var a_x = x(null, that.cIdxMap[d.from]);
          var b_x = x(null, that.cIdxMap[d.to]);

          if (a_x > b_x) {
            x1 = b_x;
            x2 = a_x;
          } else {
            x1 = a_x;
            x2 = b_x;
          }

          //start the arc at the middle of the box
          x1 = x1 + (props.cWidth / 2);
          x2 = x2 + (props.cWidth / 2);

          //The closer the companies are to each other (on the axis), the smaller the radii needs to be
          var rad = (x2 - x1) / 2;
          return "M" + x1 + "," + y + " A " + rad + "," + rad + " 0 0 1 " + x2 + "," + y;
        })
        .attr("fill", "none")
        .attr("stroke", function (d, i) {
          return that.colors(that.cIdxMap[d.from])
        })
        .attr("stroke-width", function (d, i) {
          return d.str * props.strScale;
        })
		.append("title")
		.text(function (d, i) {
          var toI = that.cIdxMap[d.to],
            fromI = that.cIdxMap[d.from];

          return "Relationship between " + cl[fromI].name + " and " + cl[toI].name + " with strength rank: " + d.str;
        });

    },
    initEmployees: function (el) {
      var source = document.getElementById("employeeTemplate").innerHTML;
      var template = Handlebars.compile(source);
      var elLen = el.length, eMap = {}, emp, empContent;

      for (var i = 0; i < elLen; i++) {
        emp = el[i];
        empContent = eMap["empList_" + emp.company] || "";
        eMap["empList_" + emp.company] = empContent + template(emp);
      }

      for (var emp in eMap) {
        document.getElementById(emp).innerHTML = eMap[emp];
      }

    },
    colors: d3.scale.category20(),

    showCard: function (comp, show) {
      var card = document.getElementById(that.getKey(comp));
      if (show) {
        card.classList.add('showCard');
      } else {
        card.classList.remove('showCard');
      }
    },
	
	highlight: function (show) {
      return function (g, i) {
        //fade the other paths
        var paths = d3.select("#companyVis").selectAll("path.relate")
          .filter(function (d) {
            return that.cIdxMap[d.from] != i && that.cIdxMap[d.to] != i && that.cIdxMap[that.selected] != i;
          })
          .transition().style("opacity", show ? 0.05:1);
        //show the card
        that.showCard(g, show);
      };

    },
	selected:{}
  };
  
  //make it happen
  that.initCompanies(companyList);
  that.initCards(companyList);
  that.initEmployees(employeeList);

})(visProps, companies, people);