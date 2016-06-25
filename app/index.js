import 'babel-polyfill';
import 'react';
import { fooModule } from './foo/foo';

document.body.appendChild(fooModule());
