const osInfo = require("./info.js");

(async () => {

    const memory = await osInfo.mem();
    console.log("Memory: " + (memory) + "%");
    
    const cpu = await osInfo.cpu();
    console.log("CPU: " +(cpu) + "%");
    
    const disk = await osInfo.disk();
    console.log("Disk: " + (disk) + "%");
    
    console.log({
        uptime: osInfo.uptime()
    })

    console.log({
        isServerRunning: osInfo.isServerRunning()
    })

})()