# Goosic

#### An on-premises web music player.

##### As simple as it should be.

We don't know much about you, but we know you have an always-on PC at home with lot of music on it,
and you'd like to listen to it while you're away from home.

We also know you tried all the already available solutions, but you found them either too complicated
or not really matching your use case. You just want a simple web player, why should you deal with a
complex setup?

How do we know all of this? Well, we've gone through all of this. And that's why we began writing Goosic.

## How it works

Goosic is a Golang application that scans all the songs in a specific directory. It then watches for
changes in the directory and constantly scans all the newly added files. It exposes a simple REST API
to interact with it.

GreyGoosic, the official frontend, interacts with those API to expose a clean web interface to listen
to your songs. The idea is to make it as similar as possible to the ones you're already used to, like
Spotify or Google Music. For now, it's just a list of song and a working basic player (see the
_Status_ section below).

## Status

The project is really young and is under heavy development. It is working and you can use it, but it
lacks many features:

- The backend scans the entire folder on each restart, there is no persistence
- The frontend just exposes a list of songs. There is a basic player implementation with a queue, so
  you can listen to the songs with simple random/repeat features, but that's pretty much just this.
  There's still no artist/album view, navigation between them or whatsoever.

We're working on the project on a ~~daily~~ nightly basis, so you can expect many more features in
the near future, the first ones being the ones mentioned hereabove.

## How to run

There are no built binaries at the moment, so you'll need Golang installed to run the project.

First of all, start the Goosic backend from the root of the project:

```sh
cd backend
MUSIC_PATH=/path/to/your/music/folder go run ./cmd/goosic
```

Goosic will start and scan the provided directory.

You can now start the GreyGoosic frontend in another terminal, from the root of the project:

```sh
cd greygoosic
npm install
npm start
```

The frontend should now open in a browser.

It's planned to release single-file binaries with the frontend embedded in them, in a near future.

## Issues?

As an early-stage project, you can expect a lot of issues to occurr. Anyway, we're already using
Goosic to listen to our own music, so what already exists should overally work. If you feel like
something that should be working isn't, feel free to open an issue.

## License

### Icons
The repeat icons are based on the FontAwesome 5 "retweet" icon, licensed under Creative Commons 4, with little modifications. You can find original license in detail <a href="https://fontawesome.com/license" target="_blank">here</a>.
