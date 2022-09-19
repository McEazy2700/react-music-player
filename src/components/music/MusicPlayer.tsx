import React, {useRef, useState} from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import styles from './MusicPlayer.module.css'

type MusicProp = {
    src: string,
}

type AudioType = {
  duration?: number,
  volume?: number,
  currentTime?: number,
  length?: number
}

/**
 * Returns what rounded up percentage of 'of' is 'num'
 * @param num is what percentage of 'of'
 * @param of base number (5 is what percentage of 20 -> 25%)
 */
const getPercent = (num:number , of:number) => {
  return Math.ceil((num/ of) * 100)
}

/**
 * Returns the relative value of a percentage e.g.
 * if 100% -> 230
 * then 34% -> value
 * @param percent the 100% value
 * @param of the percentage of percent your looking for
 * @returns the value value of 'of' percent of 'percent'
 */
const getPercentValue = (percent:number, of:number) => {
  return (percent * of) / 100
}

const MusicPlayer:React.FC<MusicProp> = ({src}) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const seekRef = useRef<HTMLInputElement>(null)
    const [playing, setPlaying] = useState(false)
    const [audio, setAudio] = useState<AudioType>({
      duration: 0.00,
      volume: 0,
      currentTime: 0.00,
      length: 0
    })

    
    const timeUpdateHandler = ()=>{
      setAudio({
        duration: audioRef.current ? parseFloat(((audioRef.current?.duration) / 60).toFixed(2)) : 0,
        volume: 0,
        currentTime: audioRef.current ? parseFloat(((audioRef.current.currentTime) / 60).toFixed(2)) : 0,
        length: getPercent(audioRef.current?.currentTime ?? 0, audioRef.current?.duration ?? 0)
      })
      if (audioRef.current) {
        audioRef.current.currentTime === audioRef.current.duration && setPlaying(false)
      }
    }
    // console.table(seekRef.current)
    const audioPlayHandler = ()=>{
      if (!playing) {
        audioRef.current?.play()
        setPlaying(true)
      } else {
        audioRef.current?.pause()
        setPlaying(false)
      }
    }

    const seekHandler = ()=>{
      if (audioRef.current && seekRef.current)
      audioRef.current.currentTime = getPercentValue(parseInt(seekRef.current.value) ?? 0, audioRef.current.duration ?? 0)
    }
  return (
    <div className={styles.container}>
      <div className={styles.player}>
        <button className={styles.button} onClick={audioPlayHandler}>
          {!playing ? <FaPlay className={styles.icon}/> : <FaPause className={styles.icon}/>}
        </button>
        <audio onTimeUpdate={timeUpdateHandler} ref={audioRef} src={src}></audio>
        <div className={styles.controls}>
          <input onChange={seekHandler} ref={seekRef} className={styles.timeline} style={{ backgroundSize: `${audio.length}%`}} type="range" name="slider" max='100' value={audio.length} />
        </div>
        <small>{audio.currentTime}/ {audio.duration}</small>
      </div>
    </div>
  )
}

export default MusicPlayer