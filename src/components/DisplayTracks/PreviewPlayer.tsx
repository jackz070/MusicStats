import { AnimatePresence, delay, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useAudioPlayers } from "../../hooks/useAudioPlayers";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const PreviewPlayer = ({ preview_url }: { preview_url: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState<number>(0);
  const {
    playerIsPlaying,
    setPlayerIsPlaying,
    triggerPauseAll,
    setTriggerPauseAll,
  } = useAudioPlayers();

  const player = useRef<HTMLAudioElement>(null);
  const play = () => {
    if (player.current && !playerIsPlaying) {
      player.current.play();
      setIsPlaying(true);
    } else if (playerIsPlaying) {
      setTriggerPauseAll(true);
      setTimeout(() => {
        if (player.current) {
          player.current.play();
          setIsPlaying(true);
        }
      }, 200);
    }
  };

  const pause = () => {
    if (player.current) {
      player.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (triggerPauseAll) {
      pause();
    }
  }, [triggerPauseAll]);

  useEffect(() => {
    const current = () =>
      player.current &&
      (player?.current?.currentTime / player?.current.duration) * 100;

    if (isPlaying) {
      player.current?.addEventListener("timeupdate", () =>
        setCurrentPlayTime(current() || 0)
      );
    }

    return () => {
      player.current?.removeEventListener("timeupdate", () =>
        setCurrentPlayTime(current() || 0)
      );
    };
  }, [isPlaying]);

  return (
    <div className="preview_player-button">
      <CircularProgressbarWithChildren
        value={currentPlayTime}
        styles={{ path: { stroke: "white" } }}
      >
        <AnimatePresence>
          {isPlaying ? (
            <motion.svg
              onClick={() => pause()}
              fill="lightgray"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="20px"
              height="20px"
              viewBox="0 0 277.338 277.338"
              xmlSpace="preserve"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="preview_player-icon"
            >
              <g>
                <path
                  d="M14.22,45.665v186.013c0,25.223,16.711,45.66,37.327,45.66c20.618,0,37.339-20.438,37.339-45.66V45.665
         c0-25.211-16.721-45.657-37.339-45.657C30.931,0,14.22,20.454,14.22,45.665z"
                />
                <path
                  d="M225.78,0c-20.614,0-37.325,20.446-37.325,45.657V231.67c0,25.223,16.711,45.652,37.325,45.652s37.338-20.43,37.338-45.652
         V45.665C263.109,20.454,246.394,0,225.78,0z"
                />
              </g>
            </motion.svg>
          ) : (
            <motion.svg
              onClick={() => play()}
              fill="lightgray"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="20px"
              height="20px"
              viewBox="0 0 163.861 163.861"
              xmlSpace="preserve"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="preview_player-icon"
            >
              <g>
                <path
                  d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275
         c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"
                />
              </g>
            </motion.svg>
          )}
        </AnimatePresence>
        <audio
          ref={player}
          onPause={() => setPlayerIsPlaying(false)}
          onPlay={() => setPlayerIsPlaying(true)}
        >
          <source src={preview_url} />
        </audio>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default PreviewPlayer;
