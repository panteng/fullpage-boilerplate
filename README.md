# Fullpage-Boilerplate

A full-screen scrolling website boilerplate built using [fullPage.js](http://alvarotrigo.com/fullPage/) and [Velocity.js](http://julian.com/research/velocity/).

It comes with useful gulp tasks that automatically compile sass, bundle javascript modules, compress images, reload browsers and so on.
With the help of this boilerplate, you can build a wonderful full-screen scrolling website in a very short time.

![Screenshot](https://raw.githubusercontent.com/panteng/fullpage-boilerplate/master/screenshot.jpg)

## Live Preview

[Click Here](http://panteng.me/live-previews/fullpage-boilerplate)

## Dependencies

1. [Font Awesome](https://fortawesome.github.io/Font-Awesome/)     --> Icon font set.
2. [fullPage.js](http://alvarotrigo.com/fullPage/)      --> The full-screen scrolling engine.
3. [jQuery](https://jquery.com/)           --> Used for manipulating DOM, also as the dependency of fullPage.js.
4. [Normalize.css](https://necolas.github.io/normalize.css/)    --> Used for CSS resets.
5. [Velocity.js](http://julian.com/research/velocity/)      --> The animation engine.

## Directory Layout

    /bundles
        bundle.css
        bundle.js
        bundle.min.css
        bundle.min.js
    /config               
        vendors.js
    /fonts          
    /images         
    /javascripts
        /animations
            section-1.js
            section-2.js
            section-3.js
        /controls
            hide-hidden-items.js
        main.js
    /scss
    .gitignore
    gulpfile.js
    index.html
    package.json
        

## Getting Started

1. Install dependencies:

        npm install

2. Start gulp task:

        gulp dev   
       
        
## Getting Ready For Production

1. Minimize files using gulp task:

        gulp prod

2. Upload files to your server.

## Development Guide

Coming soon.

## License

MIT