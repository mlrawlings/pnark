module.exports = (report, req) => `
    <style>
        #pnark-report {
            position:fixed;
            top:0; left:0; right:0; bottom:0;
            transition:all 0.4s;
            transform-origin:100% 100%;
            z-index:2147483641;
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

        #pnark-report-close-button {
            position:absolute;
            top:0; right:0;
            font-size:40px;
            line-height:40px;
            height:40px;
            width:40px;
            padding:0;
            cursor:pointer;
            z-index:2147483642;
        }

        #pnark-report-open-button {
            position:fixed;
            bottom:0; right:0;
            padding:15px 40px;
            background:rgba(0,0,0,0.9);
            color:#fff;
            z-index:2147483640;
            cursor:pointer;
        }

        #pnark-report-open-button:active,
        #pnark-report-close-button:active {
            opacity:0.8;
        }
    </style>
    <div id="pnark-report" class="pnark-hidden">
        <div id="pnark-report-close-button">&times;</div>
    </div>
    <div id="pnark-report-open-button">Loading Report...</div>
    <script>
        window.addEventListener('load', function() {
            var iframe = document.createElement('iframe');
            var report = document.getElementById('pnark-report');
            var close = document.getElementById('pnark-report-close-button');
            var open = document.getElementById('pnark-report-open-button');
            close.addEventListener('click', function() {
                report.className='pnark-hidden';
            });
            open.addEventListener('click', function() {
                report.className='';
            });
            iframe.src = '${report.req.url}&pnarkID=${report.id}';
            report.appendChild(iframe);
            iframe.onload = function() {
                report.className='';
                setTimeout(function() {
                    open.innerHTML = 'Show Report';
                }, 400);
            };
        });
    </script>
`