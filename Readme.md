# The Information Management System

> This tool is so simple that most people don't understand how to use it.

#### TL;DR

This is a personal database which stores all type of things. Text, Files, Links. Stored things can be searched. 

Things are just stored and indexed and found again by a search.

<div style="text-align:center"><img src="assets/screenshot.png" /></div>

### More About

First of all I hate directory structures for saving old files, small project snippets, nice website I found while surfing the web. It works fine for a while but after a while its all cluttered up and messy. 

So now the the idea is to just throw these things into this database and find them again via search. So you kinda "google" your archive and easily find stuff again. And that's it. It is that simple.

For **example** you need your rental contract again after a coupl years, no problem because you saved it in the database and now just have to search for `rental`. Easy. Or you need a coupl mathematical formulas now and then. Just searching for `circle diameter` and boom it pops up because you saced it previously.

### Features

* save files
* save text
* url detection
* search them all

Ideas to come:

* editing and deleting (obviously important)
* tagging - need to differenciate
* fuzzy searching
* suggestion on typing
* (multiple)remote database support
* shared databases
* API (maybe want to hook it to something?!)

**Example how it works**

We save the notes

`"This is an Apple."`
`"Apple.com is the website of a huge company."`

After saving those we can now "query" the database as following

_indexing: words_

```
search:   "apple"
result:   "This is an Apple."
          "Apple.com is the website of a huge company."

search:   "This company"
result:   "Apple.com is the website of a huge company."
```

If certain notes should be grouped it is whise to use hashtags (e.g #WeLoveTurtles or #work) fot tieing them together.

For now that it's here since we are in development. If you want you can read [here](https://zeppel.eu/b/how-ims-works/) about an older IMS version which was slightly different but had the sam fundamentals.



### Versioning 

We are using [SemVer](https://semver.org/#summary).

On the version number MAJOR.MINOR.PATCH those are the meanings:

1. MAJOR - incompatible API changes.
2. MINOR - added functionality in a backwards compatible manner.
3. PATCH - made backwards compatible bug fixes.
