(function () {
    const FFT_SIZE = 512;
    const COLUMN_SIZE = 32;
    const ROW_SIZE = 32;
    const SQUAD_SIZE = 400 / COLUMN_SIZE;

    // Init audio
    const myAudio = document.querySelector('audio');
    const audioCtx = new window.AudioContext();
    const source = audioCtx.createMediaElementSource(myAudio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const BUFFER_RATION = bufferLength / (COLUMN_SIZE * ROW_SIZE);

    analyser.connect(audioCtx.destination);
    source.connect(analyser);

    const canvas = document.getElementById('oscilloscope');
    const canvasCtx = canvas.getContext('2d');

    /**
     * render func
     */
    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        for (let row = 0; row < COLUMN_SIZE; row++) {
            for (let column = 0; column < ROW_SIZE; column++) {
                const indexFreq = Math.floor(row * column * BUFFER_RATION);
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
        const squadPosX = column * SQUAD_SIZE;
        const squadPosY = row * SQUAD_SIZE;
        canvasCtx.fillStyle = getColorFreq(freq);
        canvasCtx.fillRect(squadPosX, squadPosY, SQUAD_SIZE, SQUAD_SIZE);
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

}());
