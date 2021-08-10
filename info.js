const os = require("os");
const fs = require("fs");
const exec = require('node-exec-promise').exec;
const si = require("systeminformation");
const checkDiskSpace = require("check-disk-space").default;
const rootPath = os.platform() === "win32" ? "c:" : "/";

const cpuAverage = () => {
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
    for (var i = 0, len = cpus.length; i < len; i++) {
        var cpu = cpus[i];
        for (type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    }
    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

const arrAvg = (arr) => {
    if (arr && arr.length >= 1) {
        const sumArr = arr.reduce((a, b) => a + b, 0)
        return sumArr / arr.length;
    }
};

const getCPULoadAVG = (avgTime = 1000, delay = 100) => {
    return new Promise((resolve, reject) => {
        const n = ~~(avgTime / delay);
        if (n <= 1) {
            reject("Error: interval too small");
        }
        let i = 0;
        let samples = [];
        const avg1 = cpuAverage();
        let interval = setInterval(() => {
            if (i >= n) {
                clearInterval(interval);
                resolve(((arrAvg(samples) * 100)));
            }
            const avg2 = cpuAverage();
            const totalDiff = avg2.total - avg1.total;
            const idleDiff = avg2.idle - avg1.idle;
            samples[i] = (1 - idleDiff / totalDiff);
            i++;
        }, delay);
    });
}

exports.cpu = async () => {
    const avg = await getCPULoadAVG(1000, 100);
    return avg / 100;
}

exports.mem = async () => {
    const mem = await si.mem();
    let memoryUsage = mem.active / mem.total;
        return (memoryUsage * 100) / 100;
}

exports.disk = async () => {
    const diskSpace = await checkDiskSpace(rootPath);
    let used = diskSpace.size - diskSpace.free;
    return (used / diskSpace.size * 100) / 100;
}

Number.prototype.zeroPad = function(length) {
    length = length || 2; // defaults to 2 if no parameter is passed
    return (new Array(length).join('0')+this).slice(length*-1);
 };
 
function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " day(s), ") : "";
    var hDisplay = h > 0 ? h.zeroPad() + (":") : "";
    var mDisplay = m > 0 ? m.zeroPad() + (":") : "";
    var sDisplay = s > 0 ? s.zeroPad(): "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

exports.uptime = () => {
    try {
        // const data = fs.readFileSync('/proc/uptime', 'utf8')
        const data = "2958818.21 2928140.36";
        let tmp = data.split(" ");
        // let dd = (round(tmp[0])<86400 || round(tmp[0])>= 172800) ? " \d\a\y\s " : " \d\a\y ";
        return secondsToDhms(tmp[0]);
      } catch (err) {
        console.error(err)
        return "";
      }
}

exports.isServerRunning = () => {
    console.log({tt: exec('pidof bc-server')})
    return (exec('pidof bc-server')) ? true : false;
}