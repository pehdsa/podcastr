import '../styles/css/main.css';
import Head from 'next/head';
import Header from '../components/Header';
import Player from '../components/Player';

import { PlayerProvider } from '../contexts/playerContext';

function MyApp({ Component, pageProps }) {

    return (
        <PlayerProvider>
            
            <div className="appContainer">
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Podcastr</title>
                </Head>
                <main>
                    <Header />   
                    <div className="conteudo">
                        <Component {...pageProps} />
                    </div> 
                </main>
                <Player />
            </div>

        </PlayerProvider>
    )
}

export default MyApp
