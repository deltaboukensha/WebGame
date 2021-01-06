const instrument = document.getElementById("instrument");
const synth = new Tone.Synth().toDestination();


for(let i=0; i<15; i++)
{
    let button = document.createElement("button");
    instrument.appendChild(button);

    button.addEventListener("click", () => {
        const now = Tone.now()
        synth.triggerAttackRelease("C4", "8n", now)
    });
}