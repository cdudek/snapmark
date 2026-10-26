import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Tests run with SNAPMARK_NO_UI and must never pull focus from the owner's apps: every activation goes through focusApp().
const src = fs.readFileSync(path.join(__dirname, '../../src/main.ts'), 'utf8');
assert.deepStrictEqual(src.match(/app\.focus\(/g), ['app.focus('], 'call focusApp() instead of app.focus()');
assert.ok(!src.includes('app.show('), 'app.show() activates the app too');

console.log('focus: ok');
