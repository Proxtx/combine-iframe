//ts = to serve
//ac = answer combine

const jobIdLength = 5;

export const serve = (data) => {
  window.addEventListener(
    "message",
    async (ev) => {
      if (ev.data.substring(0, 10) == "combine-ts") {
        ev.source.postMessage(
          "combine-ac" +
            ev.data.substring(10, jobIdLength + 10) +
            JSON.stringify(
              await data(JSON.parse(ev.data.substring(10 + jobIdLength)))
            ),
          "*"
        );
      } else if (ev.data.substring(0, 4) == "ping") {
        ev.source.postMessage("pong" + ev.data.substring(4), "*");
      }
    },
    false
  );
};

export const genCombine = (module, genModule, server) => {
  return genModule(async (body) => {
    const jobId = randomString(jobIdLength);
    let resolve;
    let result;
    let listener = window.addEventListener("message", async (event) => {
      if (event.data.substring(0, 10 + jobIdLength) == "combine-ac" + jobId) {
        result = JSON.parse(event.data.substring(10 + jobIdLength));
        resolve();
      }
    });
    server.postMessage("combine-ts" + jobId + JSON.stringify(body), "*");
    await new Promise((r) => {
      resolve = r;
    });
    window.removeEventListener("message", listener);
    return result;
  }, module);
};

let chars = "abcdefghijklmnopqrstuvwxyz".split("");
let randomString = (length) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[random(0, chars.length - 1)];
  }
  return result;
};

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
