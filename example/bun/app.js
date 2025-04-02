const getData = new Promise(() =>{
    setTimeout(() => {
        console.log("db call executed");
    }, 1000);
})

getData.then(() => {
    console.log("Promise resolved");
}).catch(() => {
    console.log("Promise rejected");
})