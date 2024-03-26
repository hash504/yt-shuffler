import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './ControlPanel.css';
import ReactPlayer from 'react-player';

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
    const [isAutoplaying, setAutoplaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [prevVolume, setPrevVolume] = useState();
    const [isMuted, setMute] = useState(false);
    const [muteButtonTitle, setMuteButtonTitle] = useState("Mute");

    function changeVideo() {

        if (isPlaylistReady === true) {

            let filteredList = []
            for (let i = 0; i < props.playlistData.length; i++) {
                if (props.playlistData[i].title.toLowerCase().includes(videoSelection)) {
                    filteredList.push(props.playlistData[i]);
                }
            }
            
            if (videoSelection) { // Check 1: if videoSelection exists
                if (filteredList.length === 1) { // Check 2: if filteredList has one item
                    setVideoPlaying(false);
                    setPrevVideo(currentVideo);
                    setCurrentVideo(filteredList[0].url.slice(0, 43));
                }
                else if (filteredList.length > 1) { // The below for loop and conditionals handle displaying the first 5 results for the specified term
                    let resultsList = '';
                    for (let i = 0; i < 5; i++) {
                        if (i < filteredList.length) {
                            resultsList += `  ${filteredList[i].title}\n`
                        }
                        
                    }
                    if (filteredList.length > 5) {
                        alert(`${filteredList.length} results found for '${videoSelection}':\n${resultsList}...and ${filteredList.length - 5} more.`);
                    }
                    else {
                        alert(`${filteredList.length} results found for '${videoSelection}':\n${resultsList}\n`);
                    }
                }
                else {
                    alert(`No results found for '${videoSelection}'.`);
                }
            }
            else {
                alert('No Playlist Item selected.');
            }    
        }
        
    }

    function handleVolumeIconChange() {
        if (volume >= 0.75) {
            return volumeHigh;
        }
        else if (volume >= 0.25 && volume < 0.75) {
            return volumeMid;
        }
        else if (volume > 0 && volume < 0.25) {
            return volumeLow;
        }
        else {
            return volumeOff;
        }
    }

    function handleToggleMute() {
        if (isMuted === false) {
            setMute(true);
            setPrevVolume(volume);
            setVolume(0);
            setMuteButtonTitle("Unmute");
        }
        else if (isMuted === true) {
            setMute(false);
            setVolume(prevVolume);
            setPrevVolume(0);
            setMuteButtonTitle("Mute");
        }
    }

    // Button Functions Below

    const [isPlaylistReady, setPlaylistReady] = useState(false); // Enables use of the Start and Reset playlist buttons, as well as the Priority Setter
    const [isPlaylistActive, setPlaylistActive] = useState(false); // Enables use of the Play/Pause, Next and Previous Video buttons
    const [isVideoPlaying, setVideoPlaying] = useState(false); // Enables the visual effects of the play/pause buttons
    const [shuffleList, setShuffleList] = useState(); // The initial list to be shuffled through
    const [currentVideo, setCurrentVideo] = useState(); // The current video url
    const [currentVideoIndex, setCurrentVideoIndex] = useState(); // The index of the current video url
    const [prevVideo, setPrevVideo] = useState(); // The index of the previous video url
    const [isPrevVideoActive, setPrevVideoActive] = useState(false); // If true, hitting the next video button wont pick from the shuffle list. Also prevents going father back then 1 video.

    useEffect(() => { // The function for setting isPlaylistReady to true
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


    useEffect(() => { // Only triggers when the current video changes, for removing the current video from the shuffle list
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
            if (isAutoplaying === false) {
                setVideoPlaying(false);
            }

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
            if (isAutoplaying === false) {
                setVideoPlaying(false);
            }
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

    // Priority Setter Functions Below

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
    }

    function handlePriorityReset() {
        if (isPlaylistReady) {
            setShuffleList(createShuffle(props.playlistData));
            console.log('Priority reset.');
        }
    }

    // Keyboard Event Function Below

    function handleKeybindPress(event) {
        event.preventDefault();
        if (event.key === ' ' && event.shiftKey === true) {
            handlePauseAndPlay();
        }
        if (event.key === 'ArrowRight' && event.shiftKey === true) {
            handleNextVideo();
        }
        if (event.key === 'ArrowLeft' && event.shiftKey === true) {
            handlePrevVideo();
        }
        if (event.keyCode === 77 && event.shiftKey === true) {
            handleToggleMute();
        }
    }
    useEffect(() => {
        window.addEventListener("keyup", handleKeybindPress);
        return () => window.removeEventListener("keyup", handleKeybindPress);
    }, [handleKeybindPress]);

    // Styling states below

    const [setVideoStyle, setSetVideoStyle] = useState('set-video-button');
    const [startButtonStyle, setStartButtonStyle] = useState('start-button');
    const [resetButtonStyle, setResetButtonStyle] = useState('reset-button');
    const [pauseButtonStyle, setPauseButtonStyle] = useState('pause-button');
    const [nextButtonStyle, setNextButtonStyle] = useState('next-button');
    const [prevButtonStyle, setPrevButtonStyle] = useState('prev-button');
    const [setPriorityStyle, setSetPriorityStyle] = useState('set-priority-button');
    const [resetPriorityStyle, setResetPriorityStyle] = useState('reset-priority-button');

    useEffect(() => { // Checks the states of isPlaylistReady and isPlaylistActive every render and updates styling accordingly
        if (isPlaylistReady === true) {
            setStartButtonStyle('start-button is-clickable-no-italic');
            setResetButtonStyle('reset-button is-clickable-no-italic');
            setSetVideoStyle('set-video-button is-clickable');
        }
        else {
            setSetVideoStyle('set-video-button');
            setStartButtonStyle('start-button');
            setResetButtonStyle('reset-button');
            
        }
        if (isPlaylistReady === true && isPlaylistActive === true) {
            setPauseButtonStyle('pause-button is-clickable');
            setNextButtonStyle('next-button is-clickable');
            setPrevButtonStyle('prev-button is-clickable');
            setSetPriorityStyle('set-priority-button is-clickable');
            setResetPriorityStyle('reset-priority-button is-clickable');
            setStartButtonStyle('reset-button');
        }
        else {
            setPauseButtonStyle('pause-button');
            setNextButtonStyle('next-button');
            setPrevButtonStyle('prev-button');
            setSetPriorityStyle('set-priority-button');
            setResetPriorityStyle('reset-priority-button');
        }

    })

    return (
        <div className='control-panel'>
            <div className='video-player'>
                <ReactPlayer
                    url={currentVideo}
                    width='720px'
                    height='405px'
                    volume={volume}
                    pip={true}
                    controls={true}
                    playing={isVideoPlaying}
                    onEnded={() => handleNextVideo()}
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                />
            </div>
            <div className='video-controls-container'>
                <div className='set-video-container'>
                    <input className='set-video-bar' name='set-video-bar' placeholder='Insert Playlist Item Name...' onChange={(event) => setVideoSelection(event.target.value)}/>
                    <button className={setVideoStyle} onClick={changeVideo}>Set Video</button>
                    <div className='autoplay-button-container'>
                        <div className='autoplay-text-container'>Autoplay</div>
                        <div className='autoplay-checkbox-container'>
                            <input type='checkbox' checked={isAutoplaying} className='autoplay-checkbox' onChange={(e) => {setAutoplaying(e.target.checked)}}/>
                        </div>
                    </div>
                </div>
                <div className='set-volume-container'>
                    <div className='volume-icon-container'><img src={handleVolumeIconChange()} className='volume-icon' alt='Volume Icon' onClick={handleToggleMute} title={`Click to ${muteButtonTitle}`}/></div>
                    <div className='volume-slider-container'>
                        <input type="range"
                            min={0} max={1} step={0.01}
                            className='volume-slider'
                            onChange={(event) => isMuted === false ? setVolume(event.target.value) : setPrevVolume(event.target.value)}
                        />
                    </div>
                    <div className='volume-amount-container'>Volume: {Math.round(volume * 100)}%</div>
                </div>
                <div className='start-button-container'>
                    <button className={startButtonStyle} title='Start Playlist' onClick={handleStartPlaylist}><div>Start</div></button>
                </div>
                <div className='reset-button-container'>
                    <button className={resetButtonStyle} title='Reset Playlist' onClick={handleResetPlaylist}><div>Reset</div></button>
                </div>
                <div className='pause-button-container'>
                    <button className={pauseButtonStyle} title={isVideoPlaying ? 'Pause Video' : 'Play Video'} onClick={handlePauseAndPlay}><img src={isVideoPlaying ? pauseButton : playButton} alt={isVideoPlaying ? 'Pause Button' : 'Play Button'}/></button>
                </div>
                <div className='next-button-container'>
                    <button className={nextButtonStyle} title='Next Video' onClick={handleNextVideo}><img src={nextButton} alt='Next Video Button'/></button>
                </div>
                <div className='prev-button-container'>
                    <button className={prevButtonStyle} title='Previous Video' onClick={handlePrevVideo}><img src={prevButton} alt='Previous Video Button'/></button>
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
                    <button className={setPriorityStyle} onClick={handlePrioritySet}>Set Priority</button>
                </div>
                <div className='reset-priority-button-container'>
                    <button className={resetPriorityStyle} onClick={handlePriorityReset}>Reset Priority</button>
                </div>
            </div>
        </div>
    )
});

export default ControlPanel;