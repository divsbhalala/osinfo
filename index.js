const osInfo = require("./info.js");

osInfo.mem(memory => {
    console.log("Memory: " + (memory) + "%");
});

osInfo.cpu(cpu => {
    console.log("CPU: " +(cpu) + "%");
});

osInfo.disk(disk => {
    console.log("Disk: " + (disk) + "%");
});
