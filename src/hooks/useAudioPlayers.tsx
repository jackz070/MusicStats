import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactFragment,
} from "react";

const AudioPlayersContext = createContext({});
AudioPlayersContext.displayName = "AudioPlayersContext";

export const AudioPlayersContextProvider = ({
  children,
}: {
  children: ReactFragment;
}) => {
  const AudioPlayers = useProvideAudioPlayers();

  return (
    <AudioPlayersContext.Provider value={AudioPlayers}>
      {children}
    </AudioPlayersContext.Provider>
  );
};

export const useAudioPlayers = () => {
  return useContext(AudioPlayersContext);
};

const useProvideAudioPlayers = () => {
  const [playerIsPlaying, setPlayerIsPlaying] = useState(false);
  const [triggerPauseAll, setTriggerPauseAll] = useState(false);
  useEffect(() => {
    if (triggerPauseAll) {
      setTimeout(() => {
        setTriggerPauseAll(false);
      }, 200);
    }
  }, [triggerPauseAll]);

  return {
    playerIsPlaying,
    setPlayerIsPlaying,
    triggerPauseAll,
    setTriggerPauseAll,
  };
};
