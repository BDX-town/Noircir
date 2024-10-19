/* eslint-disable no-eval */
import { parse } from "react-docgen";
import fs from "fs";
import { exit } from "process";
import path from "path";
import { format } from "prettier";
import FindAllDefinitionsResolver from "react-docgen/dist/resolver/FindAllDefinitionsResolver.js";

process.argv.shift();
process.argv.shift();

if (process.argv.length === 0) {
  exit(1);
}

const filePath = process.argv[0];

function generateArgs(props) {
  return Object.keys(props).reduce((acc, curr) => {
    if (!props[curr].defaultValue) return acc;
    return {
      ...acc,
      [curr]: eval(props[curr].defaultValue.value),
    };
  }, {});
}

function parseArgsType(type) {
  switch (type.tsType.name) {
    case "union": {
      const options = type.tsType.elements
        .map((e) => eval(e.value))
        .filter((e) => !!e);
      if (options.length === 0) return null;
      return {
        options,
        control: { type: "select" },
        defaultValue: eval(type.defaultValue?.value),
      };
    }
    default:
      return null;
  }
}

function generateArgsType(props) {
  return Object.keys(props).reduce((acc, curr) => {
    const type = parseArgsType(props[curr]);
    if (!type) return acc;
    return {
      ...acc,
      [curr]: parseArgsType(props[curr]),
    };
  }, {});
}

async function generateStory(name, props) {
  const hasChildren = Object.keys(props).indexOf("children") !== -1;
  const fileName = filePath.split(path.sep).pop();

  const output = `
        import type { Story } from "@ladle/react";
        import React from 'react';
        import { ${name} } from './${fileName}';

        export const ${name}Story: Story = (props) => <${name} {...props}>${
          hasChildren ? "Test" : ""
        }</${name}>;
        ${name}Story.storyName = "${name}";

        ${name}Story.args = ${JSON.stringify(generateArgs(props))};
        ${name}Story.argTypes = ${JSON.stringify(generateArgsType(props))};
    `;

  const out = await format(output, { semi: false, filepath: filePath });

  fs.writeFileSync(
    path.join(path.dirname(filePath), `${name}.stories.tsx`),
    out,
  );
}

const file = fs.readFileSync(filePath);
const docs = parse(file.toString(), {
  filename: filePath,
  resolver: new FindAllDefinitionsResolver(),
});

docs.forEach((doc) => generateStory(doc.displayName, doc.props));
