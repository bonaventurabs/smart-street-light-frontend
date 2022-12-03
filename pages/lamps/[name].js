import { useState, useEffect, useRef } from "react";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Switch from 'react-ios-switch';
import videojs from 'video.js';
import VideoJS from '../../components/VideoPlayer/VideoPlayer';
import Tag from "../../components/Tag/Tag";
import BarChart from "../../components/BarChart/BarChart";

import { get, ref, query, orderByChild, startAt, limitToLast, equalTo } from 'firebase/database'
import useQuery from '../../hooks/useQuery'
import useGetValue from '../../hooks/useGetValue'

import styles from '../../styles/Config.module.css'
import homeStyles from '../../styles/Home.module.css'
import fontStyles from '../../styles/Font.module.css'

import MenuIcon from '../../public/menu.svg'
import NotifIcon from '../../public/bell.svg'
import SearchIcon from '../../public/search.svg'
import ProfileImg from '../../public/image 3.png'
import UnitImg from '../../public/unit-pict.png'
import CameraIcon from '../../public/camera-icon.svg'
import LampIcon from '../../public/lamp-icon.svg'

function timeDiff (startTime, endTime) {
  var diff = endTime.getTime() - startTime.getTime();

  var msec = diff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;
  return(hh + ":" + mm + ":" + ss);
}

// const data =  {
//     "name": "unit_1",
//     "isActive": true,
//     "isUseThreshold": true,
//     "energy": 100,
//     "luxThreshold": 200,
//     "activeTime": "2022-11-26T01:46:40Z",
//     "location": "Tamansari",
//     "sector": "Dago"
//   }

//   const luxData = [
//     {
//       "name": "unit_1",
//       "isActive": true,
//       "isUseThreshold": true,
//       "energy": 100,
//       "luxThreshold": 200,
//       "activeTime": "2022-11-26T01:46:40Z",
//       "location": "Taman Sari",
//       "sector": "Dago"
//     },
//   ]

const getAverage = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

function LampDetail() {
  const timeFormat = {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  const router = useRouter();
  const { name } = router.query;
  const [sensorChecked, setSensorChecked] = useState(true);
  const [cameraChecked, setCameraChecked] = useState(true);
  const [currentTime, setCurrenTime] = useState(new Date());
  
  const playerRef = useRef(null);
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
      src: 'http://45.118.114.26:80/camera/Tamansari.m3u8',
      type: 'application/x-mpegURL'
      },
      {
      src: 'http://45.118.114.26:80/camera/DjuandaBarat.m3u8',
      type: 'application/x-mpegURL'
      },
      {
      src: 'http://45.118.114.26:80/camera/CihampelasUtara.m3u8',
      type: 'application/x-mpegURL'
      }
    ]
  };

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeLabels, setTimeLabels] = useState([]);
  const [luxValues, setLuxValues] = useState([]);
  const luminanceAvg = getAverage(luxValues).toFixed(2);;

  const unitData = useGetValue('lamps/unit_1');

  const measurementsData = useQuery({
    path: 'measurements/unit_1',
    queries: [
      limitToLast(10)
    ]
  });

  useEffect(() => {
    setIsLoading(unitData.isLoading);
    if (!unitData.isLoading) {
      setData(unitData.snapshot);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitData.isLoading])

  useEffect(() => {
    setIsLoading(measurementsData.loading);
    if (!measurementsData.loading) {
      setTimeLabels(Object.keys(measurementsData.snapshot).map(key => new Date(measurementsData.snapshot[key].timestamp*1000).toLocaleTimeString('en-GB', timeFormat)));
      setLuxValues(Object.keys(measurementsData.snapshot).map(key => measurementsData.snapshot[key].lux));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementsData.loading])

  // useEffect(() => {
  //   const timerId = setInterval(() => {
  //     setCurrenTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(timerId);
  // }, []);

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Lamp Detail</title>
        <meta name="description" content="Smart street light frontend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={homeStyles.header}>
        <div className={homeStyles.headerContent}>
          <Image src={MenuIcon} alt="Menu icon" />  
          <Link href="/">
            <span className={`${fontStyles.headerTitle} ${homeStyles.headerTitle}`}>Smart Street Light</span>
          </Link>
        </div>
        <div className={homeStyles.headerContent}>
          <div className={homeStyles.iconWrapper}>
            <Image src={SearchIcon} alt="Search icon" className={homeStyles.icon} />
          </div>
          <div className={homeStyles.iconWrapper}>
            <Image src={NotifIcon} alt="Notification icon" className={homeStyles.icon} />
          </div>
          <div className={homeStyles.iconWrapper}>
            <Image src={ProfileImg} alt="Profile picture" className={homeStyles.icon} /> 
          </div>
        </div>
      </header>
      <main className={homeStyles.main}>
        <span className={`${fontStyles.display} ${homeStyles.mainTitle}`}>
          Configuration
        </span>
        <div className={styles.cameraWrapper}>
          {/* <Image src={CameraImg} alt="Camera view" className={styles.cameraView} />
          <Image src={CameraIcon} alt="Camera icon" className={styles.cameraIcon} /> */}
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady}  />
        </div> 
        <div className={styles.rowWrapper}>
          <div className={styles.card}>
            <span className={`${fontStyles.cardTitle} ${styles.cardTitle}`}>{name}</span>
            <div className={styles.grid}>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Status</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>:</div>
              <Tag isActive={data?.isActive} />
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Energy</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>:</div>
              <div className={`${fontStyles.cardText} ${styles.gridValueText}`}>{data?.energy} %</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Duration</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>:</div>
              <div className={`${fontStyles.cardText} ${styles.gridValueText}`} suppressHydrationWarning={true}>{data?.isActive
                ? timeDiff(new Date(data?.activeTime*1000), currentTime)
                : "00:00:00"}
              </div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Threshold</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>:</div>
              <div className={`${fontStyles.cardText} ${styles.gridValueText}`}>{data?.luxThreshold}</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Location</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>:</div>
              <div className={`${fontStyles.cardText} ${styles.gridValueText}`}>{data?.location}</div>
              {/* <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Sector</div>
              <div className={`${fontStyles.cardText} ${styles.gridLabelText}`}>:</div>
              <div className={`${fontStyles.cardText} ${styles.gridValueText}`}>{data?.sector}</div> */}
            </div>
          </div>
          <div className={styles.imageCard}>
            <Image src={UnitImg} alt="Unit photo" className={styles.image} />
          </div>
        </div>
        <div className={styles.configCard}>
          <div className={styles.rowConfig}>
            <div className={styles.configLabel}>
              <Image src={LampIcon} alt="Lamp icon" className={styles.icon}/>
              <span className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Light Sensor</span>
            </div>
            <Switch
              disabled={true}
              checked={sensorChecked}
              onChange={nextSensorChecked => {setSensorChecked(nextSensorChecked)}}
              suppressHydrationWarning={true}
            />
          </div>
          <hr className={styles.separator} />
          <div className={styles.rowConfig}>
            <div className={styles.configLabel}>
              <Image src={CameraIcon} alt="Camera icon" className={styles.icon}/>
              <span className={`${fontStyles.cardText} ${styles.gridLabelText}`}>Camera</span>
            </div>
            <Switch
              disabled={true}
              checked={cameraChecked}
              onChange={nextCameraChecked => {setSensorChecked(nextCameraChecked)}}
              suppressHydrationWarning={true}
            />
          </div>
        </div>
        <BarChart XData={timeLabels} YData={luxValues} average={luminanceAvg} />
      </main>
    </div>
  )
}

export default LampDetail;