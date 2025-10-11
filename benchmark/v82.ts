const N = 100000;

function handleData(data) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  } else if (typeof data === 'number') {
    return data * 2;
  } else if (Array.isArray(data)) {
    return data.length;
  } else {
    return null;
  }
}

console.time('Dynamic');

for (let i = 0; i < N; i++) {
  handleData('hello');
  handleData(42);
  handleData([1, 2, 3]);
}

console.timeEnd('Dynamic');


function handleString(data) {
  return data.toUpperCase();
}

function handleNumber(data) {
  return data * 2;
}

function handleArray(data) {
  return data.length;
}

console.time('Specialized');

for (let i = 0; i < N; i++) {
  handleString('hello');
  handleNumber(42);
  handleArray([1, 2, 3]);
}

console.timeEnd('Specialized');
