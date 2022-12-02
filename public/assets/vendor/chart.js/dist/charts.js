/* var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var d = new Date();
var namedMonth = months[d.getMonth()+1];

const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];
  
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [20, 10, 5, 2, 20, 30, 45],
    }]
  };
  
  const config = {
    type: 'bar',
    data: data,
    options: {}
  };

  const Secondconfig = {
    type: 'line',
    data: data,
    options: {}
  };

  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );

  const mySecondChart = new Chart(
    document.getElementById('secondChart'),
    Secondconfig
  ); */