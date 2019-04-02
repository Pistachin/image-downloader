const fetch = require('node-fetch')
const alert = require('alert-node')
const logUpdate = require('log-update')
const { join } = require('path')
const { createWriteStream, mkdirSync, accessSync} = require('fs')
const DIR = join(__dirname, 'sitter/making-of')
const BASE_URL = 'http://helenagonzalezdop.com/sitter/img'
const firstPhoto = 1
const lastPhoto = 221

const createFolder = dir => {
  try {
    accessSync(dir) // if dir doesn't exist will fail
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      mkdirSync(dir, {recursive: true})
    }
  }
}

const getPhotoName = photoNum => `${photoNum}_g.jpg`

const downloadFile = async (url, absolutePath) => {
  const res = await fetch(url).catch(e => { throw e })
  const dest = createWriteStream(absolutePath)

  return new Promise((resolve, reject) => {
    res.body
      .pipe(dest)
      .on('error', err => reject(err))
      .on('finish', () => resolve())
  })
}

const tenCalculator = (val) => {
	let valSplitter = val / 25
	let valFloor = Math.floor(valSplitter)
	let valCeil = Math.ceil(valSplitter)
	if (valFloor === valCeil) return val
}

const downloader = async () => {
  try {
    createFolder(DIR)
  } catch (error) {
    console.error(error)
  }

  for (let i = firstPhoto; i <= lastPhoto; i++) {
    const photoName = getPhotoName(i)
    const status = tenCalculator(i)
    // To let know user what's going on
    if (i === 1) {
        alert(`Starting download`)
        console.log('Starting download');
    }
    logUpdate(`Downloaded ${i} of ${lastPhoto} photos`)
    if (status) {
        alert(`Downloaded ${i} of ${lastPhoto} photos`)
    }

    await downloadFile(`${BASE_URL}/${photoName}`, join(DIR, photoName))
      .catch(console.error)
  }
  console.log('Download complete');
  alert('Download complete');
}

downloader()
