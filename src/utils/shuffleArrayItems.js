const shuffleArrayItems = (array) => {
    let shuffledArray = [];
    let randomNumbers = [];
    
    for(let i=0; shuffledArray.length <= array.length; i++){
        if(shuffledArray.length === array.length){break}

        const random = Math.floor(Math.random()*array.length);
        if(randomNumbers.indexOf(random) !== -1){
            continue;
        }
        else{
            shuffledArray.push(array[random]);
            randomNumbers.push(random);
        }
    }

    return shuffledArray;
}

export default shuffleArrayItems;