import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './Playlist.css';
import GetPlaylist from '../../utils/api/GetPlaylist';
import fontSizeAdjuster from '../../utils/fontSizeAdjuster';

const Playlist = forwardRef((props, ref) => {

    const [playlistDisplay, setPlaylistDisplay] = useState();
    
    useImperativeHandle(ref, () => ({
        getPlaylistDisplay() {
            setSearchByMenuClass('search-by-menu is-clickable');
            setPlaylistDisplay(<GetPlaylist playlistUrl={props.playlistUrl}/>);
            console.log('Request sent.');
        }
    }));
    
    const [playlistSearchTerm, setPlaylistSearchTerm] = useState();

    function searchPlaylist(event) {
        if (playlistDisplay) {
            setPlaylistSearchTerm(event.target.value.toLowerCase());
        }
    }

    const [searchByTerm, setSearchByTerm] = useState('Title');

    function handleChangeSearchByTerm() {
        if (props.playlistData) {
            if (searchByTerm === 'Title') {
                setSearchByTerm('Channel');
            }
            else if (searchByTerm === 'Channel') {
                setSearchByTerm('Title');
            }
        } 
    }

    useEffect(() => {
        
        if (props.playlistData) {
            let filteredList = [];
            for (let i = 0; i < props.playlistData.length; i++) {
                if (searchByTerm === 'Title' && (typeof props.playlistData[i] !== undefined)) {
                    if (props.playlistData[i].title.toLowerCase().includes(playlistSearchTerm)) {
                        filteredList.push(props.playlistData[i]);
                    }
                }
                if (searchByTerm === 'Channel') {
                    console.log(i);
                    if (props.playlistData[i].channel.toLowerCase().includes(playlistSearchTerm)) {
                        filteredList.push(props.playlistData[i]);
                    }
                }
                
            }
            let pDisplay = [];
                for (let i = 0; i < filteredList.length; i++) {
                    let content = (
                        <>
                        {React.createElement('div', {style: {fontSize: filteredList[i].id >= 999 ? "48px" : "60px"}, className: 'list-number-container', title: `Playlist item ${filteredList[i].id + 1}`}, filteredList[i].id + 1)}
                        <div className='title-container' title={filteredList[i].title} style={fontSizeAdjuster(filteredList[i].title)}>{filteredList[i].title}</div>
                        <div className='channel-container' title={filteredList[i].channel}>{filteredList[i].channel}</div>
                        </>
                    )
            
                    if (i === 1) {
                        pDisplay.push( 
                            <div className='list-item-container' key={i} id='top-item'>{content}</div>
                        )
                    }
                    else if (i === filteredList.length) {
                        pDisplay.push( 
                            <div className='list-item-container' key={i} id='bottom-item'>{content}</div>
                        )
                    }
                    else {
                        pDisplay.push( 
                            <div className='list-item-container' key={i}>{content}</div>
                        )
                    }
                }
                
            setPlaylistDisplay(pDisplay);
        }
        
    }, [playlistSearchTerm]);

    // Styling states Below

    const [searchByMenuClass, setSearchByMenuClass] = useState('search-by-menu');

    return (
        <>
            <div className='playlist-search-container'>
                <div><input name='search-playlist' className='search-playlist' placeholder='Search playlist...' onChange={searchPlaylist}/></div>
                <button className={searchByMenuClass} onClick={handleChangeSearchByTerm} title={`Search By ${searchByTerm}`}>Search By {searchByTerm}</button>
            </div>
            <div className='playlist'>
                {playlistDisplay}
            </div>
        </>
    )
});

export default Playlist;