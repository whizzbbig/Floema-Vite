module.exports = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode('PrismicData', async function () {
    const data = await fetchPrismicData();
    return JSON.stringify(data);
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
    passthroughFileCopy: true,
  };
};
