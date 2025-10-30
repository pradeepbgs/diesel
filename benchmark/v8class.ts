const N = 1000;

//===

function getXMonomorphic(obj) {
  let sum = 0;

  for (let i = 0; i < N; i++) {
    sum += obj.x;
  }

  return sum;
}

console.time('Monomorphic');

for (let i = 0; i < N; i++) {
  getXMonomorphic({ x: i });
  getXMonomorphic({ x: i });
  getXMonomorphic({ x: i });
  getXMonomorphic({ x: i });
  getXMonomorphic({ x: i });
}

console.timeLog('Monomorphic');

//===

function getXPolymorphic(obj) {
  let sum = 0;

  for (let i = 0; i < N; i++) {
    sum += obj.x;
  }

  return sum;
}

console.time('Polymorphic');

for (let i = 0; i < N; i++) {
  getXPolymorphic({ x: i, y: 0 });
  getXPolymorphic({ y: 0, x: i });
  getXPolymorphic({ x: i, y: 0 });
  getXPolymorphic({ y: 0, x: i });
  getXPolymorphic({ x: i, y: 0 });
}

console.timeEnd('Polymorphic');

//===

function getXMegamorphic(obj) {
  let sum = 0;

  for (let i = 0; i < N; i++) {
    sum += obj.x;
  }

  return sum;
}

//===

console.time('Megamorphic');

for (let i = 0; i < N; i++) {
  getXMegamorphic({ x: i });
  getXMegamorphic({ prop1: 0, x: i });
  getXMegamorphic({ prop1: 0, prop2: 1, x: i });
  getXMegamorphic({ prop1: 0, prop2: 1, prop3: 2, x: i });
  getXMegamorphic({ prop1: 0, prop2: 1, prop3: 2, prop4: 3, x: i });
}

console.timeLog('Megamorphic');