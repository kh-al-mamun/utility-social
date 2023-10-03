const timeAgo = (givenTime) => {
    const now = Date.now();
    const timeDifference = now - givenTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate months
    const years = Math.floor(months / 12); // Approximate years

    if (seconds < 60) {
        return `moments ago`;
    } else if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else if (days < 30) {
        return `${days}d ago`;
    } else if (months < 12) {
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}

export default timeAgo;
