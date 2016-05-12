module.exports = `
    <style>
        body {
            font-family:-apple-system, BlinkMacSystemFont, 'SF UI Text', 'Helvetica Neue', 'Roboto', 'Arial Nova', 'Segoe UI', 'Arial', sans-serif;
            background:#fff;
            padding:0;
            margin:0;
            color:#333;
        }

        tt, code, kbd, samp {
            font-family:'SF UI Mono', 'Consolas', 'Inconsolata', 'Monaco', 'Roboto Mono', 'Droid Sans Mono', monospace;
            border-radius:4px;
            background-color: #f7f4ee;
            color: #111;
            padding: 0.1em 0.5em;
        }

        h1, h2, h3, h4, h5, h6 {
            margin:0;
            font-weight:500;
            margin-bottom:10px;
            font-size:1.5em;
            color:#111;
        }

        h1 {
            font-size:2em;
            font-weight:400;
        }
        h2 { font-size:1.6em; }
        h3 { font-size:1.45em; }
        h4 { font-size:1.3em; }
        h5 { font-size:1.15em; }
        h6 { font-size:1.05em; }

        h1 small,
        h2 small,
        h3 small,
        h4 small,
        h5 small,
        h5 small {
            color:#999;
            display:block;
            font-size:0.5em;
            opacity:0;
            transform:translateY(0.25em);
            transition:all 0.15s;
            line-height:0.5;
        }

        h1 small,
        h2:hover small,
        h3:hover small,
        h4:hover small,
        h5:hover small,
        h5:hover small {
            opacity:1;
            transform:translateY(0);
        }

        section {
            padding-top:1em;
        }

        section section {
            font-size:0.9em;
        }
    </style>
    <script>
        window.onresize = function() {
            var base = Math.min(window.outerWidth, window.outerHeight*1.25);
            document.documentElement.style.fontSize = Math.pow(base, 0.3)/6.75 + 'em';
            document.body.style.paddingLeft =
            document.body.style.paddingRight = Math.pow(window.outerWidth, 0.5)/3 + '%';
        };
        setTimeout(window.onresize);
    </script>
`