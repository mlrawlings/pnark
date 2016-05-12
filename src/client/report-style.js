module.exports = `
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,500' rel='stylesheet' type='text/css'>
    <style>
        body {
            font-family:Roboto, Helvetica, Arial, sans-serif;
            background:#fff;
            padding:0;
            margin:0;
        }

        h1, h2, h3, h4, h5, h6 {
            margin:0;
            font-weight:500;
            margin-bottom:10px;
            font-size:1.5em;
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
            transform:translateY(0.5em);
            transition:all 0.15s;
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
`