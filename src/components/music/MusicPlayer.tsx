import React, {useRef, useState} from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import { VscUnmute, VscMute } from 'react-icons/vsc'
import styles from './MusicPlayer.module.css'

type MusicProp = {
    src: string,
    className?: string,
}

type AudioType = {
  duration?: number,
  currentTime?: number,
  length?: number,
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

const MusicPlayer:React.FC<MusicProp> = ({src, className}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const seekRef = useRef<HTMLInputElement>(null)
  const volumeRef = useRef<HTMLInputElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [voloumePercent, setVolumePercent] = useState(50)
  const [audio, setAudio] = useState<AudioType>({
    duration: 0.00,
    currentTime: 0.00,
    length: 0,
  })

    
  const timeUpdateHandler = ()=>{
    setAudio({
      duration: audioRef.current ? parseFloat(((audioRef.current?.duration) / 60).toFixed(2)) : 0,
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
  
  const muteHandler = () => {
    if (audioRef.current) {
      if (audioRef.current.muted) {
        audioRef.current.muted = false
        setMuted(false)
      }
      else {
        audioRef.current.muted = true
        setMuted(true)
      }
      }
    }
    
  const volumeHandler = () => {
    if (volumeRef.current && audioRef.current) {
      audioRef.current.volume = getPercentValue(1, parseInt(volumeRef.current.value))
    }
    volumeRef.current && setVolumePercent(getPercent(parseFloat(volumeRef.current.value), 100))
  }
  return (
    <div className={styles.container}>
      <div className={className ? className : styles.player}>
        <button className={styles.playButton} onClick={audioPlayHandler}>
          {!playing ? <FaPlay className={styles.icon}/> : <FaPause className={styles.icon}/>}
        </button>
        <audio onTimeUpdate={timeUpdateHandler} ref={audioRef} src={src}></audio>
        <div className={styles.controls}>
          <input onChange={seekHandler} ref={seekRef} className={styles.timeline} style={{ backgroundSize: `${audio.length}%`}} type="range" name="slider" max='100' value={audio.length} />
        </div>
        <small className={styles.duration}>{audio.currentTime}/ {audio.duration}</small>
        <div className={styles.soundControls}>
        <button className={styles.soundButton} onClick={muteHandler}>
          {!muted ?
              <VscUnmute className={styles.volumeIcon} />:
              <VscMute className={styles.volumeIcon} />
          }
          </button>
          <input className={styles.volumeControl}
            style={{ backgroundSize: `${voloumePercent}%`}}
            type="range" ref={volumeRef} name="volume" max={100} onChange={volumeHandler} />
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer