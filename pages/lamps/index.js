import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useState, useEffect} from "react"

import { get, ref, query, orderByChild, startAt, limitToFirst, equalTo } from 'firebase/database'
import useQuery from '../../hooks/useQuery'

import styles from '../../styles/Table.module.css'
import homeStyles from '../../styles/Home.module.css'
import fontStyles from '../../styles/Font.module.css'

import MenuIcon from '../../public/menu.svg'
import NotifIcon from '../../public/bell.svg'
import SearchIcon from '../../public/search.svg'
import ProfileImg from '../../public/image 3.png'

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

const data = [
  {
    "name": "unit_1",
    "isActive": true,
    "isUseThreshold": true,
    "energy": 100,
    "luxThreshold": 200,
    "activeTime": "2022-11-26T01:46:40Z",
    "location": "Taman Sari",
    "sector": "Dago"
  }
]

const Tag = ({isActive}) => {
  return ( isActive 
    ? <div className={styles.activeTag}>
        <span className={`${fontStyles.subText} ${styles.tagText}`}>Active</span>
      </div>
    : <div className={styles.inactiveTag}>
        <span className={`${fontStyles.subText} ${styles.tagText}`}>Inactive</span>
      </div>
  );
};

function LampsList() {
  const [currentTime, setCurrenTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const lampsData = useQuery({
    path: 'lamps',
    queries: []
  })

  useEffect(() => {
    setInterval(() => {
      setCurrenTime(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
    setIsLoading(lampsData.loading);
    if (!lampsData.loading) {
      setData(Object.keys(lampsData.snapshot).map(key => lampsData.snapshot[key]));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lampsData.loading])

  const heading = [{name: 'Name', width: "45px"}, {name: 'Status', width: "60px"}, {name: 'Energy', width: "45px"}, {name: 'Duration', width: "60px"}, {name: 'Threshold', width: "60px"}];
  return (
    <div className={homeStyles.container}>
      <Head>
        <title>List of Lamps</title>
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
          Details
        </span>
        <div>
        <div className={styles.tableWrapper}>
          <div className={styles.row}>
            {heading.map((head, index) => 
              <div key={index} className={`${fontStyles.subText} ${styles.colTitleText}`} style={{width: head.width, textAlign: "center"}}>
                {head.name}
              </div>
            )}
          </div>
            {data.map((data,index) =>(
              <><hr key={"test"+index} className={styles.separator} />
              <Link key={index} href="/lamps/unit_1" style={{ width: "100%" }}>
                <div className={styles.row}>
                  <div className={`${fontStyles.subText} ${styles.colBodyText}`} style={{ width: "45px", textAlign: "center" }}>{data.name}</div>
                  <div style={{ width: "60px", textAlign: "center" }}>
                    <Tag isActive={data.isActive} />
                  </div>
                  <div className={`${fontStyles.subText} ${styles.colBodyText}`} style={{ width: "45px", textAlign: "center" }}>{data.energy} %</div>
                  <div className={`${fontStyles.subText} ${styles.colBodyText}`} style={{ width: "60px", textAlign: "center" }} suppressHydrationWarning={true}>{data.isActive
                    ? timeDiff(new Date(data.activeTime), currentTime)
                    : "00:00:00"}</div>
                  <div className={`${fontStyles.subText} ${styles.colBodyText}`} style={{ width: "60px", textAlign: "center" }}>{data.luxThreshold}</div>
                </div>
              </Link></>
              )
            )}
        </div>
        </div>
      </main>
    </div>
  )
}

export default LampsList;