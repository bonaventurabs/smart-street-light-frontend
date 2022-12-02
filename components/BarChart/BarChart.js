import { Bar } from "react-chartjs-2";
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from "chart.js";

import styles from '../../styles/Home.module.css'
import fontStyles from '../../styles/Font.module.css'

Chart.register(...registerables, LineController, LineElement, PointElement, LinearScale, Title);

const BarChart = ({XData, YData, average}) => {
  const data = {
    // date.toLocaleTimeString('en-GB', timeFormat)
    labels: XData,
    datasets: [
      {
        label: "Luminance",
        data: YData,
        backgroundColor: "#007AFF",
        barThickness: 10,
        borderRadius: 16
      },
    ],
  };

  return (
    <div className={styles.chartCard}>
      <span className={`${fontStyles.subText} ${styles.cardTypeText}`}>Luminance Average</span>
      <span className={`${fontStyles.display} ${styles.cardValueText}`}>{average} lux</span>
      <Bar 
        data={data}
        options={{
          scales: {
            x: {
              grid: {
                display: false,
              }
            },
            y: {
              grid: {
                display: false,
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;