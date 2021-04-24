import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import { api } from '../service/api';

import { usePlayer } from '../contexts/playerContext';

type Episode = {
  id: string,      
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[],
  alltEpisodes: Episode[]
}

export default function Home({ latestEpisodes, alltEpisodes }: HomeProps) {

  const { playList } = usePlayer();

  const episodeList = [ ...latestEpisodes, ...alltEpisodes ];

  return (
    <div className="home">

      <section className="latestEpisodes">
        
        <h2>Últimos Lançamentos</h2>
        
        <ul>
            { latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  
                  <div className="episodeThumbnail">
                    <div>
                      <Image                       
                        width={192} 
                        height={192} 
                        src={ episode.thumbnail } 
                        alt={ episode.title } 
                        objectFit="cover"
                      />
                    </div>
                  </div>
                  
                  <div className="episodeDetails">
                    <Link href={ `/episodes/${episode.id}` }>{ episode.title }</Link>
                    <p>{ episode.members }</p>
                    <span>{ episode.publishedAt }</span>
                    <span>{ episode.durationAsString }</span>
                  </div>

                  <button type="button" onClick={() => playList(episodeList, index)}>                    
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>

                </li>
              )
            }) }
        </ul>

      </section>

      <section className="allEpisodes">

        <h2>Todos Episódios</h2>

        <table cellSpacing={0}>
            
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            
            <tbody>
              
                { alltEpisodes.map((episode, index) => {
                  return (
                    <tr key={ episode.id }> 
                      <td>
                        <div className="allEpisodesImgContainer">
                          <Image 
                            width={120}
                            height={120}
                            src={episode.thumbnail}
                            alt={episode.title}
                            objectFit="cover"
                          />
                        </div>
                      </td>
                      <td><Link href={ `/episodes/${episode.id}` }>{ episode.title }</Link></td>
                      <td>{ episode.members }</td>
                      <td style={{ width: 100 }}>{ episode.publishedAt }</td>
                      <td>{ episode.durationAsString }</td>
                      <td>
                        <button type="button" onClick={() => playList(episodeList, (index + latestEpisodes.length))}>
                          <img src="/play-green.svg" alt="Tocar episódio" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              
            </tbody>

        </table>

      </section>

    </div>
  )
}

export const getStaticProps : GetStaticProps = async () => {

  const { data } = await api.get('/episodes', {
    params: {
      _limit: 10,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  });

  const latestEpisodes = episodes.slice(0,2);
  const alltEpisodes = episodes.slice(2,episodes.length);

  return {
    props: {
      latestEpisodes,
      alltEpisodes
    },
    revalidate: 60 * 60 * 8
  }

}
