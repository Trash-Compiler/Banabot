import glob from 'glob';
import path from 'path';
// import path from 'path';

// Loading in all of the events
export class EventHandler {
    constructor(){
        console.log(`[EVENTS] Event loader started!`);
        this.loadEvents();
    }

    private loadEvents(): void {
        const dir = (path.join(__dirname, `../events/`)).replace(/\\/g, `/`);
        glob(`${dir}/*.*`, {absolute: false}, (error, files) => {
            files = files.filter(f => f.endsWith(`.js`) || f.endsWith(`.ts`));
            if (files.length < 1) return console.log(`[WARNING] There are no events to load...`);
            let fileRegexTS = new RegExp(/\/{0}([A-z-/\d]){1,100}([^A-z.ts]){1}/g); // converts the whole url path to just fileName
            let fileRegexJS = new RegExp(/\/{0}([A-z-/\d]){1,100}([^A-z.js]){1}/g); // converts the whole url path to just fileName
            let i = 0;
            console.log(`[EVENTS] Loading ${files.length} Events...`);
            files.forEach(async f => {
                let formattedEvent:string = f.replace(fileRegexTS, ``).replace(fileRegexJS, ``);
                require(`${f}`);
                console.log(`[EVENTS] ${i + 1}: ${formattedEvent} loaded!`);
                i++;
            });

        });
        return;
    }

}
