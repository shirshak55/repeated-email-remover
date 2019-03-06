#!/usr/bin/env node
'use strict'

const meow = require('meow')
const fs = require('fs')
const path = require('path')

const cli = meow(
    `
    Usage
      $ repeated_lines_remover <input>
 
    Warning
      For file path containaing space please enclode with quote
      $ repeated_lines_remover "/Users/shirshak/Desktop/Folder with space/a.txt"

    Examples
      $ repeated_lines_remover "hello.txt"
      🌈 Removing 5 lines from hello.txt 🌈
`,
    {
        flags: {
            rainbow: {
                type: 'boolean',
                alias: 'r',
            },
        },
    },
)

if (cli.input.length == 0) {
    console.log('Please specify file')
    process.exit(0)
}

const filePath = cli.input[0]

function extractEmails(text) {
    if (!text) return null
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
}

function dupCounter(o) {
    var compressed = []

    const original = o.map(v => {
        const a = extractEmails(v)
        if (a && a.length) return a[0]
        return ''
    })
    var copy = original.slice(0)

    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
        var myCount = 0
        // loop over every element in the copy and see if it's the same
        for (var w = 0; w < copy.length; w++) {
            if (original[i] == copy[w]) {
                // increase amount of times duplicate is found
                myCount++
                // sets item to undefined
                delete copy[w]
            }
        }

        if (myCount > 0) {
            var a = new Object()
            a.value = o[i]
            a.count = myCount
            compressed.push(a)
        }
    }

    return compressed
}

let absFilePath = ''
try {
    fs.statSync(filePath).isFile()
    absFilePath = filePath
} catch (e) {}

if (!absFilePath) {
    try {
        const cwd = process.cwd()
        const pth = path.join(cwd, filePath)
        fs.statSync(pth).isFile()
        absFilePath = pth
    } catch (e) {}
}

if (!absFilePath) {
    console.error('File dont exist! Please check it again')
    process.exit(0)
}
let lines = fs
    .readFileSync(absFilePath)
    .toString()
    .split(/[\r\n]+/g)

const linesWithCounts = dupCounter(lines)
    .filter(v => v.count === 1)
    .map(v => v.value)

console.log('🌈  Removing Duplicates 🌈 ')
fs.writeFileSync(filePath, linesWithCounts.join('\n'))
