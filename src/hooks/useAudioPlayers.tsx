import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactFragment,
  PropsWithChildren,
} from "react";

interface AudioPlayersType {
  playerIsPlaying: boolean;
  setPlayerIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  triggerPauseAll: boolean;
  setTriggerPauseAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState = {
  playerIsPlaying: false,
  setPlayerIsPlaying: () => {},
  triggerPauseAll: false,
  setTriggerPauseAll: () => {},
};

const AudioPlayersContext = createContext<AudioPlayersType>(initialState);
AudioPlayersContext.displayName = "AudioPlayersContext";

export const AudioPlayersContextProvider = ({
  children,
}: PropsWithChildren) => {
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
