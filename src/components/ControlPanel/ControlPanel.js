import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './ControlPanel.css';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

import playButton from './imgs/play-button.png';
import pauseButton from './imgs/pause-button.png';
import nextButton from './imgs/next-button.png';
import prevButton from './imgs/prev-button.png';

import volumeHigh from './imgs/volume-icons/volume-high.png';
import volumeMid from './imgs/volume-icons/volume-mid.png';
import volumeLow from './imgs/volume-icons/volume-low.png';
import volumeOff from './imgs/volume-icons/volume-off.png';


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
        setVolume(Number(event.target.value));
    }

    function handleVolumeIconChange() {
        if (volume > 0.75) {
            return volumeHigh;
        }
        else if (volume >= 0.25 && volume <= 0.75) {
            return volumeMid;
        }
        else if (volume > 0 && volume < 0.25) {
            return volumeLow;
        }
        else {
            return volumeOff;
        }
    }

    /***** BUTTON FUNCTIONS BELOW *****/

    const [isPlaylistReady, setPlaylistReady] = useState(false); // Enables use of the Start and Reset playlist buttons, as well as the Priority Setter
    const [isPlaylistActive, setPlaylistActive] = useState(false); // Enables use of the Play/Pause, Next and Previous Video buttons
    const [isVideoPlaying, setVideoPlaying] = useState(false); // Enables the visual effects of the play/pause buttons
    const [shuffleList, setShuffleList] = useState(); // The initial list to be shuffled through
    const [currentVideo, setCurrentVideo] = useState(); // The current video url
    const [currentVideoIndex, setCurrentVideoIndex] = useState(); // The index of the current video url
    const [prevVideo, setPrevVideo] = useState(); // The index of the previous video url
    const [isPrevVideoActive, setPrevVideoActive] = useState(false); // If true, hitting the next video button wont pick from the shuffle list. Also prevents going father back then 1 video.

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


    useEffect(() => { // Only triggers when the current video changes, it's for removing the current video from the shuffle list
        if (shuffleList) {
            setShuffleList((index) => index.filter(i => i !== shuffleList[currentVideoIndex]));
        }
    }, [currentVideoIndex]);

    useEffect(() => { // Addresses a bug where pressing the previous video button on the last playlist item then going back to the last video causes the playlist to not end properly.
        if (shuffleList) {
            if (shuffleList.length === 1 && (currentVideo === prevVideo)) {
                alert('Playlist ended.');
                console.log('Playlist ended prematurely.')
                handleResetPlaylist();
            }
        }
    });
    
    function createShuffle(data) {
        let list = [];
        for (let i = 1; i <= data.length; i++) {
            list.push(i);
        }
        return list;
    }

    function handleSetVideo() { // The function for setting the current and previous video as well as ending the playlist
        if (shuffleList.length > 0) {
            let videoIndex = Math.floor((Math.random() * shuffleList.length));
            setCurrentVideo(props.playlistData[shuffleList[videoIndex] - 1].url.slice(0, 43));
            setCurrentVideoIndex(videoIndex);
            if (currentVideo) {
                setPrevVideo(currentVideo);
            }
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
            setCurrentVideo();
            setCurrentVideoIndex();
            setPrevVideo();
            setPrevVideoActive(false);
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
            if (isPrevVideoActive === false) {
                handleSetVideo();
            }
            else {
                setCurrentVideo(prevVideo);
                setPrevVideo(currentVideo);
                setPrevVideoActive(false);
            }
            console.log('Went to next video.');
        }
    }

    function handlePrevVideo() {
        if (isPlaylistActive === true && isPlaylistReady === true) {
            //alert('Feature unimplemented.');
            if (prevVideo && isPrevVideoActive === false) {
                setPrevVideo(currentVideo);
                setCurrentVideo(prevVideo);
                setPrevVideoActive(true);
            }
            else {
                alert("Can't go further back.");
            }
            
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
        if (isPlaylistReady) { // Check 1: Playlist is ready and active
            if (isPlaylistActive) {
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
                    <input className='set-video-bar' name='set-video-bar' placeholder='Insert Playlist Item ID...' onChange={handleVideoSetChange}/>
                    <button className='set-video-button' onClick={changeVideo}>Set Video</button>
                </div>
                <div className='set-volume-container'>
                    <div className='volume-icon-container'><img src={handleVolumeIconChange()} className='volume-icon' alt='Volume Icon'/></div>
                    <div className='volume-slider-container'><input name='volume-slider' type='range' min={0} max={1} step={0.01} value={volume} className='volume-slider' onChange={handleVolumeChange}/></div>
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
                    <input className='id-bar' name='id-bar' placeholder='Insert Playlist Item ID...' onChange={handlePriorityIdChange}></input>
                </div>
                <div className='priority-value-bar-container'>
                    <input className='value-bar' name ='value-bar' placeholder='Insert Priority value...' onChange={handlePriorityValueChange}/>
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