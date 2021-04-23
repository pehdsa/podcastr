import { useContext, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlayerContext } from '../../contexts/playerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'

export default function Player() {

    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if(isPlaying) {            
            audioRef.current?.play() 
        } else {            
            audioRef.current?.pause();
        }        
    },[isPlaying])

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
                    <span>00:00</span>

                    <div className="slider">
                        { episode ? (
                            <Slider 
                                trackStyle={{ backgroundColor: '#04D361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '##04D361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className="emptySlider"></div>
                        ) }                        
                    </div>
                    
                    <span>00:00</span>
                </div>

                { episode && (
                    <audio 
                        ref={ audioRef }
                        src={ episode.url }
                        autoPlay={ true }
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                ) }

                <div className="buttons">
                    
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    
                    <button type="button" disabled={!episode}>
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
                    
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar próximo" />
                    </button>
                    
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                    
                </div>
            </footer>
        </div>
    )
}