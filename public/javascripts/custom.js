$(document).ready(function(){
    $('#emailWarn').hide();
    //$('.col').hide();
    $('a#email').zclip({
        path:'javascripts/ZeroClipboard.swf',
        copy:function(){return "tvvomomo@gmail.com";},        
        afterCopy:function(){
            $('#emailWarn').fadeIn();
        }
    });
    var data1 = [{
        value : 2,color: "#ECF0F1"},{
        value : 4,color: "#BDC3C7"},{
        value : 3,color: "#95A5A6"},{
        value : 1,color: "#34495e"}];
    var data2 = [{
        value : 4,color: "#ECF0F1"},{
        value : 4,color: "#BDC3C7"},{
        value : 2,color: "#95A5A6"}];
    var data3 = [{
        value : 5,color: "#ECF0F1"},{
        value : 1,color: "#BDC3C7"},{
        value : 3,color: "#95A5A6"},{
        value : 1,color: "#34495e"}];
    var data4 = [{
        value : 4,color: "#ECF0F1"},{
        value : 3,color: "#BDC3C7"},{
        value : 3,color: "#95A5A6"}];
    var data5 = [{
        value : 4,color: "#ECF0F1"},{
        value : 5,color: "#BDC3C7"},{
        value : 1,color: "#95A5A6"}];
    var data6 = [{
        value : 4,color: "#ECF0F1"},{
        value : 6,color: "#BDC3C7"}];
    var data7 = [{
        value : 5,color: "#ECF0F1"},{
        value : 4,color: "#BDC3C7"},{
        value : 1,color: "#95A5A6"}];
    var data8 = [{
        value : 4,color: "#ECF0F1"},{
        value : 5,color: "#BDC3C7"},{
        value : 1,color: "#95A5A6"}];
    var data9 = [{
        value : 4,color: "#ECF0F1"},{
        value : 2,color: "#BDC3C7"},{
        value : 2,color: "#95A5A6"},{
        value : 2,color: "#34495e"}];
    var data10 = [{
        value : 7,color: "#ECF0F1"},{
        value : 3,color: "#BDC3C7"}];

    var data = [{
        value : 8,color: "#16A085"},{
        value : 6,color: "#F39C12"},{
        value : 3,color: "#27AE60"},{
        value : 5,color: "#D35400"},{
        value : 5,color: "#2980B9"},{
        value : 4,color: "#C0392B"},{
        value : 5,color: "#8E44AD"},{
        value : 6,color: "#1ABC9C"},{
        value : 5,color: "#2ECC71"},{
        value : 4,color: "#3498DB"}];
    var ctx=document.getElementById("col").getContext("2d");
       
    var buildChart=function(data){
        chart=new Chart(ctx).Doughnut(data);
        return chart;
    };
    var chart=buildChart(data);  

    $('div .col1').mouseenter(function(){
        buildChart(data1);
    });
    $('div .col2').mouseenter(function(){
        buildChart(data2);
    });
    $('div .col3').mouseenter(function(){
        buildChart(data3);
    });
    $('div .col4').mouseenter(function(){
        buildChart(data4);
    });
    $('div .col5').mouseenter(function(){
        buildChart(data5);
    });
    $('div .col6').mouseenter(function(){
        buildChart(data6);
    });
    $('div .col7').mouseenter(function(){
        buildChart(data7);
    });
    $('div .col8').mouseenter(function(){
        buildChart(data8);
    });
    $('div .col9').mouseenter(function(){
        buildChart(data9);
    });
    $('div .col10').mouseenter(function(){
        buildChart(data10);
    });
    $('div .bow').mouseleave(function(){
        buildChart(data);
    });

});