const instrument = document.getElementById("instrument");
const synth = new Tone.Synth();
// Set the tone to sine
synth.oscillator.type = "sine";
// connect it to the master output (your speakers)
synth.toMaster();

const createButton = (pitchOctave) => {
    let button = document.createElement("button");
    instrument.appendChild(button);
    button.innerText = pitchOctave;

    button.addEventListener("click", () => {
        synth.triggerAttackRelease(pitchOctave, "8n");
    });
};

createButton("C3");
createButton("D3");
createButton("E3");
createButton("F3");
createButton("G3");
createButton("A4");
createButton("B4");

createButton("C4");
createButton("D4");
createButton("E4");
createButton("F4");
createButton("G4");
createButton("A5");
createButton("B5");


{
    let button = document.createElement("button");
    instrument.appendChild(button);
    button.innerText = "Play";

    button.addEventListener("click", () => {
        let now = Tone.now();

        synth.triggerAttackRelease("A4", "8n", now + 0.0);
        synth.triggerAttackRelease("B4", "8n", now + 1.0);
        synth.triggerAttackRelease("C5", "8n", now + 2.0);

        synth.triggerAttackRelease("B4", "8n", now + 3.0);
        synth.triggerAttackRelease("C5", "8n", now + 4.0);
        synth.triggerAttackRelease("E5", "8n", now + 5.0);
        synth.triggerAttackRelease("B4", "8n", now + 6.0);

        synth.triggerAttackRelease("E4", "8n", now + 7.0);
        synth.triggerAttackRelease("A4", "8n", now + 8.0);
        
        synth.triggerAttackRelease("G4", "8n", now + 9.0);
        synth.triggerAttackRelease("A4", "8n", now + 10.0);
        synth.triggerAttackRelease("C5", "8n", now + 11.0);
        synth.triggerAttackRelease("G4", "8n", now + 12.0);

        synth.triggerAttackRelease("F4", "8n", now + 13.0);
        synth.triggerAttackRelease("E4", "8n", now + 14.0);
        synth.triggerAttackRelease("F4", "8n", now + 15.0);

        synth.triggerAttackRelease("E4", "8n", now + 16.0);
        synth.triggerAttackRelease("F4", "8n", now + 17.0);
        synth.triggerAttackRelease("C5", "8n", now + 18.0);
        synth.triggerAttackRelease("E4", "8n", now + 19.0);

        {
            let n = now + 20.0;
            synth.triggerAttackRelease("E4", "8n", n + 0.0);
            synth.triggerAttackRelease("E4", "8n", n + 1.0);
            synth.triggerAttackRelease("E4", "8n", n + 2.0);
            synth.triggerAttackRelease("D4", "3n", n + 3.0);
        }

        {
            let n = now + 24.0;
            synth.triggerAttackRelease("F4", "8n", n + 1.0);
            synth.triggerAttackRelease("F4", "8n", n + 2.0);
            synth.triggerAttackRelease("B4", "8n", n + 3.0);
            synth.triggerAttackRelease("B4", "8n", n + 4.0);
        }
    });
}
