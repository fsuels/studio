module.exports = function (file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.Literal, { value: /^\/docs\/us\// })
    .replaceWith(() =>
      j.callExpression(j.identifier('getRoute'), [
        j.identifier('doc'),
        j.literal('en' /* locale placeholder */),
      ])
    )
    .toSource();
};
