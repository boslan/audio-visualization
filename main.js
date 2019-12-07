(function () {
    const FFT_SIZE = 512;
    const COLUMN_SIZE = 10;
    const ROW_SIZE = 10;

    let myAudio = document.querySelector('audio');
    let audioCtx = new window.AudioContext();
    let source = audioCtx.createMediaElementSource(myAudio);
    let analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    const BUFFER_RATION = bufferLength / (COLUMN_SIZE * ROW_SIZE);

    analyser.connect(audioCtx.destination);
    source.connect(analyser);

    let canvas = document.getElementById('oscilloscope');
    let canvasCtx = canvas.getContext('2d');
    const BAR_SIZE = 400 / COLUMN_SIZE;

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < COLUMN_SIZE; i++) {
            for (let j = 0; j < ROW_SIZE; j++) {
                const index = Math.floor(i * j * BUFFER_RATION);
                const freq = dataArray[index];
                drawFreqRect(i, j, freq);
            }
        }
    }

    function drawFreqRect(row, column, freq) {
        const barPositionX = column * BAR_SIZE;
        const barPositionY = row * BAR_SIZE;
        canvasCtx.fillStyle = getColorFreq(freq);
        canvasCtx.fillRect(barPositionX, barPositionY, BAR_SIZE, BAR_SIZE);
    }

    function getColorFreq(freq) {
        const value = normalize(freq, 255, 1);
        let color = hsv2rgb(value, 1, 1);
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    function hsv2rgb(h, s, v) {
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    function normalize(value, max, min) {
        return (value * min) / max;
    }

    draw();

}());
