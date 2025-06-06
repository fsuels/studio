# Performance Comparison Tips

For consistent results when testing site performance:

- Keep hardware, browser versions, and network conditions the same between test runs.
- Use an incognito window or clear the cache to prevent cached resources from skewing metrics.
- Examine CPU usage in Chrome DevTools' main-thread timeline. Focus on scripting and rendering sections and look for reductions after each change.
- After every optimization, record metrics like Total Blocking Time (TBT) in a spreadsheet or dashboard to track whether improvements translate to smoother user interactions.
