const toNumbers = index => {
  return index == 0
    ? 'One'
    : index == 1
    ? 'Two'
    : index == 2
    ? 'Three'
    : index == 3
    ? 'Four'
    : '';
};

module.exports = { toNumbers };
