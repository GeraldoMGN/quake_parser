import fs from 'fs';

export const saveJSON = (object, filename) => {
  fs.writeFile(`${filename}.json`, JSON.stringify(object, null, 2), (err) => {
    if (err) throw err;
    console.log(`${filename}.json saved.`);
  });
};

export const readJSON = (filename) => fs.readFileSync(filename, 'utf8');
