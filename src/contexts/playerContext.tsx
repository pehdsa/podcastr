import { createContext, useState, ReactNode } from 'react';

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

type PlayerContextData = {
    episodeList: Array<Episode>
    currentEpisodeIndex: number,
    isPlaying: boolean,
    play: (episode: {}) => void
    togglePlay: () => void,
    setPlayingState: (mode: boolean) => void
}

interface PlayerProviderProps {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerProvider({ children } : PlayerProviderProps) {

    const [ episodeList, setEpisodeList ] = useState([]);
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
    const [ isPlaying, setIsPlaying ] = useState(true);

    function play(episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function setPlayingState(mode: boolean) {
        setIsPlaying(mode);
    }

    return (
        <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, isPlaying, play, togglePlay, setPlayingState }}>
            { children }
        </PlayerContext.Provider>
    )
}