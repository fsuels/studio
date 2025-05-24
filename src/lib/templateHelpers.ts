import Handlebars from 'handlebars';

export function registerTemplateHelpers(hbs: typeof Handlebars = Handlebars) {
  // Ensure built-in helpers are registered when using the runtime only build
  if (!hbs.helpers.if) hbs.registerHelper('if', Handlebars.helpers.if);
  if (!hbs.helpers.unless) hbs.registerHelper('unless', Handlebars.helpers.unless);
  if (!hbs.helpers.each) hbs.registerHelper('each', Handlebars.helpers.each);

  // Custom helper to conditionally render based on state
  hbs.registerHelper('ifState', function (this: any, expected: string, options: Handlebars.HelperOptions) {
    const current = String((this.state ?? this.form?.state ?? '')).toLowerCase();
    return current === String(expected).toLowerCase() ? options.fn(this) : options.inverse(this);
  });
}

// Register immediately using the default instance
registerTemplateHelpers();

export default Handlebars;
