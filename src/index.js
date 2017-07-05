import fs from 'fs';
import path from 'path';

export default function(robot, scripts) {
  let scriptsPath = path.resolve(__dirname, 'lib');
  if (fs.existsSync(scriptsPath)) {
    return (() => {
      let result = [];
      for (let script of Array.from(fs.readdirSync(scriptsPath).sort())) {
        if ((scripts != null) && !Array.from(scripts).includes('*')) {
          if (Array.from(scripts).includes(script)) { result.push(robot.loadFile(scriptsPath, script)); } else {
            result.push(undefined);
          }
        } else {
          result.push(robot.loadFile(scriptsPath, script));
        }
      }
      return result;
    })();
  }
};
