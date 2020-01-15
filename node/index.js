#!/usr/bin/env node

const fs = require('fs');
const util = require('util');

// Best Method - Promise.all
const { lstat } = fs.promises;

fs.readdir(process.cwd(), async (err, filenames) => {
  if (err) {
    console.log(err);
  }

  const statPromises = filenames.map(filename => {
    return lstat(filename);
  });

  const allStats = await Promise.all(statPromises);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);

    console.log(filenames[index], stats.isFile());
  }
});

// Method #1
// const lstat = filename => {
//   return new Promise((resolve, reject) => {
//     fs.lstat(filename, (err, stats) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(stats);
//     });
//   });
// };

// Method #2
// const lstat = util.promisify(fs.lstat);

// Method #3
// const { lstat } = fs.promises;

// fs.readdir(process.cwd(), async (err, filenames) => {
//   if (err) {
//     console.log(err);
//   }

//   for (let filename of filenames) {
//     try {
//       const stats = await lstat(filename);
//       console.log(filename, stats.isFile());
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });
