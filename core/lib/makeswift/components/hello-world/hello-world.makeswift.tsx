import { runtime } from '~/lib/makeswift/runtime';
import { TextInput } from '@makeswift/runtime/controls';

import { HelloWorld } from '~/components/hello-world';

runtime.registerComponent(HelloWorld, {
  type: 'hello-world',
  label: 'Basic / Hello World',
  props: {
    name: TextInput({
      label: 'Name',
      defaultValue: 'world',
    }),
  },
});
