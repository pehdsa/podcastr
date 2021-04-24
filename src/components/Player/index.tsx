import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '../../contexts/playerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export default function Player() {

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay, 
        setPlayingState,
        playPrevious,
        playNext,
        hasNext,
        hasPrevious,
        isLooping,
        toogleLoop,
        isShuffling,
        toogShuffle,
        clearPlayerState
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);

    const [ progress, setProgress ] = useState(0);

    useEffect(() => {
        if (!audioRef.current) return;

        if(isPlaying) {            
            audioRef.current?.play() 
        } else {            
            audioRef.current?.pause();
        }        
    },[isPlaying]);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current?.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if(hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    return (
        <div className="playerContainer">
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className="currentEpisode">
                    <Image 
                        src={ episode.thumbnail } 
                        width={592} 
                        height={592} 
                        objectFit="cover" 
                    />
                    <strong>{ episode.title }</strong>
                    <span>{ episode.members }</span>
                </div>
            ) : (
                <div className="emptyPlayer">
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }            
 
            <footer className={ !episode && 'empty' }>
                <div className="progress">
                    <span>{ convertDurationToTimeString(progress) }</span>

                    <div className="slider">
                        { episode ? (
                            <Slider 
                                max={ episode.duration }
                                value={ progress }
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04D361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '##04D361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className="emptySlider"></div>
                        ) }                        
                    </div>
                    
                    <span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span>
                </div>

                { episode && (
                    <audio 
                        ref={ audioRef }
                        src={ episode.url }
                        autoPlay={ true }
                        loop={ isLooping }
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                ) }

                <div className="buttons">
                    
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1}
                        onClick={toogShuffle}
                        className={ isShuffling ? 'isActive' : '' }
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    
                    <button type="button" 
                        onClick={togglePlay} 
                        className="playButton" 
                        disabled={!episode}
                    >
                        
                        { isPlaying ? (
                            <img src="/pause.svg" alt="Tocar" />
                        ) : (
                            <img src="/play.svg" alt="Tocar" />
                        ) }
                        
                    </button>
                    
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próximo" />
                    </button>
                    
                    <button 
                        type="button" 
                        disabled={!episode} 
                        onClick={toogleLoop}
                        className={ isLooping ? 'isActive' : '' }
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                    
                </div>
            </footer>
        </div>
    )
}