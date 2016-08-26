module.exports = `
    <style>
        body {
            font-family:-apple-system, BlinkMacSystemFont, 'SF UI Text', 'Helvetica Neue', 'Roboto', 'Arial Nova', 'Segoe UI', 'Arial', sans-serif;
            background:#fff;
            padding:0;
            margin:0;
            color:#333;
            margin-top:50px;
            position:relative;
        }

        tt, code, kbd, samp {
            font-family:'SF UI Mono', 'Consolas', 'Inconsolata', 'Monaco', 'Roboto Mono', 'Droid Sans Mono', monospace;
            border-radius:3px;
            background-color: rgba(0,0,0,0.04);
            padding: 0.2em 0;
            font-size:85%;
        }

        tt:before, code:before, kbd:before, samp:before,
        tt:after, code:after, kbd:after, samp:after {
            letter-spacing: -0.2em;
            content: "\\00a0";
        }

        h1, h2, h3, h4, h5, h6 {
            margin:0;
            font-weight:500;
            margin-bottom:10px;
            font-size:1.5em;
            color:#222;
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

        section.report section {
            font-size:0.9em;
        }

        section.report {
            position:absolute;
            width:100%;
            top:0; left:-100%;
            opacity:0;
            pointer-events:none;
            z-index:-1;
        }

        section.report.selected {
            left:0;
            opacity:1;
            pointer-events:inherit;
            z-index:1;
        }

        .tabbar {
            position:fixed;
            top:0; left:0; right:0;
            width:100%; height:50px;
            background:#ccc;
            text-align:center;
            z-index:9999999;
        }

        .tab {
            cursor:pointer;
            height:26px;
            padding:12px 20px;
            background:#ddd;
            display:inline-block;
        }

        .tab.selected {
            background:#eee;
        }
    </style>
    <script>
        window.onresize = function() {
            var base = Math.min(window.outerWidth, window.outerHeight*1.25);
            document.documentElement.style.fontSize = Math.pow(base, 0.3)/6.75 + 'em';
            document.body.style.marginLeft =
            document.body.style.marginRight = Math.pow(window.outerWidth, 0.5)/3 + '%';
        };
        setTimeout(window.onresize);
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var tabbar = document.querySelector('.tabbar');
            var sections = document.querySelectorAll('body > section');
            var currentSection = sections[0];
            var currentTab;
            ;[].forEach.call(sections, function(section, index) {
                var header = section.querySelector('h1');
                var text = header.textContent;
                var id = 'tab-'+index;
                var tab = document.createElement('div');

                section.id = id;
                section.removeChild(header);

                tab.className = 'tab';
                tab.innerHTML = text;
                tab.addEventListener('click', function() {
                    currentSection.className = 'report';
                    section.className = 'report selected';
                    currentSection = section;
                    currentTab.className = 'tab';
                    tab.className = 'tab selected';
                    currentTab = tab;
                    window.scrollTo(0, 0);
                })

                if(section != currentSection) {
                    section.className = 'report';
                } else {
                    currentTab = tab;
                    currentTab.className = 'tab selected';
                    currentSection.className = 'report selected';
                }

                tabbar.appendChild(tab);
            });
        });
    </script>
`