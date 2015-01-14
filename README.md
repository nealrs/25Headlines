![](https://raw.githubusercontent.com/nealrs/25Headlines/gh-pages/img/25Headlines.png)

## Inspiration

After reading [Adam Mordecai](http://www.slideshare.net/Upworthy/upworthy-10-ways-to-win-the-internets)'s advice about writing 25 headlines for every piece of content you publish, I thought to myself &mdash; wouldn't it be great if there were a little microsite just for that - but with support for tweets & email subject lines too? So I built one. 

## How it works

Depending on what type of content you're working on, the app will set character count triggers that color code your headlines. Yellow means you've passed the optimal length. Orange means you're headline is too long. And red means you've reached the maximum character limit. 

Your data is autosaved using localStorage, so you don't have to worry about losing any of your great prose and you can share your headlines/tweets/subject lines with a public URL.

## Challenges I ran into

I could probably have written this without jQuery, but it would have taken me so. much. longer.  That said, I ran into a lot of issues figuring out how to access the inner text of my DOM elements. I think I used all of the following at some point: `.text`, `.val()`, `.value`, `innerText`, `$(this)`, etc. As you can see on GitHub, this is some of the dirtiest code I've written in a while, but it does work.

## Accomplishments that I'm proud of

I had an idea, and I implemented it &mdash; that's always huge for me. Also, I've gotten a lot of great feedback from fellow bloggers, copywriters, and marketers validating the idea / utility. 

## What I learned

I had to create a sentence casing class, and using some code from SO, I learned how to extend the String prototype. All new stuff to me. (removed as of 1/13/2015)

## What's next for 25Headlines

I've got a few ideas below, but I'd love to hear from _you_. 

I'd like to add a progress meter/ gamification to provide some encouragement to writers &mdash; you don't want people to quit at #15.  Also, I've been thinking about a voting system (PH / HNstyle) so you can get feedback form your colleagues before you pick something. Also, maybe a way to connect this to Hootsuite or Optimizely. Oh and I might also push this through MacGap to create a desktop app, who knows?
