import { useEffect, useRef, useState } from 'react'
import { getDatabase, ref, child, get } from 'firebase/database'
import { databaseConf } from '../config/firebaseConfig'

const useGetValue = (path, initialLoad = true) => {
  const [isLoading, setIsLoading] = useState(initialLoad)
  const snapshot = useRef(null)
  const error = useRef(null)
  const isEmpty = useRef(false)

  const getValue = async () => {
    try {
      const database = getDatabase(databaseConf)
      const rootReference = ref(database)
      const dbGet = await get(child(rootReference, path))
      const dbValue = dbGet.val()
      const dbExist = dbGet.exists()

      if (!dbExist) {
        isEmpty.current = true
      }
      snapshot.current = dbValue
    } catch (getError) {
      error.current = getError.message
    }
    setIsLoading(false)
  }

  const getValueLater = () => {
    snapshot.current = null
    error.current = null
    setIsLoading(true)
  }

  useEffect(() => {
    if (isLoading) {
      getValue()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return {
    isLoading,
    getValueLater,
    isEmpty: isEmpty.current,
    snapshot: snapshot.current,
    error: error.current
  }
}

export default useGetValue