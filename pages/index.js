import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Bar } from "react-chartjs-2";
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title } from "chart.js";

import { get, ref, query, orderByChild, startAt, limitToLast, equalTo } from 'firebase/database'
import useQuery from '../hooks/useQuery'

import styles from '../styles/Home.module.css'
import fontStyles from '../styles/Font.module.css'
import MenuIcon from '../public/menu.svg'
import NotifIcon from '../public/bell.svg'
import SearchIcon from '../public/search.svg'
import ProfileImg from '../public/image 3.png'
import Maps from '../public/maps.png'

Chart.register(...registerables, LineController, LineElement, PointElement, LinearScale, Title);

const getAverage = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

function Home() {
  const date = new Date();
  const totalLamps = 1;
  const sector = "Dago";
  const timeFormat = {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  const measurementsData = useQuery({
    path: 'measurements/unit_1',
    queries: [
      limitToLast(10)
    ]
  })
  const [isLoading, setIsLoading] = useState(measurementsData.loading);
  const [timeLabels, setTimeLabels] = useState([]);
  const [luxValues, setLuxValues] = useState([]);

  useEffect(() => {
    setIsLoading(measurementsData.loading);
    if (!measurementsData.loading) {
      setTimeLabels(Object.keys(measurementsData.snapshot).map(key => new Date(measurementsData.snapshot[key].timestamp*1000).toLocaleTimeString('en-GB', timeFormat)));
      setLuxValues(Object.keys(measurementsData.snapshot).map(key => measurementsData.snapshot[key].lux));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementsData.loading])

  const luminanceAvg = getAverage(luxValues).toFixed(2);;
  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Luminance",
        data: luxValues,
        backgroundColor: "#007AFF",
        barThickness: 10,
        borderRadius: 16
      },
    ],
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Street Light</title>
        <meta name="description" content="Smart street light frontend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Image src={MenuIcon} alt="Menu icon" />  
          <Link href="/">
            <span className={`${fontStyles.headerTitle} ${styles.headerTitle}`}>Smart Street Light</span>
          </Link>
        </div>
        <div className={styles.headerContent}>
          <div className={styles.iconWrapper}>
            <Image src={SearchIcon} alt="Search icon" className={styles.icon} />
          </div>
          <div className={styles.iconWrapper}>
            <Image src={NotifIcon} alt="Notification icon" className={styles.icon} />
          </div>
          <div className={styles.iconWrapper}>
            <Image src={ProfileImg} alt="Profile picture" className={styles.icon} /> 
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <span className={`${fontStyles.display} ${styles.mainTitle}`}>
          Dashboard
        </span>
        <div className={styles.mapsCard}>
          <Image src={Maps} alt="Maps" className={styles.maps} />
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <span className={`${fontStyles.subText} ${styles.cardTypeText}`}>Date</span>
            <span className={`${fontStyles.display} ${styles.cardValueText}`}>{date.toLocaleDateString('en-GB')}</span>
          </div>
          <Link href="/lamps">
            <div className={styles.card}>
              <span className={`${fontStyles.subText} ${styles.cardTypeText}`}>Total lamps</span>
              <span className={`${fontStyles.display} ${styles.cardValueText}`}>{totalLamps}</span>
            </div>
          </Link>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <span className={`${fontStyles.subText} ${styles.cardTypeText}`}>Sector</span>
            <span className={`${fontStyles.display} ${styles.cardValueText}`}>{sector}</span>
          </div>
        </div>
        <div className={styles.chartCard}>
          <span className={`${fontStyles.subText} ${styles.cardTypeText}`}>Luminance Average</span>
          <span className={`${fontStyles.display} ${styles.cardValueText}`}>{luminanceAvg} lux</span>
          <Bar 
            data={chartData}
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
      </main>
    </div>
  )
}

export default Home;