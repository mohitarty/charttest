import React, { Component } from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {Line} from 'react-chartjs-2';

const ws = new W3CWebSocket('wss://ws-feed.gdax.com');

class App extends Component {
  

  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "BTC-USD",
              backgroundColor: "rgba(249,99,2,.2)",
              borderColor: "rgba(249,99,2,1)",
              borderWidth: 2,
              pointBorderColor: "#fff",
              pointBackgroundColor: "rgba(249,99,2,1)",
          borderWidth: "2",
          lineTension: 0.45,
          data: []
        }
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [{
            ticks: {
              display: true,
              autoSkip: true,
              maxTicksLimit: 10
              
            },
            gridLines: {
              display: true,
              
           }
          }],
        yAxes:[{
          gridLines: {
            display: true,
            type: 'logarithmic',
            
         },
         ticks:{
           display:true,
           maxTicksLimit:6,
          
         }
        }]
      }
    }
  };

  componentDidMount(){
    //Websocket Object
    const subscribe = {
      type: 'subscribe', 

        channels: [{name:"ticker",product_ids:["BTC-USD"]}]

    };
  
    ws.onopen = () => {
      console.log('WebSocket Client Connected');
      ws.send(JSON.stringify(subscribe));
    
    };
     
      ws.onmessage = (e) => {
        const value = JSON.parse(e.data);
        
        if (value.type !== "ticker") {
          return;
        }
  
        const oldBtcDataSet = this.state.lineChartData.datasets[0];
        const newBtcDataSet = { ...oldBtcDataSet };
        newBtcDataSet.data.push(value.price);
        console.log(value.price);
  
        const newChartData = {
          ...this.state.lineChartData,
          datasets: [newBtcDataSet],
         
            labels: this.state.lineChartData.labels.concat(
              new Date().toLocaleTimeString()
            )
          
          
        };
  
        this.setState({ lineChartData: newChartData });
      };

  }
  componentWillUnmount() {
    this.ws.close();
  }


  
  
  render() {
    
    return (

      <div className='container'>
        <div className='row'>
          <h1>React Charts Test</h1>
        </div>
      <div className='row'>
        <Line
          
          height={800}
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        />
      </div>

      </div>

    );
  }
}

export default App;
