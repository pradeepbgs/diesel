// function fetchUserData(userId) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const users = {
//           1: { name: "Pradeep", age: 23 },
//           2: { name: "John", age: 30 },
//         };
  
//         const user = users[userId];
  
//         if (user) {
//           resolve(user);
//         } else {
//           reject("User not found!");
//         }
//       }, 1000);
//     });
//   }
  
//   fetchUserData(1)
//     .then((user) => {
//       console.log("User Data:", user);
//       return `Hello, ${user.name}!`;
//     })
//     .then((greeting) => {
//       console.log(greeting);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
  


const fetchData = async () => {
  console.log("running await \n")
    const response = await fetch('https://api.github.com/users/pradeepbgs');
    const data = await response.json();
    console.log("this line will only print after  the data is fetched")
    console.log('then this will print: ', data?.avatar_url)
}

const fetchDataWithThen= () =>{
  console.log("running .then \n")
  fetch('https://api.github.com/users/pradeepbgs')
  .then(response => response.json())
  .then(data => {
    console.log('2nd this data will be printed after',data?.avatar_url);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
  console.log("1st this line will print first then data")
}

// fetchData()
fetchDataWithThen()