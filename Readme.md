# The Information Management System

> This tool is so simple that most people don't understand how to use it.

#### Summary

IMS is a database which stores all type of things. It is like a notes app on steroids and without any structure. Docs, Text, ... are saved as a "note" and are indexed so they can be found by using a search.

### More About

So as the summary explains it is a database which doesn't have any structure. Things are just stored and indexed and found again by a search.

**Example**

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
