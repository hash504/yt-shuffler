import React, { useState, useEffect } from 'react';

const GetPlaylist = (props) => {

    const [playlistDisplay, setPlaylistDisplay] = useState();

    useEffect(() => {

        let apiResults = []; // Will be set to an array containing each page of results

        function getUrl(pagetoken) {
            let pt = (typeof pagetoken === "undefined") ? "" :`&pageToken=${pagetoken}`,
            api_key = 'API_KEY',
            playlistID = props.playlistUrl,
            url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistID}&key=${api_key}${pt}`;
            return url;
        }

        setPlaylistDisplay(undefined);
        
        function apiCall(nopagetoken) { // Standard API call, used in tandem with responseHandler.
            fetch(getUrl(nopagetoken))
            .then(response => {
                return response.json();
            })
            .then(response => {
                if(response.error) {
                    console.log(response.error);
                    console.log(`${response.error.code}: ${response.error.message}`);
                    alert('Failed to fetch playlist.');
                }
                else {
                    apiResults.push(response);
                    responseHandler(response);
                }
            });
            
        }
        function responseHandler(response) {
            if(response.nextPageToken) {
                apiCall(response.nextPageToken);
            }
            else {
                console.log("Request successfully fulfilled.");
                setResults(apiResults); 
            }
        }
        apiCall();

        let listResults = []; 

        function setResults(results) { // Converts the array with page results into one array with all the necessary data.
            
            for (let i = 0; i < results.length; i++) {
                for (let j = 0; j < results[i].items.length; j++) {
                    listResults.push({
                        url: `https://www.youtube.com/watch?v=${results[i].items[j].snippet.resourceId.videoId}&list=${props.playlistUrl}`,
                        title: results[i].items[j].snippet.title,
                        channel: results[i].items[j].snippet.videoOwnerChannelTitle
                    })
                }
            }

            if (results) { // Turns the data from the listResults array into a JSX expression to be returned and displayed.
                let pDisplay = [];
                for (let i = 0; i < listResults.length; i++) {
                    let content = (
                        <>
                        {React.createElement('div', {style: {fontSize: i >= 999 ? "48px" : "60px"}, className: 'list-number-container', title: `Playlist item ${i + 1}`}, i + 1)}
                        <div className='title-container' title={listResults[i].title}>{listResults[i].title}</div>
                        <div className='channel-container' title={listResults[i].channel}>{listResults[i].channel}</div>
                        <a href={listResults[i].url} target="_blank" rel="noreferrer" className='link-container' title='View on YouTube'>View</a>
                        </>
                    )
            
                    if (i === 1) {
                        pDisplay.push( 
                            <div className='list-item-container' key={i} id='top-item'>{content}</div>
                        )
                    }
                    else if (i === listResults.length) {
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
            
        }

    }, [props.playlistUrl]);

    return playlistDisplay;

};

export default GetPlaylist;
