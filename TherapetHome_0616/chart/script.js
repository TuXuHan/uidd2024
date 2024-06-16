const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const dark = '#AA9277';

const scale = 1.4;
const curve = 5*scale;
const point_size = 18*scale;
const font_size = 25*scale;
const line_width = 3*scale;
const anno_pos = 40*scale;
const grid_width = 68*scale;



var Values = [2,3,0,4,1,5,3,2,5,2,3,2,5,2,3];
var vc = 0;
Values.forEach(element => {
  if(element==0){vc++;}
});
const Value_count = Values.length-vc;

$(".chartWrapper_B")[0].style.width=Values.length*grid_width+"px";

/*const paw = new Image();
paw.src = "mic2.png";
paw.style.width = "200%";*/

//$(".chartTitleText")[0].style.fontSize=300;


google.charts.load('current',{packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  // Set Data
  const dots = Values;
  var dot_count = dots.length;

  var data = [['Day', 'Level', 'tag', {role: 'annotation', type: 'string'}]];
  for (let i=0;i<dot_count;i++ in dots){
    if(dots[i]!=0){data.push([i+0.5,dots[i]-1,0,weekdays[i%7]]);}
    else{data.push([i+0.5,null,0,weekdays[i%7]]);}
  }
  //console.log("data: "+data);
  const chart_data = google.visualization.arrayToDataTable(data);

  // Set Options
  const chart_options = {

    interpolateNulls: true,
    pointSize: point_size,
    legend: 'none',
    colors: [dark,'transparent'],
    vAxis: {
      baselineColor: "transparent",
      format: "",
      textPosition: 'none',
      ticks: [0,1,2,3,4],
      minValue: 0,
      maxValue: 4,
    },
    hAxis: {
      baselineColor: "transparent",
      minValue: 0,
      maxValue: dot_count,
      textPosition: 'none',
      gridlines: {
        //color: "black",
        count: dot_count,
      },
      minorGridlines: {
        color: "transparent"
      }
    },
    chartArea: {
      left: 0,
      right: 0,
      top: anno_pos*0.3,
      bottom: anno_pos*1.3,
    },
    lineWidth: line_width,
    enableInteractivity: false,
    annotations: {
      
      textStyle: {
          color: 'white',
          auraColor: 'transparent',
          fontSize: font_size,
      },
      boxStyle: {
        rx: curve,
        ry: curve,
        gradient: {
          color1: dark,
          color2: dark,
          x1: '0%', y1: '0%',
          useObjectBoundingBoxUnits: true
        }
      },
      alwaysOutside: true,
      stem: {
        length: -anno_pos
      },
    }
  };

  // Draw
  const chart = new google.visualization.LineChart(document.getElementById('mainChart'));
  chart.draw(chart_data, chart_options);

  
  //setInterval(function(){iterate_dots();},1000);
  

};

var cir_count = 0;
var wrapperA = $(".chartWrapper_A")[0];
var wrapperA_width = wrapperA.offsetWidth;
function iterate_dots(){
  var cirs = $("#mainChart div div div svg g")[0].getElementsByTagName("circle");
  var cir = cirs[cir_count].getBoundingClientRect();

  console.log(cir_count,cir.left,wrapperA_width);
  wrapperA.scrollTo({
    top: 0,
    left: cir.left-wrapperA_width/2+wrapperA.scrollLeft,
    behavior: "smooth",
  });
  cir_count++;
  if (cir_count>=Value_count){cir_count=0;}
}