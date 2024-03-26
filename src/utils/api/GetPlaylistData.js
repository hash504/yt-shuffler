const GetPlaylistData = (playlistUrl) => { // A separate API handler that just returns the data in an array.

    if (playlistUrl) {

        let apiResults = []; // Will be set to an array containing each page of results

        function getUrl(pagetoken) {
            let pt = (typeof pagetoken === "undefined") ? "" :`&pageToken=${pagetoken}`,
            api_key = 'API_KEY',
            playlistID = playlistUrl,
            url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistID}&key=${api_key}${pt}`;
            return url;
        }
            
        function apiCall(nopagetoken) { // Standard API call, used in tandem with responseHandler.
            fetch(getUrl(nopagetoken))
            .then(response => {
                return response.json();
            })
            .then(response => {
                if(response.error) {
                    console.log(`${response.error.code}: ${response.error.message}`);
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
                
                console.log("Data Request successfully fulfilled.");
                setResults(apiResults); 
            }
        }
        apiCall();

        let listResults = []; 

        function setResults(results) {
            let id = 0;   
            for (let i = 0; i < results.length; i++) {
                for (let j = 0; j < results[i].items.length; j++) {
                    if (results[i].items[j].snippet.title !== "Deleted video") {
                        listResults.push({
                            id: id,
                            url: `https://www.youtube.com/watch?v=${results[i].items[j].snippet.resourceId.videoId}&list=${playlistUrl}`,
                            title: results[i].items[j].snippet.title,
                            channel: results[i].items[j].snippet.videoOwnerChannelTitle
                        })
                    }
                    id++;
                }
            }
        }
        return listResults;    
    }
    };

export default GetPlaylistData;