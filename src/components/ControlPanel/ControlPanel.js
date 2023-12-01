import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './ControlPanel.css';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import playButton from './imgs/play-button.png';
import pauseButton from './imgs/pause-button.png';
import nextButton from './imgs/next-button.png';
import prevButton from './imgs/prev-button.png';
import volumeIcon from './imgs/volume-icon.png';


const ControlPanel = forwardRef((props, ref) => {

    const [videoSelection, setVideoSelection] = useState();
    const [volume, setVolume] = useState(0.5);

    function handleVideoSetChange(event) {
        setVideoSelection(event.target.value);
    }

    function changeVideo() {
        if (videoSelection) { // Check 1: if videoSelection exists
            if (videoSelection > 0) { // Check 2: if videoSelection is a positive number
                if (videoSelection <= props.playlistData.length) { // Check 3: if videoSelection is within the bounds of the playlist
                    setCurrentVideo(props.playlistData[videoSelection - 1].url.slice(0, 43));
                }
                else {
                    alert('Playlist Item ID not found.')
                }
            }
            else {
                alert('Please input a positive number for the ID.')
            }
        }
        else {
            alert('No Playlist Item ID selected.');
        }
    }

    

    function handleVolumeChange(event) {
        setVolume(event.target.value);
    }

    /***** BUTTON FUNCTIONS BELOW *****/

    const [isPlaylistReady, setPlaylistReady] = useState(false); // isPlaylistReady enables use of the Start and Reset playlist buttons, as well as the Priority Setter
    const [isPlaylistActive, setPlaylistActive] = useState(false); // isPlaylistActive enables use of the Play/Pause, Next and Previous Video buttons
    const [isVideoPlaying, setVideoPlaying] = useState(false); // isVideoPlaying disables use of the Priority Setter
    const [shuffleList, setShuffleList] = useState(); // The initial list to be shuffled through
    const [shuffleCache, setShuffleCache] = useState([]); // Values from shuffleList are added to shuffleCache after the video plays. (Allows the Previous Video button to function)
    const [shuffleCacheIndex, setShuffleCacheIndex] = useState(); // Allows for picking videos from shuffleCache.
    const [currentVideo, setCurrentVideo] = useState(); // The current video url
    const [currentVideoIndex, setCurrentVideoIndex] = useState(); // The index of the current video url

    useEffect(() => { // The function for setting isPlaylistReady
        if (props.playlistData) {
            setPlaylistReady(true);
            console.log('Playlist ready.');
        }
        else {
            setPlaylistReady(false);
        }
    }, [props.playlistData])

    useEffect(() => { // Only triggers after the playlist is started
        if (shuffleList && isPlaylistActive === true && isPlaylistReady === true) {
            handleSetVideo();
        }
    }, [isPlaylistActive, isPlaylistReady])

    function createShuffle(data) {
        let list = [];
        for (let i = 1; i <= data.length; i++) {
            list.push(i);
        }
        return list;
    }

    useEffect(() => { // Only triggers when the current video changes, it's for removing the current video from the shuffle list and adding it to the shuffle cache
        if (shuffleList) {
            setShuffleCache([...shuffleCache, shuffleList[currentVideoIndex]]);
            setShuffleList((index) => index.filter(i => i !== shuffleList[currentVideoIndex]));
        }
    }, [currentVideo]);

    /*
    useEffect(() => { // Triggers when the Previous Video button is hit, sets the video to the specific item in the shuffleCache
        if (isPlaylistReady && isPlaylistActive) {
            if (shuffleCacheIndex > 0 && shuffleCacheIndex < shuffleCache.length + 1) {
                setCurrentVideo(props.playlistData[shuffleCache[shuffleCache.length - shuffleCacheIndex]].url.slice(0, 43));
            }
            else {
                alert("Can't go back.");
            }
        }
    }, [shuffleCacheIndex]);
    */

    function handleSetVideo() { // The function for setting the current video
        if (shuffleList.length > 0) {
            let videoIndex = Math.floor((Math.random() * shuffleList.length));
            setCurrentVideo(props.playlistData[shuffleList[videoIndex] - 1].url.slice(0, 43));
            setCurrentVideoIndex(videoIndex);
            console.log('Video has been set.');
        }
        else {
            alert('Playlist ended.');
            handleResetPlaylist();
        }
    }

    function handleStartPlaylist() {
        if (isPlaylistReady === true && isPlaylistActive === false && isVideoPlaying === false) {
            setShuffleList(createShuffle(props.playlistData));
            setPlaylistActive(true);
            console.log('Playlist started.');
        }
    }

    function handleResetPlaylist() {
        if (isPlaylistActive === true) {
            setShuffleList([]);
            setShuffleCache([]);
            setCurrentVideo();
            setCurrentVideoIndex();
            setVideoPlaying(false);
            setPlaylistActive(false);
            console.log('Playlist reset.');
        }
    }

    useImperativeHandle(ref, () => ({ // For handling resetting the playlist when the add playlist button is clicked
        resetWhenNewPlaylist() {
            handleResetPlaylist();
        }
    }));

    function handlePauseAndPlay() {
        if (isPlaylistReady === true && isPlaylistActive === true) {
            if (isVideoPlaying === true) {
                setVideoPlaying(false);
                console.log('Video paused.');
            }
            else {
                setVideoPlaying(true);
                console.log('Video played.');
            }    
        }
    }

    function handleNextVideo() {
        if (isPlaylistActive === true && isPlaylistReady === true) {
            console.log('Went to next video.');
            handleSetVideo();
            if (shuffleCacheIndex > 0) {
                setShuffleCacheIndex(shuffleCacheIndex - 1);
            }
        }
    }

    function handlePrevVideo() {
        if (isPlaylistActive === true && isPlaylistReady === true) {
            alert('Feature unimplemented.');
            /*
            if (shuffleList.length === props.playlistData.length) {
                alert("Can't go back.");
            }
            else {
                setShuffleCacheIndex(shuffleCacheIndex + 1);
                console.log(shuffleCacheIndex);
            }
            */
        }
    }

    /***** PRIORITY SETTER FUNCTIONS BELOW *****/

    const [priorityID, setPriorityID] = useState();
    const [priorityValue, setPriorityValue] = useState();

    function handlePriorityIdChange(event) {
        setPriorityID(Number(event.target.value));
    }

    function handlePriorityValueChange(event) {
        setPriorityValue(Number(event.target.value));
    }

    function handlePrioritySet() {
        if (isPlaylistReady && isPlaylistActive) { // Check 1: Playlist is ready and active
            if(priorityID <= props.playlistData.length && priorityID > 0) { // Check 2: If the priorityID is within the bounds of the playlist (NOT the shuffleList)
                if (priorityValue >= 0) { // Check 3: If  priorityValue is a positive number
                    setShuffleList((index) => index.filter(i => i !== priorityID));
                    for (let i = 0; i < priorityValue; i++) {
                        setShuffleList(oldList => [...oldList, priorityID]);
                    }
                    alert(`Priority for "${props.playlistData[priorityID - 1].title}" has been set to ${priorityValue}`)
                    console.log('Priority Set.');
                }
                else {
                    alert('Please input a positive priority value.');
                }
            }
            else {
                alert('Playlist Item ID not found.');
            }
        }
        else {
            alert("Playlist must be started in order to change priority.");
        }
    }

    function handlePriorityReset() {
        if (isPlaylistReady && isPlaylistActive) {
            setShuffleList(createShuffle(props.playlistData));
            console.log('Priority reset.');
        }
    }

    return (
        <div className='control-panel'>
            <div className='video-player-container'> 
                <VideoPlayer
                    isPlaying={isVideoPlaying}
                    videoUrl={currentVideo}
                    handleNextVideo={() => handleNextVideo()}
                    handlePlay={() => {setVideoPlaying(true)}}
                    handlePause={() => {setVideoPlaying(false)}}
                    volume={volume}
                />
            </div>
            <div className='video-controls-container'>
                <div className='set-video-container'>
                    <input className='set-video-bar' placeholder='Insert Playlist Item ID...' onChange={handleVideoSetChange}/>
                    <button className='set-video-button' onClick={changeVideo}>Set Video</button>
                </div>
                <div className='set-volume-container'>
                    <div className='volume-icon-container'><img src={volumeIcon} className='volume-icon' alt='Volume Icon'/></div>
                    <div className='volume-slider-container'><input type='range' min={0} max={1} step={0.01} value={volume} className='volume-slider' onChange={handleVolumeChange}/></div>
                    <div className='volume-amount-container'>Volume: {Math.round(volume * 100)}%</div>
                </div>
                <div className='start-button-container'>
                    <button className='start-button' title='Start Playlist' onClick={handleStartPlaylist}><div>Start</div></button>
                </div>
                <div className='reset-button-container'>
                    <button className='reset-button' title='Reset Playlist' onClick={handleResetPlaylist}><div>Reset</div></button>
                </div>
                <div className='pause-button-container'>
                    <button className='pause-button' title={isVideoPlaying ? 'Pause Video' : 'Play Video'} onClick={handlePauseAndPlay}><img src={isVideoPlaying ? pauseButton : playButton} alt={isVideoPlaying ? 'Pause Button' : 'Play Button'}/></button>
                </div>
                <div className='next-button-container'>
                    <button className='next-button' title='Next Video' onClick={handleNextVideo}><img src={nextButton} alt='Next Video Button'/></button>
                </div>
                <div className='prev-button-container'>
                    <button className='prev-button' title='Previous Video' onClick={handlePrevVideo}><img src={prevButton} alt='Previous Video Button'/></button>
                </div>
                
            </div>
            <div className='priority-setter-container'> 
                <div className='priority-setter-title-container'>Priority Setter</div>
                <div className='id-bar-container'>
                    <input className='id-bar' placeholder='Insert Playlist Item ID...' onChange={handlePriorityIdChange}></input>
                </div>
                <div className='priority-value-bar-container'>
                    <input className='value-bar' placeholder='Insert Priority value...' onChange={handlePriorityValueChange}/>
                </div>
                <div className='set-priortiy-button-container'> 
                    <button className='set-priority-button' onClick={handlePrioritySet}>Set Priority</button>
                </div>
                <div className='reset-priority-button-container'>
                    <button className='reset-priority-button' onClick={handlePriorityReset}>Reset Priority</button>
                </div>
            </div>
        </div>
    )
});

export default ControlPanel;