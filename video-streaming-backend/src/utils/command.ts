import { exec } from "child_process";

function execCommand(command: string) {
  return new Promise((resolve: any, reject: any) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      }
      resolve();
    });
  });
}

export default execCommand;
