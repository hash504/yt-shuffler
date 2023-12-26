import './AboutSection.css';
import React, { useState } from 'react';
import graphic from './website-info-graphic.png';

const AboutSection = () => {

    const [aboutSection, setAboutSection] = useState();
    const [isAboutSectionVisible, toggleAboutSectionVisibility] = useState(false);
    const [aboutSectionButtonStyle, setAboutSectionButtonStyle] = useState('about-section-button');

    function handleToggleAboutSection() {
        if (isAboutSectionVisible === false) {
            toggleAboutSectionVisibility(true);
            setAboutSectionButtonStyle('about-section-button about-section-visible');
            setAboutSection(
                <div className='about-section-info'>
                    <h1>About This Website</h1>
                    <h2>
                        This website was created because i got tired of dealing with YouTube's scuffed shuffle system.<br/>
                        It was made mainly for shuffling through music playlists, so it's not ideal for viewing YouTube videos.
                    </h2>
                    <h1>Keybinds</h1>
                    <h2>
                        Space: Pause/Play Video<br/>
                        Shift + M: Mute Video<br/>
                        Shift + Left Arrow: Next Video<br/>
                        Shift + Right Arrow: Previous Video
                        
                    </h2>
                    <h1>How To Use</h1>
                    <img className='info-graphic' alt='Website information graphic' src={graphic}/>
                    <div className='info-sections'>
                        <div className='sec1'>
                            <h1>1. Playlist URL Bar</h1>
                            <h2>
                                This is where you Copy & Paste the YouTube playlist's URL.<br/>
                                If the playlist isn't private and you copy-pasted the exact URL, the playlist items should show up in the Playlist section.
                            </h2>
                        </div>
                        <div className='sec2'>
                            <h1>2. Playlist Search</h1>
                            <h2>
                                This is where you can search for specific playlist items in order to find their Playlist Item ID.<br/>
                                You can also choose to search by either the title of the video or by the name of the channel the video is from by clicking the button on the right.
                            </h2>
                        </div>
                        <div className='sec3'>
                            <h1>3. Playlist Item List</h1>
                            <h2>
                                This is where each playlist item is shown.<br/>
                                It includes the title, channel name, a Playlist Item ID, and a link to the video on YouTube.<br/>
                                If the title of a video isn't fully visible, you can hover over it and it will be shown.
                            </h2>
                        </div>
                        <div className='sec4'>
                            <h1>4. Video Player</h1>
                            <h2>
                                This is where the video will play after the playlist starts.<br/>
                                You cannot start/reset the playlist or go to the next/previous video with the player, you must use the video controls.
                            </h2>
                        </div>
                        <div className='sec5'>
                            <h1>5. Set Video & Set Volume</h1>
                            <h2>
                                Here is where you can set the video manuually as well as the volume.<br/>
                                Insert a Playlist Item ID into the Insert Playlist ID bar, and pressing the Set Video button will change the video.<br/>
                                You can use the Set Video bar to set the video independent of the shuffle.<br/><br/>
                                The Volume Slider is how you control the volume of the video. Slide it to the left to decrease the volume, or to the right to increase it.<br/>
                                While you can change the volume in the video player, it will <i>not</i> update the Set Volume bar.
                            </h2>
                        </div>
                        <div className='sec6'>
                            <h1>6. Video Controls</h1>
                            <h2>
                                This is where you control the playlist and the video.<br/>
                                From left to right, the buttons are for starting the playlist, resetting the playlist, pausing/playing the video, going to the next video, and going to the previous video.<br/>
                                Starting the playlist will create a completely randomized shuffle list, and resetting the playlist will stop the video and delete the shuffle list.<br/>
                                Clicking the Pause/Play button will pause/play the video, or you can pause/play the video from the video player.<br/>
                                Clicking the Next Video button will change the video to the next video in the shuffle list, and pressing the previous video button while change it to the previous video.<br/>
                                You can only go backwards by one video when pressing the Previous Video button.
                            </h2>
                        </div>
                        <div className='sec7'>
                            <h1>7. Priority Setter</h1>
                            <h2>
                                Unique to this website is the Priority Setter, which allows you to adjust the likelihood of randomly encountering a certain video in a playlist.<br/>
                                Insert a Playlist Item ID into the Playlist Item ID bar, insert a positive number into the Priority Value bar, then click the Set Priority button to adjust the priority of one video.<br/>
                                Clicking the Reset Priority button will reset the priorty for every video and create a new shuffle list.<br/>
                                The likelihood of a playlist item appearing is based on the priority value and the size of the playlist.<br/>
                                Higher priority values will increase the likelihood of a playlist item appearing, but the larger a playlist is, the less likely a certain video will be selected randomly.<br/><br/>
                                The Priority Setter can also re-add playlist items back into the shuffle list, or remove them if the priority value is set to 0.
                            </h2>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            toggleAboutSectionVisibility(false);
            setAboutSection();
            setAboutSectionButtonStyle('about-section-button');
        }
    }
    
    return (
        <div className='about-section'>
            <div className='about-section-button-container'><div className={aboutSectionButtonStyle} onClick={handleToggleAboutSection}>{isAboutSectionVisible ? 'Hide' : 'About'}</div></div>
            {aboutSection}
        </div>
    )
}

export default AboutSection;