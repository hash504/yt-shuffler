import React from 'react';
import './VideoPlayer.css';
import ReactPlayer from 'react-player'

const VideoPlayer = (props) => {

    return (
        <div className='video-player'>
            <ReactPlayer
                url={props.videoUrl}
                width='720px'
                height='405px'
                volume={props.volume}
                pip={true}
                controls={false}
                playing={props.isPlaying}
                onEnded={props.handleNextVideo}
                onPlay={props.handlePlay}
                onPause={props.handlePause}
            />
        </div>
    )
}

export default VideoPlayer;