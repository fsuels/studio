// transforms/addCommonNamespace.js
export default function transformer(fileInfo, { j }) {
  const root = j(fileInfo.source);

  root
    .find(j.CallExpression, {
      callee: { name: 'useTranslation' },
      arguments: [],
    })
    .forEach((path) => {
      path.node.arguments = [j.literal('common')];
    });

  return root.toSource();
}
