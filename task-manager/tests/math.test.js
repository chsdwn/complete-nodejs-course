it('Async test demo', (done) => {
  setTimeout(() => {
    expect(1).toBe(2);
    done();
  }, 2000);
});

it('should add two numbers', (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });
});

it('should add tho number async/await', async () => {
  const sum = await add(1, 2);
  expect(sum).toBe(3);
});

const add = (num1, num2) => {
  return new Promise((res, _) => {
    setTimeout(() => {
      res(num1 + num2);
    }, 2000);
  });
};
