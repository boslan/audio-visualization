(function () {
    const FFT_SIZE = 512;
    let hostSize = 400;
    let rowSize = 32;
    let columnSize = 32;
    let squadSize = hostSize / columnSize;

    // Init audio
    const myAudio = document.querySelector('audio');
    const audioCtx = new window.AudioContext();
    const source = audioCtx.createMediaElementSource(myAudio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const BUFFER_RATION = bufferLength / (columnSize * rowSize);

    analyser.connect(audioCtx.destination);
    source.connect(analyser);

    const canvas = document.getElementById('oscilloscope');
    const canvasCtx = canvas.getContext('2d');

    const rowsInput = document.querySelector('#rows');
    const columnsInput = document.querySelector('#columns');

    rowsInput.value = rowSize;
    columnsInput.value = columnSize;

    rowsInput.addEventListener('change', (e) => changeRows(e));
    columnsInput.addEventListener('change', (e) => changeColumns(e));

    /**
     * render func
     */
    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        for (let row = 0; row < columnSize; row++) {
            for (let column = 0; column < rowSize; column++) {
                const indexFreq = Math.floor((row * column) * BUFFER_RATION);
                const freq = dataArray[indexFreq];
                drawFreqRect(row, column, freq);
            }
        }
    }

    /**
     * render part of visualization
     * @param row
     * @param column
     * @param freq
     */
    function drawFreqRect(row, column, freq) {
        const squadPosX = column * squadSize;
        const squadPosY = row * squadSize;
        canvasCtx.fillStyle = getColorFreq(freq);
        canvasCtx.fillRect(squadPosX, squadPosY, squadSize, squadSize);
    }

    /**
     * get color by freq
     * @param freq
     * @returns {string}
     */
    function getColorFreq(freq) {
        const value = normalize(freq, 255, 360);
        return `hsl(${Math.floor(value)}, 100%, 50%)`;
    }

    /**
     * Normalization value to range
     * @param value
     * @param max
     * @param range
     * @returns {number}
     */
    function normalize(value, max, range) {
        return (value * range) / max;
    }

    draw();

    function changeRows({target}) {
        const {value} = target;
        if (value) {
            rowSize = +value;
            squadSize = getSquadSize(rowSize, columnSize, hostSize);
            canvasCtx.clearRect(0, 0, hostSize, hostSize);
        }
    }

    function changeColumns({target}) {
        const {value} = target;
        if (value) {
            columnSize = +value;
            squadSize = getSquadSize(rowSize, columnSize, hostSize);
            canvasCtx.clearRect(0, 0, hostSize, hostSize);
        }
    }

    function getSquadSize(r, c, h) {
        const rs = h / r;
        const cs = h /c;
        return rs > cs ? rs : cs;
    }

}());
