function fontSizeAdjuster(title) { // Helper function for fitting in the title of videos into the playlist list
    if (title.length <= 40) {
        return {
            fontSize: "40px"
        }
    }
    else if (title.length > 40 && title.length <= 50) {
        return {
            fontSize: "32px",
            marginTop: "5px"
        }
    }
    else if (title.length > 50 && title.length <= 60) {
        return {
            fontSize: "26px",
            marginTop: "10px"
        }
    }
    else if (title.length > 60 && title.length <= 70) {
        return {
            fontSize: "22px",
            marginTop: "10px"
        }
    }
    else if (title.length > 70 && title.length <= 85) {
        return {
            fontSize: "18px",
            marginTop: "12px"
        }
    }
    else if (title.length > 85) {
        return {
            fontSize: "16px",
            marginTop: "15px"
        }
    }
}

export default fontSizeAdjuster;