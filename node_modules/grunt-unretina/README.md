# unretina

> Scales @2x images down to standard resolution

## Getting Started
This plugin requires Grunt `~0.4.4` and GraphicsMagick.

### Grunt
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-unretina --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-unretina');
```

### GraphicsMagick
Make sure GraphicsMagick is installed on your system and properly set up in your `PATH`.

Ubuntu:

```shell
$ apt-get install graphicsmagick
```

Mac OS X (using [Homebrew](http://brew.sh/)):

```shell
$ brew install graphicsmagick
```

Windows & others: 

[ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/windows/](ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/windows/)

Confirm that GraaphicsMagick is properly set up by executing `gm convert -help` in a terminal.

## The "unretina" task

### Overview
In your project's Gruntfile, add a section named `unretina` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  unretina: {
    options: {
      overwrite: true
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.overwrite
Type: `Boolean`
Default value: `true`

Determines whether file that already exist under this destination will be overwritten.

#### options.sufixies
Type: `Array`
Default value: `["@2x", "-hd"]`

List of sufixies that are stripped out of the dest file when using multiple files with expand option on.

#### options.concurrency
Type: `Number`
Default value: Number of CPUs

Determines how many resize operations are executed in parallel.

#### options.quality
Type: `Number`
Default value: `1`

Determines the output quality of the resized image. Ranges from `0` (really bad) to `1` (almost lossless). Only applies to jpg images.

### Usage Examples

#### Default Options
In this example, the default options are used to resize an image to 100px width. So if the `test/fixtures/wikipedia.png` file has a width of 500px, the generated result would be a 100px wide `tmp/wikipedia.png`.

```js
grunt.initConfig({
  image_resize: {
    resize: {
      files: [
      	{ src: "**/*@2x.png", dest: "tmp/", expand: true, "cwd/test/fixtures/" }
      ]
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History

 * 2014-03-26   v0.1.0   Initial release.

---
