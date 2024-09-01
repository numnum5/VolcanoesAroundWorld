import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';

// Registers different ChartJS components for use
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// A component for displaying BarChart
export default function BarChart(props) {

    // Chart configurations
    const chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        // Title of the graph
        title: {
          display: true,
          text: 'Population Density',
          font: {
            size: 16, 
            family: 'Arial', 
          },
        },
      },
      animation: {
        duration: 1000, 
        easing: 'easeInOutQuad', 
      },
      scales: {
        // Label for X-axis
        x: {
          title: {
            display: true,
            text: 'Distance', 
            font: {
              size: 14, 
              family: 'Arial', 
            },
          },
        },
        // Label for Y-axis
        y: {
          title: {
            display: true,
            text: 'Population', 
            font: {
              size: 14, 
              family: 'Arial'
            },
          },
        },
      },
    };

    // Data configuration
    const data = {
      
      labels: ['5Km', '10km', '30km', '100km'],
      datasets: 
      [
        {
          label: 'Population',
          data: [props.population_5km, props.population_10km, props.population_30km, props.population_100km],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderWidth: 2
        }
      ]
    };
    return (
    <div className="chart" >
        <Bar data={data} options={chartOptions} />
      </div>
    );
  }