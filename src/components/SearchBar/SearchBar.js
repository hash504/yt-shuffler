import React, { useState, useRef } from 'react';
import './SearchBar.css';
import addIcon from './add_icon.png';
import Playlist from '../Playlist/Playlist';
import ControlPanel from '../ControlPanel/ControlPanel';
import GetPlaylistData from '../../utils/api/GetPlaylistData';

const SearchBar = (props) => {

    const [playlistUrl, setPlaylistUrl] = useState();
    const [targetUrl, setTargetUrl] = useState();
    const [playlistData, setPlaylistData] = useState();

    const playlistRef = useRef();
    const controlPanelRef = useRef();

    function handleChange(event) {
        const playlistUrl = event.target.value;
        setPlaylistUrl(playlistUrl);
        const targetUrl = event.target.value.slice(event.target.value.indexOf('=') + 1);
        setTargetUrl(targetUrl);
        
    }

    function loadPlaylist() { // Checks the url three times, once for if it's not undefined, once for if it includes the beginning of the youtube url, and once if it only includes letters, numbers and hyphens.
        if (playlistUrl && targetUrl) {
            if (playlistUrl.includes('youtube.com/playlist?list=')) {
                if ((/([^A-Za-z0-9-_&=])/g).test(targetUrl)) {
                    alert("Invalid URL. Copy-Paste URL directly from search bar.");
                }
                else {
                    controlPanelRef.current.resetWhenNewPlaylist();
                    playlistRef.current.getPlaylistDisplay();
                    setPlaylistData(GetPlaylistData(targetUrl));
                }    
            }
            else {
                alert("Invalid URL. Copy-Paste URL directly from search bar.");
            }
        }
        else {
            alert("No URL provided.");
        }
    }

    return (
        <>
        <div className='search-bar'>
            <input name='search-bar' className='text' placeholder='Insert Playlist URL...' onChange={handleChange}/>
            <button onClick={loadPlaylist}><img src={addIcon} alt='Add Playlist' title='Add Playlist'/></button>
        </div>
        <div className='content-containers'>
            <div className='playlist-container'><Playlist playlistUrl={targetUrl} ref={playlistRef} playlistData={playlistData}/></div>
            <div className='controlpanel-container'><ControlPanel playlistData={playlistData} ref={controlPanelRef}/></div>
        </div>
        </>
    )
}

export default SearchBar;