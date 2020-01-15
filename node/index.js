#!/usr/bin/env node

const fs = require('fs');

fs.readdir(process.cwd(), (err, filenames) => {
  if (err) {
    console.log(err);
  }

  console.log(filenames);
});
