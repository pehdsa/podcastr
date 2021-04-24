import { createContext, useState, ReactNode, useContext } from 'react';

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
    setPlayingState: (mode: boolean) => void,
    playList: (list: Episode[], index: number) => void,
    playNext: () => void,
    playPrevious: () => void,
    hasPrevious: boolean,
    hasNext: boolean,
    isLooping: boolean,
    toogleLoop: () => void,
    isShuffling: boolean,
    toogShuffle: () => void,
    clearPlayerState: () => void
}

interface PlayerProviderProps {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerProvider({ children } : PlayerProviderProps) {

    const [ episodeList, setEpisodeList ] = useState([]);
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
    const [ isPlaying, setIsPlaying ] = useState(true);
    const [ isLooping, setIsLooping ] = useState(false);
    const [ isShuffling, setIsShuffling ] = useState(false);

    
    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function setPlayingState(mode: boolean) {
        setIsPlaying(mode);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {
        if(isShuffling) {
            const nextRandomEpIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpIndex);
        }
        else if ( hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);            
        }
    }

    function playPrevious() {
        if ( hasPrevious ) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);            
        }
    }

    function toogleLoop() {
        setIsLooping(!isLooping);
    }

    function toogShuffle() {
        setIsShuffling(!isShuffling);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            play, 
            playList,
            togglePlay, 
            setPlayingState,
            playNext,
            playPrevious,
            hasPrevious,
            hasNext,
            isLooping,
            toogleLoop,
            isShuffling,
            toogShuffle,
            clearPlayerState
        }}>
            { children }
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}