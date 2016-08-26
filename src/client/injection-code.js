module.exports = (report, req) => `
    <style>
        #pnark-report {
            position:fixed;
            top:0; left:0; right:0; bottom:0;
            transition:all 0.4s;
            transform-origin:100% 100%;
            z-index:2147483640;
        }

        #pnark-report.pnark-hidden {
            opacity:0;
            pointer-events:none;
            transform:scale(0.1);
        }

        #pnark-report iframe {
            width:100%;
            height:100%;
            border:0;
        }

        #pnark-report-toggle {
            position:fixed;
            bottom:0; right:0;
            padding:15px 40px;
            color:#fff;
            z-index:2147483641;
            cursor:pointer;
        }

        #pnark-report-toggle:active {
            opacity:0.8;
        }

        #pnark-lower-triangle {
            position:absolute;
            bottom:-30px; right:-30px;
            height:60px; width:60px;
            background:#00ccac;
            transform:rotate(45deg);
        }

        #pnark-inspect-icon {
            width:30px;
            height:30px;
            position:absolute;
            bottom:5px; right:5px;
            transform:scale(0.9);
            transition:all 0.2s;
        }

        #pnark-report-toggle:hover #pnark-inspect-icon {
            transform:scale(1.0);
        }

        #pnark-report-toggle.open #pnark-inspect-icon {
            opacity:0;
            transform:scale(0);
        }

        #pnark-arrow-icon {
            width:18px;
            height:18px;
            position:absolute;
            bottom:3px; right:3px;
            transform:scale(0.9);
            transition:all 0.2s;
        }

        #pnark-report-toggle:hover #pnark-arrow-icon {
            transform:scale(1.0);
        }

        #pnark-report-toggle:not(.open) #pnark-arrow-icon {
            opacity:0;
            transform:scale(0);
        }
    </style>
    <div id="pnark-report" class="pnark-hidden"></div>
    <div id="pnark-report-toggle">
        <div id="pnark-lower-triangle"></div>
        <img id="pnark-inspect-icon" src="/pnark/img/inspect.png" />
        <img id="pnark-arrow-icon" src="/pnark/img/arrow.png" />
    </div>
    <script>
        window.addEventListener('load', function() {
            var iframe = document.createElement('iframe');
            var report = document.getElementById('pnark-report');
            var toggle = document.getElementById('pnark-report-toggle');
            var url = '${report.req.url}';
            var hasQuery = url.indexOf('?') != -1
            toggle.addEventListener('click', function() {
                if(report.className == 'pnark-hidden') {
                    report.className='';
                    toggle.className='open';
                } else {
                    report.className='pnark-hidden';
                    toggle.className='';
                }
            });
            iframe.src = url+(hasQuery ? '&' : '?')+'pnarkID=${report.id}';
            report.appendChild(iframe);
        });
    </script>
`